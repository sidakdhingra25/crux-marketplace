import { NextRequest, NextResponse } from "next/server"
import { updateUserRole, getUserById, VALID_ROLES, hasRole, hasAnyRole } from "@/lib/database-new"

export async function POST(request: NextRequest) {
  try {
    const { userId, roles } = await request.json()
    
    if (!userId || !roles) {
      return NextResponse.json({ 
        error: "userId and roles are required" 
      }, { status: 400 })
    }
    
    // Update user roles
    const updatedUser = await updateUserRole(userId, roles)
    
    if (!updatedUser) {
      return NextResponse.json({ 
        error: "User not found" 
      }, { status: 404 })
    }
    
    // Test role checking functions
    const roleTests = {
      hasFounder: hasRole(updatedUser.roles, 'founder'),
      hasAdmin: hasRole(updatedUser.roles, 'admin'),
      hasModerator: hasRole(updatedUser.roles, 'moderator'),
      hasAnyAdminRole: hasAnyRole(updatedUser.roles, ['founder', 'admin']),
      hasAnyCreatorRole: hasAnyRole(updatedUser.roles, ['founder', 'verified_creator']),
    }
    
    return NextResponse.json({ 
      success: true,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        roles: updatedUser.roles
      },
      roleTests,
      validRoles: VALID_ROLES
    })
    
  } catch (error) {
    console.error("Role test error:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to update roles" 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ 
        error: "userId is required" 
      }, { status: 400 })
    }
    
    const user = await getUserById(userId)
    
    if (!user) {
      return NextResponse.json({ 
        error: "User not found" 
      }, { status: 404 })
    }
    
    // Test role checking functions
    const roleTests = {
      hasFounder: hasRole(user.roles, 'founder'),
      hasAdmin: hasRole(user.roles, 'admin'),
      hasModerator: hasRole(user.roles, 'moderator'),
      hasVerifiedCreator: hasRole(user.roles, 'verified_creator'),
      hasCrew: hasRole(user.roles, 'crew'),
      hasAnyAdminRole: hasAnyRole(user.roles, ['founder', 'admin']),
      hasAnyCreatorRole: hasAnyRole(user.roles, ['founder', 'verified_creator']),
    }
    
    return NextResponse.json({ 
      user: {
        id: user.id,
        username: user.username,
        roles: user.roles
      },
      roleTests,
      validRoles: VALID_ROLES
    })
    
  } catch (error) {
    console.error("Role test error:", error)
    return NextResponse.json({ 
      error: "Failed to get user roles" 
    }, { status: 500 })
  }
}
