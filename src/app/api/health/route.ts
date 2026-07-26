import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { redis } from '@/lib/redis';

export async function GET() {
  const health: any = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unknown',
      cache: 'unknown'
    }
  };

  try {
    // Ping PostgreSQL
    await prisma.$queryRaw`SELECT 1`;
    health.services.database = 'connected';
  } catch (error) {
    health.status = 'unhealthy';
    health.services.database = 'disconnected';
  }

  try {
    // Ping Redis
    await redis.ping();
    health.services.cache = 'connected';
  } catch (error) {
    health.status = 'unhealthy';
    health.services.cache = 'disconnected';
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;

  return NextResponse.json(health, { status: statusCode });
}
