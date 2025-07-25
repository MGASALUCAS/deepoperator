import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Reminder {
  id: string;
  reminder_id: string;
  category: string;
  title: string;
  message: string;
  created_at: string;
  updated_at: string;
}

export interface PredefinedCategory {
  id: string;
  name: string;
  icon: string;
  messages: { id: number; title: string; content: string }[];
}

export interface AutomationRule {
  id: number;
  name: string;
  trigger: string;
  action: string;
  status: 'active' | 'paused';
  category: string;
  created_at?: string;
  updated_at?: string;
}

export const useReminders = () => {
  const [categories, setCategories] = useState<PredefinedCategory[]>([]);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('excel-sync', {
        body: { action: 'get_categories' }
      });

      if (error) throw error;
      if (data.success) {
        setCategories(data.data);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to load categories from Excel data",
        variant: "destructive"
      });
    }
  };

  const fetchAutomationRules = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('excel-sync', {
        body: { action: 'get_automation_rules' }
      });

      if (error) throw error;
      if (data.success) {
        // Transform to match the expected interface
        const transformedRules = data.data.map((rule: any, index: number) => ({
          id: parseInt(rule.id) || index + 1,
          name: rule.name,
          trigger: rule.trigger_condition,
          action: rule.action,
          status: rule.status,
          category: rule.category,
          created_at: rule.created_at,
          updated_at: rule.updated_at
        }));
        setAutomationRules(transformedRules);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error fetching automation rules:', error);
      toast({
        title: "Error",
        description: "Failed to load automation rules",
        variant: "destructive"
      });
    }
  };

  const addReminder = async (category: string, title: string, message: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('excel-sync', {
        body: { 
          action: 'add_reminder',
          category,
          title,
          message
        }
      });

      if (error) throw error;
      if (data.success) {
        await fetchCategories(); // Refresh categories
        toast({
          title: "Success",
          description: "Reminder added and synced to Excel file"
        });
        return data.data;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error adding reminder:', error);
      toast({
        title: "Error",
        description: "Failed to add reminder",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateReminder = async (id: string, title: string, message: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('excel-sync', {
        body: { 
          action: 'update_reminder',
          id,
          title,
          message
        }
      });

      if (error) throw error;
      if (data.success) {
        await fetchCategories(); // Refresh categories
        toast({
          title: "Success",
          description: "Reminder updated and synced to Excel file"
        });
        return data.data;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error updating reminder:', error);
      toast({
        title: "Error",
        description: "Failed to update reminder",
        variant: "destructive"
      });
      throw error;
    }
  };

  const addCategory = async (name: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('excel-sync', {
        body: { 
          action: 'add_category',
          name
        }
      });

      if (error) throw error;
      if (data.success) {
        await fetchCategories(); // Refresh categories
        toast({
          title: "Success",
          description: "Category added and synced to Excel file"
        });
        return data.data;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive"
      });
      throw error;
    }
  };

  const toggleAutomationRule = async (id: string, status: 'active' | 'paused') => {
    try {
      const { data, error } = await supabase.functions.invoke('excel-sync', {
        body: { 
          action: 'toggle_rule',
          id,
          status
        }
      });

      if (error) throw error;
      if (data.success) {
        await fetchAutomationRules(); // Refresh rules
        toast({
          title: "Success",
          description: `Automation rule ${status === 'active' ? 'activated' : 'paused'}`
        });
        return data.data;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error toggling automation rule:', error);
      toast({
        title: "Error",
        description: "Failed to toggle automation rule",
        variant: "destructive"
      });
      throw error;
    }
  };

  const getSmartMessageSelection = async (ruleId: string, category: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('excel-sync', {
        body: { 
          action: 'smart_message_selection',
          ruleId,
          category
        }
      });

      if (error) throw error;
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error getting smart message selection:', error);
      toast({
        title: "Error",
        description: "Failed to get smart message selection",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCategories(), fetchAutomationRules()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    categories,
    automationRules,
    loading,
    addReminder,
    updateReminder,
    addCategory,
    toggleAutomationRule,
    getSmartMessageSelection,
    refreshCategories: fetchCategories,
    refreshAutomationRules: fetchAutomationRules
  };
};