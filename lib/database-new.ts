import { db } from './db';
import { eq, desc, and, or, like, gte, lte, sql } from 'drizzle-orm';
import { users, scripts, pendingScripts, approvedScripts, rejectedScripts, giveaways, pendingGiveaways, approvedGiveaways, rejectedGiveaways, giveawayEntries, giveawayReviews, scriptReviews, ads, giveawayRequirements, giveawayPrizes, pendingAds, approvedAds, rejectedAds } from './schema';
import type { NewUser, NewScript, NewGiveaway, NewGiveawayEntry, NewGiveawayReview, NewScriptReview, NewAd, NewGiveawayRequirement, NewGiveawayPrize } from './schema';

// User functions
export async function upsertUser(user: {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  username?: string | null;
  forceAdminIfUsername?: string | null;
}) {
  const defaultRoles = ['admin'];
  
  await db.insert(users).values({
    id: user.id,
    name: user.name ?? null,
    email: user.email ?? null,
    image: user.image ?? null,
    username: user.username ?? null,
    roles: defaultRoles,
  }).onConflictDoUpdate({
    target: users.id,
    set: {
      name: user.name ?? null,
      email: user.email ?? null,
      image: user.image ?? null,
      username: user.username ?? null,
      roles: defaultRoles,
      updatedAt: new Date(),
    },
  });
}

export async function getUserById(id: string) {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0] ?? null;
}

export async function getAllUsers(limit?: number) {
  let query = db.select().from(users).orderBy(desc(users.createdAt));
  
  // Apply default limit to prevent memory issues
  const defaultLimit = limit || 100;
  query = query.limit(defaultLimit);
  
  return await query;
}

export async function updateUserRole(userId: string, roles: string[]) {
  const result = await db.update(users)
    .set({ roles: roles, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();
  return result[0] ?? null;
}

// Script functions
export async function createScript(scriptData: NewScript) {
  // Generate a unique ID for Xata Lite compatibility
  // Use a smaller number that fits PostgreSQL integer limits
  const timestamp = Math.floor(Date.now() / 1000); // Convert to seconds
  const randomSuffix = Math.floor(Math.random() * 10000);
  const id = timestamp + randomSuffix;
  
  // Provide default values for required fields
  const scriptWithDefaults = {
    ...scriptData,
    id: id,
    seller_name: scriptData.seller_name || 'Unknown Seller',
    seller_email: scriptData.seller_email || 'unknown@example.com',
    featured: scriptData.featured ?? false,
    // Ensure arrays are properly initialized
    images: scriptData.images || [],
    videos: scriptData.videos || [],
    screenshots: scriptData.screenshots || [],
    tags: scriptData.tags || [],
    features: scriptData.features || [],
    requirements: scriptData.requirements || []
  };
  
  // Insert into pending_scripts table (all new scripts go here)
  const result = await db.insert(pendingScripts).values(scriptWithDefaults).returning({ id: pendingScripts.id });
  return result[0]?.id;
}

export async function getScripts(filters?: {
  category?: string;
  framework?: string;
  status?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}) {
  const maxRetries = 3;
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Always get from approved_scripts table for public access
      let query = db.select().from(approvedScripts);
      
      if (filters?.category) {
        query = query.where(eq(approvedScripts.category, filters.category));
      }
      if (filters?.framework) {
        query = query.where(eq(approvedScripts.framework, filters.framework));
      }
      if (filters?.featured) {
        query = query.where(eq(approvedScripts.featured, true));
      }
      
      query = query.orderBy(desc(approvedScripts.createdAt));
      
      // Apply default limit if none specified to prevent memory issues
      const defaultLimit = filters?.limit || 100;
      query = query.limit(defaultLimit);
      
      if (filters?.offset) {
        query = query.offset(filters.offset);
      }
      
      return await query;
    } catch (error: any) {
      lastError = error;
      console.error(`Database query attempt ${attempt} failed:`, error);
      
      // If it's a connection limit error, wait before retrying
      if (error.cause?.code === 'XATA_CONCURRENCY_LIMIT') {
        const waitTime = attempt * 1000; // Wait 1s, 2s, 3s
        console.log(`Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      // For other errors, don't retry
      break;
    }
  }
  
  throw new Error(`Failed to fetch scripts after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`);
}

export async function getScriptById(id: number) {
  // Search across all script tables to find the script
  try {
    // First check approved_scripts (most common case)
    let result = await db.select().from(approvedScripts).where(eq(approvedScripts.id, id));
    if (result.length > 0) {
      return result[0];
    }
    
    // Check pending_scripts
    result = await db.select().from(pendingScripts).where(eq(pendingScripts.id, id));
    if (result.length > 0) {
      return result[0];
    }
    
    // Check rejected_scripts
    result = await db.select().from(rejectedScripts).where(eq(rejectedScripts.id, id));
    if (result.length > 0) {
      return result[0];
    }
    
    // Fallback to old scripts table for backward compatibility
    result = await db.select().from(scripts).where(eq(scripts.id, id));
    return result[0] ?? null;
  } catch (error) {
    console.error('Error in getScriptById:', error);
    return null;
  }
}

// Admin functions for script management
export async function getPendingScripts(limit?: number) {
  const maxRetries = 3;
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      let query = db.select().from(pendingScripts).orderBy(desc(pendingScripts.createdAt));
      
      if (limit) {
        query = query.limit(limit);
      }
      
      return await query;
    } catch (error: any) {
      lastError = error;
      console.error(`Database query attempt ${attempt} failed:`, error);
      
      if (error.cause?.code === 'XATA_CONCURRENCY_LIMIT') {
        const waitTime = attempt * 1000;
        console.log(`Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      break;
    }
  }
  
  throw new Error(`Failed to fetch pending scripts after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`);
}

export async function getApprovedScripts(limit?: number) {
  const maxRetries = 3;
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      let query = db.select().from(approvedScripts).orderBy(desc(approvedScripts.createdAt));
      
      if (limit) {
        query = query.limit(limit);
      }
      
      return await query;
    } catch (error: any) {
      lastError = error;
      console.error(`Database query attempt ${attempt} failed:`, error);
      
      if (error.cause?.code === 'XATA_CONCURRENCY_LIMIT') {
        const waitTime = attempt * 1000;
        console.log(`Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      break;
    }
  }
  
  throw new Error(`Failed to fetch approved scripts after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`);
}

export async function getRejectedScripts(limit?: number) {
  const maxRetries = 3;
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      let query = db.select().from(rejectedScripts).orderBy(desc(rejectedScripts.createdAt));
      
      if (limit) {
        query = query.limit(limit);
      }
      
      return await query;
    } catch (error: any) {
      lastError = error;
      console.error(`Database query attempt ${attempt} failed:`, error);
      
      if (error.cause?.code === 'XATA_CONCURRENCY_LIMIT') {
        const waitTime = attempt * 1000;
        console.log(`Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      break;
    }
  }
  
  throw new Error(`Failed to fetch rejected scripts after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`);
}

export async function approveScript(scriptId: number, adminId: string, adminNotes?: string) {
  try {
    console.log('approveScript called with:', { scriptId, adminId, adminNotes });
    
    // Get the pending script
    const pendingScript = await db.select().from(pendingScripts).where(eq(pendingScripts.id, scriptId)).limit(1);
    
    if (pendingScript.length === 0) {
      throw new Error('Script not found in pending scripts');
    }
    
    const script = pendingScript[0];
    
    // Insert into approved_scripts table
    const approvedScript = await db.insert(approvedScripts).values({
      ...script,
      approvedAt: new Date(),
      approvedBy: adminId,
      adminNotes: adminNotes || null
    }).returning();
    
    // Delete from pending_scripts table
    await db.delete(pendingScripts).where(eq(pendingScripts.id, scriptId));
    
    console.log('Script approved successfully:', approvedScript[0]);
    return approvedScript[0];
  } catch (error) {
    console.error('Error approving script:', error);
    throw error;
  }
}

export async function rejectScript(scriptId: number, adminId: string, rejectionReason: string, adminNotes?: string) {
  try {
    console.log('rejectScript called with:', { scriptId, adminId, rejectionReason, adminNotes });
    
    // Get the pending script
    const pendingScript = await db.select().from(pendingScripts).where(eq(pendingScripts.id, scriptId)).limit(1);
    
    if (pendingScript.length === 0) {
      throw new Error('Script not found in pending scripts');
    }
    
    const script = pendingScript[0];
    
    // Insert into rejected_scripts table
    const rejectedScript = await db.insert(rejectedScripts).values({
      ...script,
      rejectedAt: new Date(),
      rejectedBy: adminId,
      rejectionReason,
      adminNotes: adminNotes || null
    }).returning();
    
    // Delete from pending_scripts table
    await db.delete(pendingScripts).where(eq(pendingScripts.id, scriptId));
    
    console.log('Script rejected successfully:', rejectedScript[0]);
    return rejectedScript[0];
  } catch (error) {
    console.error('Error rejecting script:', error);
    throw error;
  }
}

// Legacy function for backward compatibility
export async function updateScript(id: number, updateData: Partial<NewScript>) {
  try {
    console.log('updateScript called with:', { id, updateData });
    
    const fields = Object.keys(updateData);
    if (fields.length === 0) return null;
    
    // Build the update object with all fields at once
    const updateObject: any = { updatedAt: new Date() };
    
    // Add all the update fields
    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        updateObject[key] = value;
      }
    });
    
    console.log('Update object:', updateObject);
    
    // Execute the update
    const result = await db.update(scripts)
      .set(updateObject)
      .where(eq(scripts.id, id))
      .returning();
    
    console.log('Update result:', result);
    
    return result[0] ?? null;
  } catch (error) {
    console.error('Error updating script:', error);
    return null;
  }
}

export async function deleteScript(id: number) {
  try {
    const result = await db.delete(scripts).where(eq(scripts.id, id)).returning({ id: scripts.id });
    return result.length > 0;
  } catch (error) {
    console.error('Error deleting script:', error);
    return false;
  }
}

// Giveaway functions
export async function createGiveaway(giveawayData: NewGiveaway) {
  console.log('createGiveaway called with:', giveawayData);
  
  // Generate a unique ID for Xata Lite compatibility
  // Use a smaller number that fits PostgreSQL integer limits
  const timestamp = Math.floor(Date.now() / 1000); // Convert to seconds
  const randomSuffix = Math.floor(Math.random() * 10000);
  const id = timestamp + randomSuffix;
  
  // Provide default values for required fields
  const giveawayWithDefaults = {
    ...giveawayData,
    id: id,
    // Map snake_case input to camelCase schema fields
    totalValue: giveawayData.totalValue || giveawayData.total_value || '0',
    endDate: giveawayData.endDate || giveawayData.end_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: giveawayData.creatorName || giveawayData.creator_name || 'Unknown Creator',
    creatorEmail: giveawayData.creatorEmail || giveawayData.creator_email || 'unknown@example.com',
    creatorId: giveawayData.creatorId || giveawayData.creator_id || 'unknown',
    status: giveawayData.status || 'active',
    featured: giveawayData.featured ?? false,
    entriesCount: giveawayData.entriesCount || giveawayData.entries_count || 0,
    maxEntries: giveawayData.maxEntries || giveawayData.max_entries || null
  };
  
  console.log('giveawayWithDefaults:', giveawayWithDefaults);
  
  // Insert into pending_giveaways table (all new giveaways go here)
  const result = await db.insert(pendingGiveaways).values(giveawayWithDefaults).returning({ id: pendingGiveaways.id });
  return result[0]?.id;
}

export async function createGiveawayRequirement(requirementData: NewGiveawayRequirement) {
  console.log('createGiveawayRequirement called with:', requirementData);
  
  // Generate a unique ID for Xata Lite compatibility
  // Use a smaller number that fits PostgreSQL integer limits
  const timestamp = Math.floor(Date.now() / 1000); // Convert to seconds
  const randomSuffix = Math.floor(Math.random() * 10000);
  const id = timestamp + randomSuffix;
  
  // Map snake_case input to camelCase schema fields
  const mappedData = {
    ...requirementData,
    id: id,
    giveawayId: requirementData.giveawayId || requirementData.giveaway_id
  };
  
  console.log('mappedData:', mappedData);
  
  const result = await db.insert(giveawayRequirements).values(mappedData).returning({ id: giveawayRequirements.id });
  return result[0]?.id;
}

export async function createGiveawayPrize(prizeData: NewGiveawayPrize) {
  console.log('createGiveawayPrize called with:', prizeData);
  
  // Generate a unique ID for Xata Lite compatibility
  // Use a smaller number that fits PostgreSQL integer limits
  const timestamp = Math.floor(Date.now() / 1000); // Convert to seconds
  const randomSuffix = Math.floor(Math.random() * 10000);
  const id = timestamp + randomSuffix;
  
  // Map snake_case input to camelCase schema fields
  const mappedData = {
    ...prizeData,
    id: id,
    giveawayId: prizeData.giveawayId || prizeData.giveaway_id
  };
  
  console.log('mappedData:', mappedData);
  
  const result = await db.insert(giveawayPrizes).values(mappedData).returning({ id: giveawayPrizes.id });
  return result[0]?.id;
}

export async function getGiveaways(filters?: {
  status?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}) {
  // Always get from approved_giveaways table for public access
  let query = db.select().from(approvedGiveaways);
  
  if (filters?.status && filters.status !== 'all') {
    query = query.where(eq(approvedGiveaways.status, filters.status as any));
  }
  if (filters?.featured) {
    query = query.where(eq(approvedGiveaways.featured, true));
  }
  
  query = query.orderBy(desc(approvedGiveaways.createdAt));
  
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }
  if (filters?.offset) {
    query = query.offset(filters.offset);
  }
  
  return await query;
}

export async function getGiveawayById(id: number) {
  // Search across all giveaway tables to find the giveaway
  try {
    let result = await db.select().from(approvedGiveaways).where(eq(approvedGiveaways.id, id));
    if (result.length > 0) {
      const giveaway = result[0];
      const requirements = await db.select().from(giveawayRequirements).where(eq(giveawayRequirements.giveawayId, id));
      const prizes = await db.select().from(giveawayPrizes).where(eq(giveawayPrizes.giveawayId, id));
      
      return {
        ...giveaway,
        requirements,
        prizes,
      };
    }
    
    result = await db.select().from(pendingGiveaways).where(eq(pendingGiveaways.id, id));
    if (result.length > 0) {
      const giveaway = result[0];
      const requirements = await db.select().from(giveawayRequirements).where(eq(giveawayRequirements.giveawayId, id));
      const prizes = await db.select().from(giveawayPrizes).where(eq(giveawayPrizes.giveawayId, id));
      
      return {
        ...giveaway,
        requirements,
        prizes,
      };
    }
    
    result = await db.select().from(rejectedGiveaways).where(eq(rejectedGiveaways.id, id));
    if (result.length > 0) {
      const giveaway = result[0];
      const requirements = await db.select().from(giveawayRequirements).where(eq(giveawayRequirements.giveawayId, id));
      const prizes = await db.select().from(giveawayPrizes).where(eq(giveawayPrizes.giveawayId, id));
      
      return {
        ...giveaway,
        requirements,
        prizes,
      };
    }
    
    // Fallback to old giveaways table for backward compatibility
    result = await db.select().from(giveaways).where(eq(giveaways.id, id));
    if (result.length > 0) {
      const giveaway = result[0];
      const requirements = await db.select().from(giveawayRequirements).where(eq(giveawayRequirements.giveawayId, id));
      const prizes = await db.select().from(giveawayPrizes).where(eq(giveawayPrizes.giveawayId, id));
      
      return {
        ...giveaway,
        requirements,
        prizes,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error in getGiveawayById:', error);
    return null;
  }
}

export async function updateGiveaway(id: number, updateData: Partial<NewGiveaway>) {
  try {
    const fields = Object.keys(updateData);
    if (fields.length === 0) return null;
    
    let updateQuery = db.update(giveaways).set({ updatedAt: new Date() });
    
    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        updateQuery = updateQuery.set({ [key]: value });
      }
    });
    
    const result = await updateQuery.where(eq(giveaways.id, id)).returning();
    return result[0] ?? null;
  } catch (error) {
    console.error('Error updating giveaway:', error);
    return null;
  }
}

export async function deleteGiveaway(id: number) {
  try {
    const result = await db.delete(giveaways).where(eq(giveaways.id, id)).returning({ id: giveaways.id });
    return result.length > 0;
  } catch (error) {
    console.error('Error deleting giveaway:', error);
    return false;
  }
}

// Admin giveaway management functions
export async function getPendingGiveaways(limit?: number) {
  const maxRetries = 3;
  let lastError: any;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      let query = db.select().from(pendingGiveaways).orderBy(desc(pendingGiveaways.submittedAt));
      if (limit) {
        query = query.limit(limit);
      }
      return await query;
    } catch (error: any) {
      lastError = error;
      if (error?.cause?.code === 'XATA_CONCURRENCY_LIMIT' || error?.cause?.code === 'CONNECT_TIMEOUT') {
        const waitTime = attempt * 500;
        await new Promise(r => setTimeout(r, waitTime));
        continue;
      }
      break;
    }
  }
  console.warn('getPendingGiveaways failed after retries:', lastError);
  return [];
}

export async function getApprovedGiveaways(limit?: number) {
  const maxRetries = 3;
  let lastError: any;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      let query = db.select().from(approvedGiveaways).orderBy(desc(approvedGiveaways.approvedAt));
      if (limit) {
        query = query.limit(limit);
      }
      return await query;
    } catch (error: any) {
      lastError = error;
      if (error?.cause?.code === 'XATA_CONCURRENCY_LIMIT' || error?.cause?.code === 'CONNECT_TIMEOUT') {
        const waitTime = attempt * 500;
        await new Promise(r => setTimeout(r, waitTime));
        continue;
      }
      break;
    }
  }
  console.warn('getApprovedGiveaways failed after retries:', lastError);
  return [];
}

export async function getRejectedGiveaways(limit?: number) {
  const maxRetries = 3;
  let lastError: any;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      let query = db.select().from(rejectedGiveaways).orderBy(desc(rejectedGiveaways.rejectedAt));
      if (limit) {
        query = query.limit(limit);
      }
      return await query;
    } catch (error: any) {
      lastError = error;
      if (error?.cause?.code === 'XATA_CONCURRENCY_LIMIT' || error?.cause?.code === 'CONNECT_TIMEOUT') {
        const waitTime = attempt * 500;
        await new Promise(r => setTimeout(r, waitTime));
        continue;
      }
      break;
    }
  }
  console.warn('getRejectedGiveaways failed after retries:', lastError);
  return [];
}

export async function approveGiveaway(giveawayId: number, adminId: string, adminNotes?: string) {
  try {
    // Get the pending giveaway
    const pendingGiveaway = await db.select().from(pendingGiveaways).where(eq(pendingGiveaways.id, giveawayId));
    if (!pendingGiveaway[0]) {
      throw new Error('Pending giveaway not found');
    }

    // Insert into approved_giveaways table
    await db.insert(approvedGiveaways).values({
      ...pendingGiveaway[0],
      approvedBy: adminId,
      adminNotes: adminNotes || null,
    });

    // Delete from pending_giveaways table
    await db.delete(pendingGiveaways).where(eq(pendingGiveaways.id, giveawayId));

    return true;
  } catch (error) {
    console.error('Error approving giveaway:', error);
    return false;
  }
}

export async function rejectGiveaway(giveawayId: number, adminId: string, rejectionReason: string, adminNotes?: string) {
  try {
    // Get the pending giveaway
    const pendingGiveaway = await db.select().from(pendingGiveaways).where(eq(pendingGiveaways.id, giveawayId));
    if (!pendingGiveaway[0]) {
      throw new Error('Pending giveaway not found');
    }

    // Insert into rejected_giveaways table
    await db.insert(rejectedGiveaways).values({
      ...pendingGiveaway[0],
      rejectedBy: adminId,
      rejectionReason: rejectionReason,
      adminNotes: adminNotes || null,
    });

    // Delete from pending_giveaways table
    await db.delete(pendingGiveaways).where(eq(pendingGiveaways.id, giveawayId));

    return true;
  } catch (error) {
    console.error('Error rejecting giveaway:', error);
    return false;
  }
}

// Giveaway Entry functions
export async function createGiveawayEntry(entryData: NewGiveawayEntry) {
  try {
    console.log('createGiveawayEntry called with:', entryData);
    
    // Generate a unique ID for Xata Lite compatibility
    // Use a smaller number that fits PostgreSQL integer limits
    const timestamp = Math.floor(Date.now() / 1000); // Convert to seconds
    const randomSuffix = Math.floor(Math.random() * 10000);
    const id = timestamp + randomSuffix;
    
    // Map snake_case input to camelCase schema fields
    const mappedData = {
      ...entryData,
      id: id,
      giveawayId: entryData.giveawayId || entryData.giveaway_id,
      userId: entryData.userId || entryData.user_id,
      userName: entryData.userName || entryData.user_name,
      userEmail: entryData.userEmail || entryData.user_email,
      entryDate: entryData.entryDate || entryData.entry_date,
      pointsEarned: entryData.pointsEarned || entryData.points_earned,
      requirementsCompleted: entryData.requirementsCompleted || entryData.requirements_completed
    };
    
    console.log('mappedData:', mappedData);
    
    const result = await db.insert(giveawayEntries).values(mappedData).returning({ id: giveawayEntries.id });
    
    // Update the entries count in the approved_giveaways table
    await db.update(approvedGiveaways)
      .set({ 
        entriesCount: sql`${approvedGiveaways.entriesCount} + 1`, 
        updatedAt: new Date() 
      })
      .where(eq(approvedGiveaways.id, mappedData.giveawayId));
    
    return result[0]?.id;
  } catch (error) {
    console.error('Error creating giveaway entry:', error);
    throw error;
  }
}

export async function getGiveawayEntries(giveawayId: number) {
  return await db.select().from(giveawayEntries)
    .where(eq(giveawayEntries.giveawayId, giveawayId))
    .orderBy(desc(giveawayEntries.entryDate));
}

export async function getUserGiveawayEntry(giveawayId: number, userId: string) {
  const result = await db.select().from(giveawayEntries)
    .where(and(
      eq(giveawayEntries.giveawayId, giveawayId),
      eq(giveawayEntries.userId, userId)
    ))
    .limit(1);
  return result[0] ?? null;
}

export async function getUserGiveawayEntries(userId: string) {
  return await db.select({
    ...giveawayEntries,
    giveawayTitle: giveaways.title,
    giveawayCover: giveaways.coverImage,
  })
  .from(giveawayEntries)
  .leftJoin(giveaways, eq(giveawayEntries.giveawayId, giveaways.id))
  .where(eq(giveawayEntries.userId, userId))
  .orderBy(desc(giveawayEntries.entryDate));
}

// Review functions
export async function createGiveawayReview(reviewData: NewGiveawayReview) {
  // Generate a unique ID for Xata Lite compatibility
  // Use a smaller number that fits PostgreSQL integer limits
  const timestamp = Math.floor(Date.now() / 1000); // Convert to seconds
  const randomSuffix = Math.floor(Math.random() * 10000);
  const id = timestamp + randomSuffix;
  
  const result = await db.insert(giveawayReviews).values({
    ...reviewData,
    id: id
  }).returning({ id: giveawayReviews.id });
  return result[0]?.id;
}

export async function getGiveawayReviews(giveawayId: number) {
  return await db.select().from(giveawayReviews)
    .where(eq(giveawayReviews.giveawayId, giveawayId))
    .orderBy(desc(giveawayReviews.createdAt));
}

export async function createScriptReview(reviewData: NewScriptReview) {
  // Generate a unique ID for Xata Lite compatibility
  // Use a smaller number that fits PostgreSQL integer limits
  const timestamp = Math.floor(Date.now() / 1000); // Convert to seconds
  const randomSuffix = Math.floor(Math.random() * 10000);
  const id = timestamp + randomSuffix;
  
  const result = await db.insert(scriptReviews).values({
    ...reviewData,
    id: id
  }).returning({ id: scriptReviews.id });
  return result[0]?.id;
}

export async function getScriptReviews(scriptId: number) {
  return await db.select().from(scriptReviews)
    .where(eq(scriptReviews.scriptId, scriptId))
    .orderBy(desc(scriptReviews.createdAt));
}

// Ad functions
export async function createAd(adData: NewAd) {
  // Generate a unique ID for Xata Lite compatibility
  // Use a smaller number that fits PostgreSQL integer limits
  const timestamp = Math.floor(Date.now() / 1000); // Convert to seconds
  const randomSuffix = Math.floor(Math.random() * 10000);
  const id = timestamp + randomSuffix;

  // Map snake_case input to camelCase schema fields and provide defaults
  const mapped = {
    id: id,
    title: (adData as any).title,
    description: (adData as any).description,
    imageUrl: (adData as any).imageUrl ?? (adData as any).image_url ?? null,
    linkUrl: (adData as any).linkUrl ?? (adData as any).link_url ?? null,
    category: (adData as any).category,
    priority: (adData as any).priority ?? 1,
    startDate: (adData as any).startDate ?? (adData as any).start_date ?? new Date(),
    endDate: (adData as any).endDate ?? (adData as any).end_date ?? null,
    createdBy: (adData as any).createdBy ?? (adData as any).created_by,
  };

  // All new ads go to pending_ads
  const result = await db.insert(pendingAds).values(mapped as any).returning({ id: pendingAds.id });
  return result[0]?.id;
}

export async function getAds(filters?: {
  status?: string;
  category?: string;
  limit?: number;
}) {
  const maxRetries = 3;
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Public listing from approved_ads only
      let query = db.select().from(approvedAds);

      if (filters?.status) {
        query = query.where(eq(approvedAds.status, filters.status as any));
      }
      if (filters?.category) {
        query = query.where(eq(approvedAds.category, filters.category));
      }

      query = query.orderBy(desc(approvedAds.priority), desc(approvedAds.createdAt));

      // Apply default limit if none specified to prevent memory issues
      const limit = filters?.limit || 50;
      query = query.limit(limit);

      return await query;
    } catch (error: any) {
      lastError = error;
      console.error(`Database query attempt ${attempt} failed:`, error);
      
      // If it's a connection limit error, wait before retrying
      if (error.cause?.code === 'XATA_CONCURRENCY_LIMIT') {
        const waitTime = attempt * 1000; // Wait 1s, 2s, 3s
        console.log(`Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      // For other errors, don't retry
      break;
    }
  }
  
  throw new Error(`Failed to fetch ads after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`);
}

export async function getAdById(id: number) {
  // Look in approved first, then pending, then rejected, then legacy ads
  let result = await db.select().from(approvedAds).where(eq(approvedAds.id, id));
  if (result.length > 0) return result[0];

  result = await db.select().from(pendingAds).where(eq(pendingAds.id, id));
  if (result.length > 0) return result[0];

  result = await db.select().from(rejectedAds).where(eq(rejectedAds.id, id));
  if (result.length > 0) return result[0];

  // legacy table fallback
  result = await db.select().from(ads).where(eq(ads.id, id));
  return result[0] ?? null;
}

export async function updateAd(id: number, updateData: Partial<NewAd>) {
  try {
    const fields = Object.keys(updateData);
    if (fields.length === 0) return null;
    
    // Update approved ad by default (admin-side edits), fallback to pending
    let updateQuery = db.update(approvedAds).set({ updatedAt: new Date() });
    
    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        updateQuery = updateQuery.set({ [key]: value });
      }
    });
    
    let result = await updateQuery.where(eq(approvedAds.id, id)).returning();
    if (result.length === 0) {
      // Try pending
      let pendingUpdate = db.update(pendingAds).set({ updatedAt: new Date() });
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined) {
          pendingUpdate = pendingUpdate.set({ [key]: value });
        }
      });
      result = await pendingUpdate.where(eq(pendingAds.id, id)).returning();
    }
    return result[0] ?? null;
  } catch (error) {
    console.error('Error updating ad:', error);
    return null;
  }
}

export async function deleteAd(id: number) {
  try {
    // Try delete across all ad tables
    let result = await db.delete(approvedAds).where(eq(approvedAds.id, id)).returning({ id: approvedAds.id });
    if (result.length === 0) {
      result = await db.delete(pendingAds).where(eq(pendingAds.id, id)).returning({ id: pendingAds.id });
    }
    if (result.length === 0) {
      result = await db.delete(rejectedAds).where(eq(rejectedAds.id, id)).returning({ id: rejectedAds.id });
    }
    if (result.length === 0) {
      result = await db.delete(ads).where(eq(ads.id, id)).returning({ id: ads.id });
    }
    return result.length > 0;
  } catch (error) {
    console.error('Error deleting ad:', error);
    return false;
  }
}

// Admin ad management functions
export async function getPendingAds(limit?: number) {
  let query = db.select().from(pendingAds).orderBy(desc(pendingAds.createdAt));
  if (limit) query = query.limit(limit);
  return await query;
}

export async function getApprovedAds(limit?: number) {
  let query = db.select().from(approvedAds).orderBy(desc(approvedAds.approvedAt));
  if (limit) query = query.limit(limit);
  return await query;
}

export async function getRejectedAds(limit?: number) {
  let query = db.select().from(rejectedAds).orderBy(desc(rejectedAds.rejectedAt));
  if (limit) query = query.limit(limit);
  return await query;
}

export async function approveAd(adId: number, adminId: string, adminNotes?: string) {
  // Move from pending to approved
  const pending = await db.select().from(pendingAds).where(eq(pendingAds.id, adId)).limit(1);
  if (pending.length === 0) throw new Error('Pending ad not found');
  const ad = pending[0];
  await db.insert(approvedAds).values({
    ...ad,
    status: 'active' as any,
    approvedBy: adminId,
    adminNotes: adminNotes || null,
  });
  await db.delete(pendingAds).where(eq(pendingAds.id, adId));
  return true;
}

export async function rejectAd(adId: number, adminId: string, rejectionReason: string, adminNotes?: string) {
  const pending = await db.select().from(pendingAds).where(eq(pendingAds.id, adId)).limit(1);
  if (pending.length === 0) throw new Error('Pending ad not found');
  const ad = pending[0];
  await db.insert(rejectedAds).values({
    ...ad,
    rejectedBy: adminId,
    rejectionReason,
    adminNotes: adminNotes || null,
  });
  await db.delete(pendingAds).where(eq(pendingAds.id, adId));
  return true;
}
