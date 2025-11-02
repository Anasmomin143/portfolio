-- Personal Details Table
-- Stores personal information for each tenant's portfolio

CREATE TABLE IF NOT EXISTS personal_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID UNIQUE NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  -- Basic Information
  full_name VARCHAR(255),
  title VARCHAR(255), -- e.g., "Full Stack Developer", "Software Engineer"
  email VARCHAR(255),
  phone VARCHAR(50),
  location VARCHAR(255), -- e.g., "San Francisco, CA"

  -- About/Bio
  bio TEXT,
  summary TEXT, -- Short professional summary

  -- Social Media Links
  linkedin_url VARCHAR(500),
  github_url VARCHAR(500),
  twitter_url VARCHAR(500),
  portfolio_url VARCHAR(500),
  website_url VARCHAR(500),

  -- Media
  profile_photo_url VARCHAR(500),
  resume_url VARCHAR(500),

  -- Additional Fields (stored as JSONB for flexibility)
  custom_fields JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast tenant lookups
CREATE INDEX IF NOT EXISTS idx_personal_details_tenant ON personal_details(tenant_id);

-- Updated at trigger
CREATE TRIGGER update_personal_details_updated_at
  BEFORE UPDATE ON personal_details
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE personal_details ENABLE ROW LEVEL SECURITY;

-- Public can read personal details for active tenants
CREATE POLICY "Public read personal details" ON personal_details
  FOR SELECT USING (
    tenant_id IN (SELECT id FROM tenants WHERE status = 'active')
  );

-- Service role has full access
CREATE POLICY "Service role full access personal details" ON personal_details
  FOR ALL USING (auth.role() = 'service_role');

-- Comments
COMMENT ON TABLE personal_details IS 'Personal information for each tenant portfolio';
COMMENT ON COLUMN personal_details.tenant_id IS 'Links personal details to tenant';
COMMENT ON COLUMN personal_details.custom_fields IS 'Additional custom fields in JSON format';
