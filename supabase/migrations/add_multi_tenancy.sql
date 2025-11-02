-- Multi-Tenancy Migration
-- Transforms single-tenant portfolio into multi-tenant SaaS platform
-- Each tenant gets their own subdomain and isolated data

-- ============================================
-- TENANTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subdomain VARCHAR(63) UNIQUE NOT NULL, -- DNS subdomain (max 63 chars per RFC 1035)
  name VARCHAR(255) NOT NULL, -- Display name for the tenant
  owner_email VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),

  -- Customization settings (stored as JSONB for flexibility)
  settings JSONB DEFAULT '{}'::jsonb,

  -- Subscription/billing info (for future use)
  plan VARCHAR(50) DEFAULT 'free',

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subdomain validation: lowercase alphanumeric and hyphens only
-- No leading/trailing hyphens, no reserved subdomains
ALTER TABLE tenants ADD CONSTRAINT subdomain_format
  CHECK (subdomain ~ '^[a-z0-9][a-z0-9-]*[a-z0-9]$' AND LENGTH(subdomain) >= 3);

-- Reserved subdomains that cannot be used
CREATE TABLE IF NOT EXISTS reserved_subdomains (
  subdomain VARCHAR(63) PRIMARY KEY
);

INSERT INTO reserved_subdomains (subdomain) VALUES
  ('www'), ('admin'), ('api'), ('app'), ('mail'), ('smtp'),
  ('ftp'), ('webmail'), ('cpanel'), ('whm'), ('ns1'), ('ns2'),
  ('dashboard'), ('portal'), ('login'), ('signup'), ('register'),
  ('blog'), ('help'), ('support'), ('docs'), ('status');

-- Prevent reserved subdomain usage
CREATE OR REPLACE FUNCTION check_reserved_subdomain()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM reserved_subdomains WHERE subdomain = NEW.subdomain) THEN
    RAISE EXCEPTION 'Subdomain "%" is reserved and cannot be used', NEW.subdomain;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_reserved_subdomain
  BEFORE INSERT OR UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION check_reserved_subdomain();

-- Index for fast subdomain lookups (critical for every request)
CREATE INDEX IF NOT EXISTS idx_tenants_subdomain ON tenants(subdomain);

-- ============================================
-- UPDATE ADMIN_USERS TABLE
-- ============================================
-- Add tenant_id and role columns
ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'owner' CHECK (role IN ('owner', 'admin', 'editor'));

-- Create index for tenant-based user queries
CREATE INDEX IF NOT EXISTS idx_admin_users_tenant ON admin_users(tenant_id);

-- ============================================
-- UPDATE DATA TABLES (Add tenant_id)
-- ============================================

-- Projects
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_projects_tenant ON projects(tenant_id);

-- Experience
ALTER TABLE experience
  ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_experience_tenant ON experience(tenant_id);

-- Skills
ALTER TABLE skills
  ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_skills_tenant ON skills(tenant_id);

-- Certifications
ALTER TABLE certifications
  ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_certifications_tenant ON certifications(tenant_id);

-- Update unique constraint on skills to be tenant-scoped
ALTER TABLE skills DROP CONSTRAINT IF EXISTS skills_category_skill_name_key;
ALTER TABLE skills ADD CONSTRAINT skills_category_skill_name_tenant_unique
  UNIQUE(tenant_id, category, skill_name);

-- ============================================
-- UPDATE AUDIT LOG
-- ============================================
ALTER TABLE audit_log
  ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_audit_log_tenant ON audit_log(tenant_id);

-- ============================================
-- UPDATED_AT TRIGGER FOR TENANTS
-- ============================================
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on tenants table
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Public can read tenant info by subdomain (for portfolio display)
CREATE POLICY "Public read active tenants" ON tenants
  FOR SELECT USING (status = 'active');

-- Service role has full access
CREATE POLICY "Service role full access" ON tenants
  FOR ALL USING (auth.role() = 'service_role');

-- Update existing RLS policies to be tenant-scoped
-- Drop old policies
DROP POLICY IF EXISTS "Public read access" ON projects;
DROP POLICY IF EXISTS "Public read access" ON experience;
DROP POLICY IF EXISTS "Public read access" ON skills;
DROP POLICY IF EXISTS "Public read access" ON certifications;

-- New tenant-scoped public read policies
CREATE POLICY "Public read tenant projects" ON projects
  FOR SELECT USING (
    tenant_id IN (SELECT id FROM tenants WHERE status = 'active')
  );

CREATE POLICY "Public read tenant experience" ON experience
  FOR SELECT USING (
    tenant_id IN (SELECT id FROM tenants WHERE status = 'active')
  );

CREATE POLICY "Public read tenant skills" ON skills
  FOR SELECT USING (
    tenant_id IN (SELECT id FROM tenants WHERE status = 'active')
  );

CREATE POLICY "Public read tenant certifications" ON certifications
  FOR SELECT USING (
    tenant_id IN (SELECT id FROM tenants WHERE status = 'active')
  );

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to get tenant_id by subdomain (used in API routes)
CREATE OR REPLACE FUNCTION get_tenant_id_by_subdomain(p_subdomain VARCHAR)
RETURNS UUID AS $$
DECLARE
  v_tenant_id UUID;
BEGIN
  SELECT id INTO v_tenant_id
  FROM tenants
  WHERE subdomain = p_subdomain AND status = 'active';

  RETURN v_tenant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has access to tenant
CREATE OR REPLACE FUNCTION user_has_tenant_access(p_user_id UUID, p_tenant_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = p_user_id AND tenant_id = p_tenant_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE tenants IS 'Multi-tenant isolation - each tenant has a unique subdomain';
COMMENT ON COLUMN tenants.subdomain IS 'Unique subdomain (e.g., "johndoe" for johndoe.domain.com)';
COMMENT ON COLUMN tenants.settings IS 'JSON config for theme, branding, custom domain, etc.';
COMMENT ON COLUMN admin_users.tenant_id IS 'Links user to their tenant workspace';
COMMENT ON COLUMN admin_users.role IS 'User role within tenant: owner (full access), admin (most access), editor (content only)';
