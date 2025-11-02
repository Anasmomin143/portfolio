import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';

/**
 * Debug endpoint to check session data
 * DELETE THIS FILE in production!
 */
export async function GET() {
  const session = await auth();

  return NextResponse.json({
    session,
    hasTenantId: !!session?.user?.tenantId,
    userId: session?.user?.id,
    tenantId: (session?.user as any)?.tenantId,
    tenantSubdomain: (session?.user as any)?.tenantSubdomain,
  });
}
