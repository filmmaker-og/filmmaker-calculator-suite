-- Create the saved_calculations table for storing user waterfall calculations
CREATE TABLE public.saved_calculations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    inputs JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.saved_calculations ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for individual user access only
CREATE POLICY "Individual Access" 
ON public.saved_calculations 
FOR ALL 
USING (auth.uid() = user_id);

-- Create index for faster user lookups
CREATE INDEX idx_saved_calculations_user_id ON public.saved_calculations(user_id);