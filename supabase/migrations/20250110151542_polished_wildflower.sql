/*
  # Initial schema for engineering notes management

  1. New Tables
    - schemes (academic year schemes)
    - branches (engineering branches)
    - modules (subjects/courses)
    - units (course units with materials)
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated admin access
*/

-- Create schemes table
CREATE TABLE IF NOT EXISTS schemes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create branches table
CREATE TABLE IF NOT EXISTS branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create modules table
CREATE TABLE IF NOT EXISTS modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  scheme_id uuid REFERENCES schemes(id),
  branch_id uuid REFERENCES branches(id),
  semester integer NOT NULL,
  credits integer DEFAULT 4,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create units table
CREATE TABLE IF NOT EXISTS units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid REFERENCES modules(id),
  unit_number integer NOT NULL,
  title text NOT NULL,
  description text,
  drive_file_id text,
  topics jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(module_id, unit_number)
);

-- Enable RLS
ALTER TABLE schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (admins)
CREATE POLICY "Allow full access to authenticated users" ON schemes
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow full access to authenticated users" ON branches
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow full access to authenticated users" ON modules
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow full access to authenticated users" ON units
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for public read access
CREATE POLICY "Allow public read access" ON schemes
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "Allow public read access" ON branches
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "Allow public read access" ON modules
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "Allow public read access" ON units
  FOR SELECT TO anon
  USING (true);