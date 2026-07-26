import { NextResponse } from 'next/server';
import client from 'prom-client';

// Initialize the default metrics (memory, CPU, event loop, etc.)
// We only want to collect default metrics once in development due to hot reloading
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Example custom metric
export const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});
register.registerMetric(httpRequestCounter);

export async function GET() {
  try {
    const metrics = await register.metrics();
    return new NextResponse(metrics, {
      status: 200,
      headers: {
        'Content-Type': register.contentType,
      },
    });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
