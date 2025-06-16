/*
  # Add AI Predictions to Users Table

  1. Schema Changes
    - Add `ai_prediction` JSONB column to users table
    - Add index for better query performance

  2. Security
    - Maintain existing RLS policies
    - Users can only access their own predictions
*/

-- Add ai_prediction column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS ai_prediction JSONB;

-- Create index for AI prediction queries
CREATE INDEX IF NOT EXISTS idx_users_ai_prediction ON users USING GIN (ai_prediction);

-- Add comment for documentation
COMMENT ON COLUMN users.ai_prediction IS 'JSON-based AI impact predictions including risk_score, impact, actions, opportunities, timeframe, confidence, and analysis_date';