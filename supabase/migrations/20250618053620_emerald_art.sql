/*
  # Create Contributions Table for Community Posts

  1. New Tables
    - `contributions`
      - `id` (uuid, primary key)
      - `auth_user_id` (uuid, foreign key to auth.users)
      - `title` (text, post title)
      - `content` (text, post content)
      - `image_url` (text, optional image)
      - `category` (text, post category)
      - `votes` (integer, vote count)
      - `nft_id` (text, optional NFT identifier)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `contributions` table
    - Add policies for authenticated users to read all and manage their own posts
*/

CREATE TABLE IF NOT EXISTS contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  image_url text,
  category text NOT NULL DEFAULT 'Discussion',
  votes integer DEFAULT 0,
  nft_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read contributions
CREATE POLICY "Anyone can read contributions"
  ON contributions
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to insert their own contributions
CREATE POLICY "Users can insert own contributions"
  ON contributions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = auth_user_id);

-- Allow users to update their own contributions
CREATE POLICY "Users can update own contributions"
  ON contributions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id);

-- Create votes table for tracking user votes
CREATE TABLE IF NOT EXISTS contribution_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id uuid REFERENCES contributions(id) ON DELETE CASCADE,
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(contribution_id, auth_user_id)
);

ALTER TABLE contribution_votes ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read and manage their own votes
CREATE POLICY "Users can read all votes"
  ON contribution_votes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own votes"
  ON contribution_votes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Users can delete own votes"
  ON contribution_votes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = auth_user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contributions_auth_user_id ON contributions(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_contributions_created_at ON contributions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contributions_votes ON contributions(votes DESC);
CREATE INDEX IF NOT EXISTS idx_contribution_votes_contribution_id ON contribution_votes(contribution_id);
CREATE INDEX IF NOT EXISTS idx_contribution_votes_auth_user_id ON contribution_votes(auth_user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_contributions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contributions_updated_at 
  BEFORE UPDATE ON contributions 
  FOR EACH ROW 
  EXECUTE FUNCTION update_contributions_updated_at();

-- Function to update vote count when votes are added/removed
CREATE OR REPLACE FUNCTION update_contribution_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE contributions 
    SET votes = votes + 1 
    WHERE id = NEW.contribution_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE contributions 
    SET votes = votes - 1 
    WHERE id = OLD.contribution_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contribution_vote_count_trigger
  AFTER INSERT OR DELETE ON contribution_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_contribution_vote_count();