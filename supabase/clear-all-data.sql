-- ============================================
-- CLEAR ALL USERS, TENANTS, AND DATA
-- ============================================
-- WARNING: This will permanently delete ALL data from the database
-- including all tenants and their subdomains!
-- Use with extreme caution! Make sure you have backups if needed.

-- ============================================
-- METHOD 1: DELETE TENANTS (Simplest - CASCADE deletes everything)
-- ============================================
-- This is the recommended approach since tenant deletion cascades to all related tables

BEGIN;

-- Delete all tenants (CASCADE will automatically delete all related data)
-- This will remove: admin_users, projects, experience, skills, certifications, audit_log
DELETE FROM tenants;

COMMIT;

-- ============================================
-- METHOD 2: DELETE INDIVIDUAL TABLES (More explicit)
-- ============================================
-- Uncomment if you want to delete tables individually before deleting tenants

-- BEGIN;
--
-- -- Clear audit logs first (has foreign key to admin_users and tenants)
-- DELETE FROM audit_log;
--
-- -- Clear all portfolio data (has foreign keys to tenants)
-- DELETE FROM projects;
-- DELETE FROM experience;
-- DELETE FROM skills;
-- DELETE FROM certifications;
--
-- -- Clear admin users (has foreign key to tenants)
-- DELETE FROM admin_users;
--
-- -- Clear tenants last (this contains subdomains)
-- DELETE FROM tenants;
--
-- COMMIT;

-- ============================================
-- METHOD 3: TRUNCATE (Fastest, resets sequences)
-- ============================================
-- Uncomment the lines below to use TRUNCATE instead of DELETE
-- Note: TRUNCATE is faster for large datasets but cannot be rolled back as easily

-- BEGIN;
--
-- TRUNCATE TABLE audit_log CASCADE;
-- TRUNCATE TABLE projects CASCADE;
-- TRUNCATE TABLE experience CASCADE;
-- TRUNCATE TABLE skills CASCADE;
-- TRUNCATE TABLE certifications CASCADE;
-- TRUNCATE TABLE admin_users CASCADE;
-- TRUNCATE TABLE tenants CASCADE;
--
-- COMMIT;
