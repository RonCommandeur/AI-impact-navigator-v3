/*
  # Add Trend Data to User Metrics

  1. Schema Changes
    - Add `trend_data` JSONB column to user_metrics table
    - Add index for better query performance

  2. Sample Data
    - Insert sample trend data for demonstration
    - Update existing records with trend information

  3. Functions
    - Update calculate_user_metrics function to include trend data
*/

-- Add trend_data column to user_metrics table
ALTER TABLE user_metrics ADD COLUMN IF NOT EXISTS trend_data JSONB DEFAULT '{}';

-- Create index for trend data queries
CREATE INDEX IF NOT EXISTS idx_user_metrics_trend_data ON user_metrics USING GIN (trend_data);

-- Function to generate sample trend data
CREATE OR REPLACE FUNCTION generate_trend_data()
RETURNS JSONB AS $$
DECLARE
  trends JSONB;
  current_month TEXT;
  job_growth INTEGER;
  skill_demand INTEGER;
  automation_risk INTEGER;
BEGIN
  current_month := to_char(NOW(), 'Month YYYY');
  
  -- Generate realistic trend data with some randomization
  job_growth := 15 + (RANDOM() * 20)::INTEGER; -- 15-35%
  skill_demand := 80 + (RANDOM() * 40)::INTEGER; -- 80-120%
  automation_risk := 25 + (RANDOM() * 15)::INTEGER; -- 25-40%
  
  trends := jsonb_build_object(
    'job_shifts', format('%s%% increase in AI-related positions', job_growth),
    'skill_demand', format('%s%% growth in AI skill requirements', skill_demand),
    'automation_risk', format('%s%% of tasks may be automated', automation_risk),
    'market_outlook', 'Positive growth trajectory in AI adoption',
    'salary_trends', format('%s%% average salary increase for AI skills', 8 + (RANDOM() * 7)::INTEGER),
    'remote_work', format('%s%% of AI jobs offer remote options', 60 + (RANDOM() * 25)::INTEGER),
    'industry_adoption', jsonb_build_array(
      jsonb_build_object('industry', 'Technology', 'adoption_rate', 85 + (RANDOM() * 10)::INTEGER),
      jsonb_build_object('industry', 'Healthcare', 'adoption_rate', 45 + (RANDOM() * 20)::INTEGER),
      jsonb_build_object('industry', 'Finance', 'adoption_rate', 70 + (RANDOM() * 15)::INTEGER),
      jsonb_build_object('industry', 'Education', 'adoption_rate', 35 + (RANDOM() * 25)::INTEGER),
      jsonb_build_object('industry', 'Manufacturing', 'adoption_rate', 55 + (RANDOM() * 20)::INTEGER)
    ),
    'monthly_trends', jsonb_build_array(
      jsonb_build_object('month', 'Jan 2025', 'job_growth', 12, 'skill_demand', 85),
      jsonb_build_object('month', 'Feb 2025', 'job_growth', 15, 'skill_demand', 92),
      jsonb_build_object('month', 'Mar 2025', 'job_growth', 18, 'skill_demand', 98),
      jsonb_build_object('month', 'Apr 2025', 'job_growth', 22, 'skill_demand', 105),
      jsonb_build_object('month', 'May 2025', 'job_growth', 25, 'skill_demand', 112),
      jsonb_build_object('month', 'Jun 2025', 'job_growth', job_growth, 'skill_demand', skill_demand)
    ),
    'last_updated', NOW()
  );
  
  RETURN trends;
END;
$$ LANGUAGE plpgsql;

-- Update existing user_metrics records with trend data
UPDATE user_metrics 
SET trend_data = generate_trend_data()
WHERE trend_data = '{}' OR trend_data IS NULL;

-- Update the calculate_user_metrics function to include trend data
CREATE OR REPLACE FUNCTION calculate_user_metrics_with_trends(user_id uuid)
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
  trend_data jsonb;
BEGIN
  -- Get skills from user profile
  SELECT COALESCE(skills, ARRAY[]::text[]) INTO user_skills
  FROM profiles WHERE auth_user_id = user_id;
  
  skills_count := array_length(user_skills, 1);
  IF skills_count IS NULL THEN skills_count := 0; END IF;

  -- Count assessments (users with ai_prediction)
  SELECT COUNT(*) INTO assessments_count
  FROM profiles 
  WHERE auth_user_id = user_id AND ai_prediction IS NOT NULL;

  -- Count contributions and total votes
  SELECT 
    COUNT(*),
    COALESCE(SUM(votes), 0),
    COUNT(*) FILTER (WHERE nft_id IS NOT NULL)
  INTO contributions_count, total_votes, nfts_count
  FROM contributions 
  WHERE auth_user_id = user_id;

  -- Calculate weekly activity
  weekly_activity := ARRAY[
    GREATEST(0, contributions_count * 2 + assessments_count * 3),
    GREATEST(0, contributions_count * 1 + assessments_count * 2),
    GREATEST(0, contributions_count * 3 + assessments_count * 1),
    GREATEST(0, contributions_count * 2 + assessments_count * 4),
    GREATEST(0, contributions_count * 1 + assessments_count * 2),
    GREATEST(0, contributions_count * 2 + assessments_count * 1),
    GREATEST(0, contributions_count * 4 + assessments_count * 2)
  ];

  -- Generate trend data
  trend_data := generate_trend_data();

  -- Build metrics JSON with trend data
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
    'trend_data', trend_data,
    'last_calculated', to_jsonb(NOW())
  );

  RETURN metrics;
END;
$$ LANGUAGE plpgsql;

-- Function to update user metrics with trends
CREATE OR REPLACE FUNCTION update_user_metrics_with_trends(user_id uuid)
RETURNS void AS $$
DECLARE
  calculated_metrics jsonb;
BEGIN
  -- Calculate metrics with trends
  calculated_metrics := calculate_user_metrics_with_trends(user_id);
  
  -- Upsert metrics
  INSERT INTO user_metrics (auth_user_id, progress, trend_data)
  VALUES (user_id, calculated_metrics, calculated_metrics->'trend_data')
  ON CONFLICT (auth_user_id)
  DO UPDATE SET 
    progress = calculated_metrics,
    trend_data = calculated_metrics->'trend_data',
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Add comment for documentation
COMMENT ON COLUMN user_metrics.trend_data IS 'JSON data containing market trends, job shifts, skill demand, and industry insights';