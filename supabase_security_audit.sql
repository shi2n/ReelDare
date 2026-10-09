-- ============================================================================
-- SUPABASE SECURITY AUDIT SCRIPT
-- ============================================================================
-- Run these queries in Supabase SQL Editor to audit your live database security.

-- Q1: Check for any tables in public schema with RLS DISABLED (Must return 0 rows!)
SELECT 
    schemaname, 
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND rowsecurity = false;

-- Q2: Check all active policies and verify WITH CHECK clauses on UPDATE policies
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual AS using_expression, 
    with_check AS with_check_expression 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, cmd;

-- Q3: Check for dangerous SECURITY DEFINER functions without restricted permissions
SELECT 
    n.nspname AS schema_name,
    p.proname AS function_name,
    pg_get_userbyid(p.proowner) AS function_owner,
    CASE WHEN p.prosecdef THEN 'SECURITY DEFINER' ELSE 'SECURITY INVOKER' END AS security_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
  AND p.prosecdef = true;

-- Q4: Verify foreign keys and indexes on owner columns
SELECT
    t.relname AS table_name,
    i.relname AS index_name,
    a.attname AS column_name
FROM pg_class t
JOIN pg_index ix ON t.oid = ix.indrelid
JOIN pg_class i ON i.oid = ix.indexrelid
JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(ix.indkey)
JOIN pg_namespace n ON n.oid = t.relnamespace
WHERE n.nspname = 'public'
  AND a.attname IN ('user_id', 'id', 'email')
ORDER BY table_name, index_name;

-- Q5: Verify Storage Bucket Privacy (Proof uploads must NOT be public!)
SELECT id, name, public FROM storage.buckets;
