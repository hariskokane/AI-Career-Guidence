/*
  # Update quiz_results table

  1. Changes
    - Add video_id column to quiz_results table
    - Remove module_name column from quiz_results table
    - Add UNIQUE constraint for user_id and video_id in quiz_results

  2. Safety
    - Uses DO blocks for safe column modifications
    - Checks for column existence before modifications
*/

DO $$
BEGIN
  -- Add video_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'quiz_results' AND column_name = 'video_id'
  ) THEN
    ALTER TABLE quiz_results ADD COLUMN video_id text;
  END IF;

  -- Drop module_name column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'quiz_results' AND column_name = 'module_name'
  ) THEN
    ALTER TABLE quiz_results DROP COLUMN module_name;
  END IF;

  -- Make video_id NOT NULL after adding it
  ALTER TABLE quiz_results ALTER COLUMN video_id SET NOT NULL;

  -- Add unique constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'quiz_results_user_id_video_id_key'
  ) THEN
    ALTER TABLE quiz_results 
    ADD CONSTRAINT quiz_results_user_id_video_id_key 
    UNIQUE (user_id, video_id);
  END IF;
END $$;