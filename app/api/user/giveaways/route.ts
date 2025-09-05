import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { 
  getPendingGiveaways, 
  getApprovedGiveaways, 
  getRejectedGiveaways 
} from '@/lib/database-new';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const userEmail = session.user.email;
    console.log("User giveaways API - User:", { id: userId, email: userEmail });

    // Fetch giveaways from all tables where the user is the creator
    const [pending, approved, rejected] = await Promise.all([
      getPendingGiveaways(1000),
      getApprovedGiveaways(1000),
      getRejectedGiveaways(1000)
    ]);

    // Filter giveaways by user email
    const userPending = pending.filter(g => g.creatorEmail === userEmail);
    const userApproved = approved.filter(g => g.creatorEmail === userEmail);
    const userRejected = rejected.filter(g => g.creatorEmail === userEmail);

    console.log("User giveaways API - Found giveaways:", { 
      total: pending.length + approved.length + rejected.length,
      userPending: userPending.length, 
      userApproved: userApproved.length, 
      userRejected: userRejected.length 
    });

    // Combine and format the giveaways
    const allGiveaways = [
      ...userPending.map(g => ({ 
        ...g, 
        status: 'pending',
        creator_id: userId,
        creator_name: g.creatorName,
        total_value: g.totalValue,
        created_at: g.createdAt || g.submittedAt,
        updated_at: g.updatedAt
      })),
      ...userApproved.map(g => ({ 
        ...g, 
        status: 'approved',
        creator_id: userId,
        creator_name: g.creatorName,
        total_value: g.totalValue,
        created_at: g.createdAt || g.approvedAt,
        updated_at: g.updatedAt
      })),
      ...userRejected.map(g => ({ 
        ...g, 
        status: 'rejected',
        creator_id: userId,
        creator_name: g.creatorName,
        total_value: g.totalValue,
        created_at: g.createdAt || g.rejectedAt,
        updated_at: g.updatedAt
      }))
    ];

    return NextResponse.json({ giveaways: allGiveaways });
  } catch (error) {
    console.error('Error fetching user giveaways:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Allow users to create giveaways using the existing database function
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const userEmail = session.user.email;
    const body = await request.json();

    // For now, we'll return a message that creation is not yet implemented
    // This would require additional database functions to be created
    return NextResponse.json({ 
      success: false, 
      message: "Giveaway creation will be implemented soon."
    });
  } catch (error) {
    console.error('Error creating user giveaway:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Allow users to update their giveaways
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { giveawayId, ...updateData } = body;

    if (!giveawayId) {
      return NextResponse.json({ error: "Giveaway ID is required" }, { status: 400 });
    }

    // For now, we'll return a message that editing is not yet implemented
    return NextResponse.json({ 
      success: false, 
      message: "Giveaway editing will be implemented soon. Please delete and recreate for now."
    });
  } catch (error) {
    console.error('Error updating user giveaway:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Allow users to delete their giveaways
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const giveawayId = searchParams.get('id');

    if (!giveawayId) {
      return NextResponse.json({ error: "Giveaway ID is required" }, { status: 400 });
    }

    // For now, we'll return a message that deletion is not yet implemented
    return NextResponse.json({ 
      success: false, 
      message: "Giveaway deletion will be implemented soon."
    });
  } catch (error) {
    console.error('Error deleting user giveaway:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
