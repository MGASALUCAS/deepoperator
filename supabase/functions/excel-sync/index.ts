import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Reminder {
  id?: string;
  reminder_id: string;
  category: string;
  title: string;
  message: string;
}

interface AutomationRule {
  id?: string;
  name: string;
  trigger_condition: string;
  action: string;
  status: string;
  category: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    
    console.log(`Excel sync request: ${action}`);

    switch (action) {
      case 'get_reminders': {
        const { data, error } = await supabaseClient
          .from('reminders')
          .select('*')
          .order('category')
          .order('reminder_id');

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get_categories': {
        const { data, error } = await supabaseClient
          .from('reminders')
          .select('category')
          .group('category')
          .order('category');

        if (error) throw error;

        // Transform to category format with message counts
        const categories = [];
        const uniqueCategories = [...new Set(data?.map(item => item.category) || [])];
        
        for (const category of uniqueCategories) {
          const { data: messages, error: msgError } = await supabaseClient
            .from('reminders')
            .select('*')
            .eq('category', category);

          if (msgError) throw msgError;

          categories.push({
            id: category.toLowerCase().replace(/\s+/g, '_'),
            name: category,
            icon: 'message-circle',
            messages: messages?.map(m => ({
              id: parseInt(m.reminder_id.split('_')[1] || '1'),
              title: m.title,
              content: m.message
            })) || []
          });
        }

        return new Response(
          JSON.stringify({ success: true, data: categories }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'add_reminder': {
        if (req.method !== 'POST') {
          throw new Error('Method not allowed');
        }

        const body = await req.json();
        const { category, title, message } = body;

        // Generate unique reminder_id
        const timestamp = Date.now();
        const categoryPrefix = category.toLowerCase().replace(/\s+/g, '_');
        const reminder_id = `${categoryPrefix}_${timestamp}`;

        const { data, error } = await supabaseClient
          .from('reminders')
          .insert([{ reminder_id, category, title, message }])
          .select();

        if (error) throw error;

        console.log(`Added reminder: ${reminder_id}`);

        return new Response(
          JSON.stringify({ success: true, data: data[0] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'update_reminder': {
        if (req.method !== 'POST') {
          throw new Error('Method not allowed');
        }

        const body = await req.json();
        const { id, title, message } = body;

        const { data, error } = await supabaseClient
          .from('reminders')
          .update({ title, message })
          .eq('id', id)
          .select();

        if (error) throw error;

        console.log(`Updated reminder: ${id}`);

        return new Response(
          JSON.stringify({ success: true, data: data[0] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'add_category': {
        if (req.method !== 'POST') {
          throw new Error('Method not allowed');
        }

        const body = await req.json();
        const { name } = body;

        // Check if category already exists
        const { data: existing, error: checkError } = await supabaseClient
          .from('reminders')
          .select('category')
          .eq('category', name)
          .limit(1);

        if (checkError) throw checkError;

        if (existing && existing.length > 0) {
          return new Response(
            JSON.stringify({ success: false, error: 'Category already exists' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Create a placeholder reminder for the new category
        const reminder_id = `${name.toLowerCase().replace(/\s+/g, '_')}_placeholder`;
        const { data, error } = await supabaseClient
          .from('reminders')
          .insert([{ 
            reminder_id, 
            category: name, 
            title: 'Placeholder', 
            message: 'Category created. Add your first message.' 
          }])
          .select();

        if (error) throw error;

        console.log(`Added category: ${name}`);

        return new Response(
          JSON.stringify({ success: true, data: data[0] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get_automation_rules': {
        const { data, error } = await supabaseClient
          .from('automation_rules')
          .select('*')
          .order('created_at');

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'toggle_rule': {
        if (req.method !== 'POST') {
          throw new Error('Method not allowed');
        }

        const body = await req.json();
        const { id, status } = body;

        const { data, error } = await supabaseClient
          .from('automation_rules')
          .update({ status })
          .eq('id', id)
          .select();

        if (error) throw error;

        console.log(`Toggled rule ${id} to ${status}`);

        return new Response(
          JSON.stringify({ success: true, data: data[0] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'smart_message_selection': {
        if (req.method !== 'POST') {
          throw new Error('Method not allowed');
        }

        const body = await req.json();
        const { ruleId, category } = body;

        // Get active automation rule
        const { data: rule, error: ruleError } = await supabaseClient
          .from('automation_rules')
          .select('*')
          .eq('id', ruleId)
          .eq('status', 'active')
          .single();

        if (ruleError) throw ruleError;

        // Get all messages for the rule's category
        const { data: messages, error: msgError } = await supabaseClient
          .from('reminders')
          .select('*')
          .eq('category', rule.category);

        if (msgError) throw msgError;

        if (!messages || messages.length === 0) {
          throw new Error(`No messages found for category: ${rule.category}`);
        }

        // Smart selection: randomly pick a message but prefer recent ones
        const weights = messages.map((_, index) => Math.pow(0.8, index));
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        
        let selectedMessage = messages[0];
        for (let i = 0; i < messages.length; i++) {
          random -= weights[i];
          if (random <= 0) {
            selectedMessage = messages[i];
            break;
          }
        }

        console.log(`Smart selection for rule ${ruleId}: ${selectedMessage.title}`);

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: {
              rule,
              selectedMessage,
              totalMessages: messages.length
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

  } catch (error) {
    console.error('Excel sync error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});