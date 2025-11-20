import { NextRequest, NextResponse } from 'next/server';
import { analyzeTrends } from '@/lib/openai';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get platform metrics (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [totalBookings, totalProviders, totalCustomers] = await Promise.all([
      prisma.service_requests.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.users.count({ where: { role: 'PROVIDER', createdAt: { gte: sevenDaysAgo } } }),
      prisma.users.count({ where: { role: 'CUSTOMER', createdAt: { gte: sevenDaysAgo } } }),
    ]);

    // Mock daily values for trend analysis
    const data = [
      { metric: 'New Bookings', values: [12, 15, 18, 14, 20, 22, 19], timeframe: 'Last 7 days' },
      { metric: 'New Providers', values: [2, 3, 1, 4, 2, 3, 2], timeframe: 'Last 7 days' },
      { metric: 'New Customers', values: [5, 8, 6, 10, 12, 9, 11], timeframe: 'Last 7 days' },
    ];

    const analysis = await analyzeTrends(data);

    return NextResponse.json({
      ...analysis,
      currentMetrics: {
        totalBookings,
        totalProviders,
        totalCustomers,
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to generate analytics' }, { status: 500 });
  }
}
