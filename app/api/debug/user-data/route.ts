import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { 
  getPendingScripts, 
  getApprovedScripts, 
  getRejectedScripts,
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

    const userEmail = session.user.email;
    console.log("Debug user data - User:", { id: session.user.id, email: userEmail });

    // Fetch all data
    const [pendingScripts, approvedScripts, rejectedScripts, pendingGiveaways, approvedGiveaways, rejectedGiveaways] = await Promise.all([
      getPendingScripts(1000),
      getApprovedScripts(1000),
      getRejectedScripts(1000),
      getPendingGiveaways(1000),
      getApprovedGiveaways(1000),
      getRejectedGiveaways(1000)
    ]);

    // Filter by user email
    const userScripts = {
      pending: pendingScripts.filter(s => s.seller_email === userEmail),
      approved: approvedScripts.filter(s => s.seller_email === userEmail),
      rejected: rejectedScripts.filter(s => s.seller_email === userEmail)
    };

    const userGiveaways = {
      pending: pendingGiveaways.filter(g => g.creatorEmail === userEmail),
      approved: approvedGiveaways.filter(g => g.creatorEmail === userEmail),
      rejected: rejectedGiveaways.filter(g => g.creatorEmail === userEmail)
    };

    // Sample data for debugging
    const sampleScripts = {
      pending: userScripts.pending.slice(0, 2).map(s => ({ id: s.id, title: s.title, seller_email: s.seller_email })),
      approved: userScripts.approved.slice(0, 2).map(s => ({ id: s.id, title: s.title, seller_email: s.seller_email })),
      rejected: userScripts.rejected.slice(0, 2).map(s => ({ id: s.id, title: s.title, seller_email: s.seller_email }))
    };

    const sampleGiveaways = {
      pending: userGiveaways.pending.slice(0, 2).map(g => ({ id: g.id, title: g.title, creatorEmail: g.creatorEmail })),
      approved: userGiveaways.approved.slice(0, 2).map(g => ({ id: g.id, title: g.title, creatorEmail: g.creatorEmail })),
      rejected: userGiveaways.rejected.slice(0, 2).map(g => ({ id: g.id, title: g.title, creatorEmail: g.creatorEmail }))
    };

    return NextResponse.json({
      user: {
        id: session.user.id,
        email: userEmail
      },
      totalCounts: {
        scripts: {
          total: pendingScripts.length + approvedScripts.length + rejectedScripts.length,
          pending: pendingScripts.length,
          approved: approvedScripts.length,
          rejected: rejectedScripts.length
        },
        giveaways: {
          total: pendingGiveaways.length + approvedGiveaways.length + rejectedGiveaways.length,
          pending: pendingGiveaways.length,
          approved: approvedGiveaways.length,
          rejected: rejectedGiveaways.length
        }
      },
      userCounts: {
        scripts: {
          pending: userScripts.pending.length,
          approved: userScripts.approved.length,
          rejected: userScripts.rejected.length,
          total: userScripts.pending.length + userScripts.approved.length + userScripts.rejected.length
        },
        giveaways: {
          pending: userGiveaways.pending.length,
          approved: userGiveaways.approved.length,
          rejected: userGiveaways.rejected.length,
          total: userGiveaways.pending.length + userGiveaways.approved.length + userGiveaways.rejected.length
        }
      },
      sampleData: {
        scripts: sampleScripts,
        giveaways: sampleGiveaways
      }
    });
  } catch (error) {
    console.error('Error in debug user data API:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}









