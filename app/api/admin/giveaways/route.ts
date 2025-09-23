import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { 
  getPendingGiveaways, 
  getApprovedGiveaways, 
  getRejectedGiveaways,
  approveGiveaway,
  rejectGiveaway
} from '@/lib/database-new';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has admin role
    const userRoles = (session.user as any).roles || [];
    if (!userRoles.includes('admin')) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let giveaways: any[] = [];
    
    if (!status || status === "all") {
      const [pending, approved, rejected] = await Promise.all([
        getPendingGiveaways(1000),
        getApprovedGiveaways(1000),
        getRejectedGiveaways(1000)
      ]);
      giveaways = [
        ...pending.map(g => ({ 
          ...g, 
          status: 'pending',
          creator_name: g.creatorName,
          total_value: g.totalValue,
          created_at: g.createdAt || g.submittedAt
        })),
        ...approved.map(g => ({ 
          ...g, 
          status: 'approved',
          creator_name: g.creatorName,
          total_value: g.totalValue,
          created_at: g.createdAt || g.approvedAt
        })),
        ...rejected.map(g => ({ 
          ...g, 
          status: 'rejected',
          creator_name: g.creatorName,
          total_value: g.totalValue,
          created_at: g.createdAt || g.rejectedAt
        }))
      ];
    } else if (status === "pending") {
      giveaways = await getPendingGiveaways(1000);
      giveaways = giveaways.map(g => ({ 
        ...g, 
        status: 'pending',
        creator_name: g.creatorName,
        total_value: g.totalValue,
        created_at: g.createdAt || g.submittedAt
      }));
    } else if (status === "approved") {
      giveaways = await getApprovedGiveaways(1000);
      giveaways = giveaways.map(g => ({ 
        ...g, 
        status: 'approved',
        creator_name: g.creatorName,
        total_value: g.totalValue,
        created_at: g.createdAt || g.approvedAt
      }));
    } else if (status === "rejected") {
      giveaways = await getRejectedGiveaways(1000);
      giveaways = giveaways.map(g => ({ 
        ...g, 
        status: 'rejected',
        creator_name: g.creatorName,
        total_value: g.totalValue,
        created_at: g.createdAt || g.rejectedAt
      }));
    }

    return NextResponse.json({ giveaways });
  } catch (error) {
    console.error('Error in admin giveaways API:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has admin role
    const userRoles = (session.user as any).roles || [];
    if (!userRoles.includes('admin')) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { giveawayId, status, reason, adminNotes } = body;

    if (!giveawayId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let result: boolean;
    
    if (status === 'approved') {
      result = await approveGiveaway(giveawayId, (session.user as any).id, adminNotes);
    } else if (status === 'rejected') {
      if (!reason) {
        return NextResponse.json({ error: "Rejection reason is required" }, { status: 400 });
      }
      result = await rejectGiveaway(giveawayId, (session.user as any).id, reason, adminNotes);
    } else {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    if (result) {
      return NextResponse.json({ success: true, message: `Giveaway ${status} successfully` });
    } else {
      return NextResponse.json({ error: "Failed to update giveaway" }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in admin giveaways PATCH API:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

