-- Fix function search path security issue
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';

-- Create Edge Functions for reminders management
CREATE OR REPLACE FUNCTION public.get_reminders()
RETURNS TABLE (
  id UUID,
  reminder_id TEXT,
  category TEXT,
  title TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
SECURITY DEFINER
SET search_path = ''
LANGUAGE sql AS $$
  SELECT id, reminder_id, category, title, message, created_at, updated_at
  FROM public.reminders
  ORDER BY category, reminder_id;
$$;

CREATE OR REPLACE FUNCTION public.get_reminders_by_category(category_name TEXT)
RETURNS TABLE (
  id UUID,
  reminder_id TEXT,
  category TEXT,
  title TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
SECURITY DEFINER
SET search_path = ''
LANGUAGE sql AS $$
  SELECT id, reminder_id, category, title, message, created_at, updated_at
  FROM public.reminders
  WHERE category = category_name
  ORDER BY reminder_id;
$$;

CREATE OR REPLACE FUNCTION public.get_automation_rules()
RETURNS TABLE (
  id UUID,
  name TEXT,
  trigger_condition TEXT,
  action TEXT,
  status TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
SECURITY DEFINER
SET search_path = ''
LANGUAGE sql AS $$
  SELECT id, name, trigger_condition, action, status, category, created_at, updated_at
  FROM public.automation_rules
  ORDER BY created_at;
$$;