-- Create reminders table to mirror Excel file structure
CREATE TABLE public.reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reminder_id TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create automation_rules table for smart rule management
CREATE TABLE public.automation_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  trigger_condition TEXT NOT NULL,
  action TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused')),
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (for future authentication if needed)
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no auth required for now)
CREATE POLICY "Public access to reminders" 
ON public.reminders 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Public access to automation_rules" 
ON public.automation_rules 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_reminders_updated_at
BEFORE UPDATE ON public.reminders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_automation_rules_updated_at
BEFORE UPDATE ON public.automation_rules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data from Excel file structure
INSERT INTO public.reminders (reminder_id, category, title, message) VALUES
('alert_1', 'Alert', 'Website yako Binafsi', 'Duka Mtandao ni kama website yako binafsi. Ni moja ya feature muhimu sana kwenye Kuza — tumia kuitangaza biashara yako.'),
('alert_2', 'Alert', 'Boresha Duka Mtandao', 'Duka Mtandao ni lango la kwanza kwa wateja. Picha bora hujenga imani na kuuza zaidi — hakikisha zinaonyesha bidhaa zako kwa ubora na unawashirikisha.'),
('duka_1', 'Duka Mtandao', 'Washirikishe Wateja', 'Kila duka linahitaji wateja. Share link ya duka lako leo — fursa inaanza na hatua moja.'),
('duka_2', 'Duka Mtandao', 'Okoa Muda', 'Badala ya kujibu maswali mengi kila siku, share duka lako. Mteja ataona kila kitu papo hapo.'),
('info_1', 'Information', 'Chapa Yako Mtandaoni', 'Duka Mtandao si sehemu tu ya bidhaa — ni chapa yako. Litengeneze vizuri. Litumie kwa ufanisi.');

-- Insert sample automation rules
INSERT INTO public.automation_rules (name, trigger_condition, action, status, category) VALUES
('Welcome New Users', 'User Registration', 'Send Welcome Email', 'active', 'Alert'),
('Payment Reminder', 'Overdue Payment > 7 days', 'WhatsApp + Email', 'active', 'Duka Mtandao'),
('Engagement Boost', 'No login > 14 days', 'Push Notification', 'paused', 'Information');