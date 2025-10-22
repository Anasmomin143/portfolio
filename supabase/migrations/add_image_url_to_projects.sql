-- Add image_url column to projects table if it doesn't exist
ALTER TABLE projects ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);
