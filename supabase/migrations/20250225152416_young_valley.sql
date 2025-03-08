/*
  # Initial Schema Setup for Parallel Skill World

  1. New Tables
    - profiles
      - id (uuid, references auth.users)
      - username (text, unique)
      - full_name (text)
      - age (int)
      - education_level (text)
      - current_education (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - career_selections
      - id (uuid)
      - user_id (uuid, references profiles)
      - career_path_1 (text)
      - career_path_2 (text)
      - selection_mode (text) - 'ai' or 'manual'
      - created_at (timestamp)
      - locked (boolean) - prevents changing careers until completion
    
    - mock_test_results
      - id (uuid)
      - user_id (uuid, references profiles)
      - career_path (text)
      - score (int)
      - created_at (timestamp)
    
    - learning_progress
      - id (uuid)
      - user_id (uuid, references profiles)
      - career_path (text)
      - module_name (text)
      - completion_status (boolean)
      - created_at (timestamp)
      - updated_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  full_name text NOT NULL,
  age int NOT NULL,
  education_level text NOT NULL,
  current_education text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create career_selections table
CREATE TABLE career_selections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  career_path_1 text NOT NULL,
  career_path_2 text NOT NULL,
  selection_mode text NOT NULL CHECK (selection_mode IN ('ai', 'manual')),
  created_at timestamptz DEFAULT now(),
  locked boolean DEFAULT true,
  UNIQUE(user_id)
);

-- Create mock_test_results table
CREATE TABLE mock_test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  career_path text NOT NULL,
  score int NOT NULL CHECK (score >= 0 AND score <= 100),
  created_at timestamptz DEFAULT now()
);

-- Create learning_progress table
CREATE TABLE learning_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  career_path text NOT NULL,
  module_name text NOT NULL,
  completion_status boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own career selections"
  ON career_selections FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own career selections"
  ON career_selections FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own career selections"
  ON career_selections FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own test results"
  ON mock_test_results FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own test results"
  ON mock_test_results FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own learning progress"
  ON learning_progress FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own learning progress"
  ON learning_progress FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own learning progress"
  ON learning_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());