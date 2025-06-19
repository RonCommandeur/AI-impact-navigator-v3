/*
  # Create User Metrics Table for Dashboard

  1. New Tables
    - `user_metrics`
      - `id` (uuid, primary key)
      - `auth_user_id` (uuid, foreign key to auth.users)
      - `progress` (jsonb, stores user progress data)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_metrics` table
    - Add policy for authenticated users to manage their own metrics

  3. Functions
    - Function to update user metrics automatically
    - Trigger to update timestamps
*/

-- Create user_metrics table
CREATE TABLE IF NOT EXISTS user_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  progress jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(auth_user_id)
);

-- Enable RLS
ALTER TABLE user_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own metrics" ON user_metrics
  FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert own metrics" ON user_metrics
  FOR INSERT WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own metrics" ON user_metrics
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_metrics_auth_user_id ON user_metrics(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_user_metrics_progress ON user_metrics USING GIN (progress);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_metrics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_metrics_updated_at 
  BEFORE UPDATE ON user_metrics 
  FOR EACH ROW 
  EXECUTE FUNCTION update_user_metrics_updated_at();

-- Function to calculate user metrics from existing data
CREATE OR REPLACE FUNCTION calculate_user_metrics(user_id uuid)
RETURNS jsonb AS $$
DECLARE
  metrics jsonb := '{}';
  skills_count integer := 0;
  assessments_count integer := 0;
  contributions_count integer := 0;
  total_votes integer := 0;
  nfts_count integer := 0;
  user_skills text[];
  weekly_activity integer[] := ARRAY[0,0,0,0,0,0,0];
BEGIN
  -- Get skills from user profile
  SELECT COALESCE(skills, ARRAY[]::text[]) INTO user_skills
  FROM users WHERE auth_user_id = user_id;
  
  skills_count := array_length(user_skills, 1);
  IF skills_count IS NULL THEN skills_count := 0; END IF;

  -- Count assessments (users with ai_prediction)
  SELECT COUNT(*) INTO assessments_count
  FROM users 
  WHERE auth_user_id = user_id AND ai_prediction IS NOT NULL;

  -- Count contributions and total votes
  SELECT 
    COUNT(*),
    COALESCE(SUM(votes), 0),
    COUNT(*) FILTER (WHERE nft_id IS NOT NULL)
  INTO contributions_count, total_votes, nfts_count
  FROM contributions 
  WHERE auth_user_id = user_id;

  -- Calculate weekly activity (mock data for now)
  weekly_activity := ARRAY[
    GREATEST(0, contributions_count * 2 + assessments_count * 3),
    GREATEST(0, contributions_count * 1 + assessments_count * 2),
    GREATEST(0, contributions_count * 3 + assessments_count * 1),
    GREATEST(0, contributions_count * 2 + assessments_count * 4),
    GREATEST(0, contributions_count * 1 + assessments_count * 2),
    GREATEST(0, contributions_count * 2 + assessments_count * 1),
    GREATEST(0, contributions_count * 4 + assessments_count * 2)
  ];

  -- Build metrics JSON
  metrics := jsonb_build_object(
    'skills_learned', COALESCE(user_skills, ARRAY[]::text[]),
    'assessments_completed', assessments_count,
    'community_contributions', contributions_count,
    'nfts_earned', nfts_count,
    'progress_score', LEAST(100, GREATEST(0, 
      (skills_count * 15) + 
      (assessments_count * 25) + 
      (contributions_count * 10) + 
      (nfts_count * 20)
    )),
    'total_votes', total_votes,
    'weekly_activity', to_jsonb(weekly_activity),
    'skill_proficiency', jsonb_build_array(
      jsonb_build_object('skill', 'AI Tools', 'level', LEAST(100, 60 + (skills_count * 5))),
      jsonb_build_object('skill', 'Prompt Engineering', 'level', LEAST(100, 50 + (assessments_count * 10))),
      jsonb_build_object('skill', 'Data Analysis', 'level', LEAST(100, 40 + (contributions_count * 8))),
      jsonb_build_object('skill', 'Creative Strategy', 'level', LEAST(100, 70 + (nfts_count * 10))),
      jsonb_build_object('skill', 'Community Building', 'level', LEAST(100, 30 + (total_votes * 2)))
    ),
    'last_calculated', to_jsonb(NOW())
  );

  RETURN metrics;
END;
$$ LANGUAGE plpgsql;

-- Function to update user metrics
CREATE OR REPLACE FUNCTION update_user_metrics_data(user_id uuid)
RETURNS void AS $$
DECLARE
  calculated_metrics jsonb;
BEGIN
  -- Calculate metrics
  calculated_metrics := calculate_user_metrics(user_id);
  
  -- Upsert metrics
  INSERT INTO user_metrics (auth_user_id, progress)
  VALUES (user_id, calculated_metrics)
  ON CONFLICT (auth_user_id)
  DO UPDATE SET 
    progress = calculated_metrics,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Insert sample data for existing users
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT DISTINCT auth_user_id FROM users WHERE auth_user_id IS NOT NULL
  LOOP
    PERFORM update_user_metrics_data(user_record.auth_user_id);
  END LOOP;
END $$;