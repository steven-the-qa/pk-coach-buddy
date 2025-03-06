-- Create coach profiles table (extending auth.users)
CREATE TABLE coach_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  name text,
  bio text,
  experience_level text,
  adapt_certified boolean DEFAULT false
);

-- Create coaching sessions table
CREATE TABLE coaching_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  coach_id uuid NOT NULL REFERENCES auth.users(id),
  session_date date NOT NULL,
  session_title text NOT NULL,
  duration_minutes integer,
  student_count integer,
  location text,
  goals text,
  completed boolean DEFAULT false
);

-- Create coach reflections table
CREATE TABLE coach_reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  coach_id uuid NOT NULL REFERENCES auth.users(id),
  session_id uuid REFERENCES coaching_sessions(id),
  reflection_text text NOT NULL,
  challenges text,
  successes text,
  ai_insights text
);

-- Create session plans/curriculum table
CREATE TABLE session_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  coach_id uuid NOT NULL REFERENCES auth.users(id),
  title text NOT NULL,
  description text,
  target_skills text[],
  drills jsonb,
  is_template boolean DEFAULT false
);

-- Create knowledge base entries table
CREATE TABLE knowledge_base (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  tags text[]
);

-- Enable Row Level Security on all tables
ALTER TABLE coach_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- Coach profiles policies
CREATE POLICY "Coaches can view their own profile"
  ON coach_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Coaches can update their own profile"
  ON coach_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Coaches can insert their own profile"
  ON coach_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Coaching sessions policies
CREATE POLICY "Coaches can view their own sessions"
  ON coaching_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = coach_id);

CREATE POLICY "Coaches can insert their own sessions"
  ON coaching_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = coach_id);

CREATE POLICY "Coaches can update their own sessions"
  ON coaching_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = coach_id);

CREATE POLICY "Coaches can delete their own sessions"
  ON coaching_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = coach_id);

-- Coach reflections policies
CREATE POLICY "Coaches can view their own reflections"
  ON coach_reflections FOR SELECT
  TO authenticated
  USING (auth.uid() = coach_id);

CREATE POLICY "Coaches can insert their own reflections"
  ON coach_reflections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = coach_id);

CREATE POLICY "Coaches can update their own reflections"
  ON coach_reflections FOR UPDATE
  TO authenticated
  USING (auth.uid() = coach_id);

CREATE POLICY "Coaches can delete their own reflections"
  ON coach_reflections FOR DELETE
  TO authenticated
  USING (auth.uid() = coach_id);

-- Session plans policies
CREATE POLICY "Coaches can view their own session plans"
  ON session_plans FOR SELECT
  TO authenticated
  USING (auth.uid() = coach_id);

CREATE POLICY "Coaches can insert their own session plans"
  ON session_plans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = coach_id);

CREATE POLICY "Coaches can update their own session plans"
  ON session_plans FOR UPDATE
  TO authenticated
  USING (auth.uid() = coach_id);

CREATE POLICY "Coaches can delete their own session plans"
  ON session_plans FOR DELETE
  TO authenticated
  USING (auth.uid() = coach_id);

-- Knowledge base policies (all authenticated users can view)
CREATE POLICY "All users can view knowledge base entries"
  ON knowledge_base FOR SELECT
  TO authenticated
  USING (true);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_coach_profiles_updated_at
BEFORE UPDATE ON coach_profiles
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_knowledge_base_updated_at
BEFORE UPDATE ON knowledge_base
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column(); 