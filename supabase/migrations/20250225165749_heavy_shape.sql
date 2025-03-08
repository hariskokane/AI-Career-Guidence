/*
  # Add video tracking support

  1. Changes
    - Add video_id column to quiz_results table
    - Remove module_name column from quiz_results table
    - Add UNIQUE constraint for user_id and video_id in quiz_results

  2. Safety
    - Uses IF NOT EXISTS for table creation
    - Uses DO blocks for safe column modifications
*/

-- Safely modify quiz_results table
DO $$
BEGIN
  -- Remove module_name column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'quiz_results' AND column_name = 'module_name'
  ) THEN
    ALTER TABLE quiz_results DROP COLUMN module_name;
  END IF;

  -- Add video_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'quiz_results' AND column_name = 'video_id'
  ) THEN
    ALTER TABLE quiz_results ADD COLUMN video_id text NOT NULL DEFAULT '';
  END IF;

  -- Add unique constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'quiz_results_user_id_video_id_key'
  ) THEN
    ALTER TABLE quiz_results ADD CONSTRAINT quiz_results_user_id_video_id_key UNIQUE (user_id, video_id);
  END IF;
END $$;