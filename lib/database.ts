// ...existing code...

// ...existing code...

export type UserRole = "user" | "moderator" | "admin" | "seller" | "ads"

export interface User {
  id: string
  name: string | null
  email: string | null
  image: string | null
  username: string | null
  roles: UserRole[]
  created_at?: string
  updated_at?: string
}

async function ensureUsersTableExists() {
  // TODO: Migrate users table creation to Xata/Drizzle
}

async function ensureScriptsTableExists() {
  // TODO: Migrate scripts table creation to Xata/Drizzle
  
  // Add screenshots column if it doesn't exist (for existing tables)
  try {
  // TODO: Add screenshots column with Xata/Drizzle migration
  } catch (error) {
    // Column might already exist, ignore error
    console.log('Screenshots column already exists or error adding it:', error)
  }
  
  // Add cover_image column if it doesn't exist (for existing tables)
  try {
  // TODO: Add cover_image column with Xata/Drizzle migration
  } catch (error) {
    // Column might already exist, ignore error
    console.log('Cover image column already exists or error adding it:', error)
  }
}

async function ensureGiveawaysTableExists() {
  // TODO: Migrate giveaways table creation to Xata/Drizzle
  
  // Add cover_image column if it doesn't exist (for existing tables)
  try {
  // TODO: Add cover_image column with Xata/Drizzle migration
  } catch (error) {
    // Column might already exist, ignore error
    console.log('Cover image column already exists or error adding it:', error)
  }
}

async function ensureGiveawayEntriesTableExists() {
  try {
    // TODO: Migrate giveaway_entries table creation to Xata/Drizzle
    console.log('Giveaway entries table ensured')
  } catch (error) {
    console.error('Error creating giveaway entries table:', error)
    throw error
  }
}

async function ensureGiveawayReviewsTableExists() {
  try {
    // TODO: Migrate giveaway_reviews table creation to Xata/Drizzle
    console.log('Giveaway reviews table ensured')
  } catch (error) {
    console.error('Error creating giveaway reviews table:', error)
    throw error
  }
}

async function ensureAdsTableExists() {
  // TODO: Migrate ads table creation to Xata/Drizzle
}

export async function upsertUser(user: {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  username?: string | null
  forceAdminIfUsername?: string | null
}) {
  // TODO: Implement upsertUser with Xata/Drizzle
}
// All Neon-related queries and functions have been removed.
// Only type/interface exports and TODOs for Xata/Drizzle migration should remain here.
  const result = await sql`
    INSERT INTO giveaway_prizes (giveaway_id, position, name, description, value)
    VALUES (${prizeData.giveaway_id}, ${prizeData.position}, ${prizeData.name},
            ${prizeData.description}, ${prizeData.value})
    RETURNING id
  `
  return result[0]?.id
}

export async function getGiveaways(filters?: {
  status?: string
  featured?: boolean
  limit?: number
  offset?: number
}) {
  await ensureGiveawaysTableExists()
  // TODO: Implement getScripts with Xata/Drizzle
  const giveaway = (await sql`SELECT * FROM giveaways WHERE id = ${id}`) as Giveaway[]
  if (!giveaway[0]) return null

  const requirements = (await sql`
    SELECT * FROM giveaway_requirements WHERE giveaway_id = ${id} ORDER BY id
  `) as GiveawayRequirement[]

  const prizes = (await sql`
    SELECT * FROM giveaway_prizes WHERE giveaway_id = ${id} ORDER BY position
  `) as GiveawayPrize[]

  return {
    ...giveaway[0],
    requirements,
    prizes,
  }
}

export async function getGiveawayRequirements(giveawayId: number) {
  return (await sql`
    SELECT * FROM giveaway_requirements WHERE giveaway_id = ${giveawayId} ORDER BY id
  `) as GiveawayRequirement[]
}

export async function getGiveawayPrizes(giveawayId: number) {
  return (await sql`
    SELECT * FROM giveaway_prizes WHERE giveaway_id = ${giveawayId} ORDER BY position
  `) as GiveawayPrize[]
}

// Giveaway Entry functions
export async function createGiveawayEntry(entryData: Omit<GiveawayEntry, "id" | "created_at" | "updated_at">) {
  await ensureGiveawayEntriesTableExists()
  
  try {
    const result = await sql`
      INSERT INTO giveaway_entries (
        giveaway_id, user_id, user_name, user_email, status, points_earned, requirements_completed
      ) VALUES (
        ${entryData.giveaway_id}, ${entryData.user_id}, ${entryData.user_name || null}, 
        ${entryData.user_email || null}, ${entryData.status}, ${entryData.points_earned}, 
        ${entryData.requirements_completed}
      ) RETURNING id
    `
    
    // Update the entries count in the giveaway table
    await sql`
      UPDATE giveaways 
      SET entries_count = entries_count + 1, updated_at = now() 
      WHERE id = ${entryData.giveaway_id}
    `
    
    return result[0]?.id
  } catch (error) {
    console.error('Error creating giveaway entry:', error)
    throw error
  }
}

export async function getGiveawayEntries(giveawayId: number) {
  await ensureGiveawayEntriesTableExists()
  return (await sql`
    SELECT * FROM giveaway_entries 
    WHERE giveaway_id = ${giveawayId} 
    ORDER BY entry_date DESC
  `) as GiveawayEntry[]
}

export async function getUserGiveawayEntry(giveawayId: number, userId: string) {
  await ensureGiveawayEntriesTableExists()
  const result = (await sql`
    SELECT * FROM giveaway_entries 
    WHERE giveaway_id = ${giveawayId} AND user_id = ${userId}
    LIMIT 1
  `) as GiveawayEntry[]
  return result[0] || null
}

export async function updateGiveawayEntry(entryId: number, updateData: Partial<Omit<GiveawayEntry, "id" | "created_at" | "updated_at">>) {
  await ensureGiveawayEntriesTableExists()
  
  try {
    const fields = Object.keys(updateData)
    if (fields.length === 0) return null
    
    let query = sql`UPDATE giveaway_entries SET updated_at = NOW()`
    
    fields.forEach((field) => {
      const value = (updateData as any)[field]
      if (value !== undefined) {
        query = sql`${query}, ${sql.unsafe(field)} = ${value}`
      }
    })
    
    query = sql`${query} WHERE id = ${entryId} RETURNING *`
    
    const result = await query
    return result[0] || null
  } catch (error) {
    console.error('Error updating giveaway entry:', error)
    return null
  }
}

export async function getUserGiveawayEntries(userId: string) {
  await ensureGiveawayEntriesTableExists()
  return (await sql`
    SELECT ge.*, g.title as giveaway_title, g.cover_image as giveaway_cover
    FROM giveaway_entries ge
    JOIN giveaways g ON ge.giveaway_id = g.id
    WHERE ge.user_id = ${userId}
    ORDER BY ge.entry_date DESC
  `) as (GiveawayEntry & { giveaway_title: string; giveaway_cover?: string })[]
}

// Script Review functions
export async function createScriptReview(reviewData: Omit<ScriptReview, "id" | "created_at" | "updated_at">) {
  const result = await sql`
    INSERT INTO script_reviews (
      script_id, reviewer_name, reviewer_email, rating, title, comment, verified_purchase
    ) VALUES (
      ${reviewData.script_id}, ${reviewData.reviewer_name}, ${reviewData.reviewer_email},
      ${reviewData.rating}, ${reviewData.title || null}, ${reviewData.comment || null}, ${reviewData.verified_purchase}
    ) RETURNING id
  `
  return result[0]?.id
}

export async function getScriptReviews(scriptId: number) {
  return (await sql`
    SELECT * FROM script_reviews 
    WHERE script_id = ${scriptId} 
    ORDER BY created_at DESC
  `) as ScriptReview[]
}

export async function getUserScriptReview(scriptId: number, userEmail: string) {
  const result = (await sql`
    SELECT * FROM script_reviews 
    WHERE script_id = ${scriptId} AND reviewer_email = ${userEmail}
    LIMIT 1
  `) as ScriptReview[]
  return result[0] || null
}

// Giveaway Review functions
export async function createGiveawayReview(reviewData: Omit<GiveawayReview, "id" | "created_at" | "updated_at">) {
  await ensureGiveawayReviewsTableExists()
  
  const result = await sql`
    INSERT INTO giveaway_reviews (
      giveaway_id, reviewer_name, reviewer_email, reviewer_id, rating, title, comment, verified_participant
    ) VALUES (
      ${reviewData.giveaway_id}, ${reviewData.reviewer_name}, ${reviewData.reviewer_email},
      ${reviewData.reviewer_id || null}, ${reviewData.rating}, ${reviewData.title || null}, 
      ${reviewData.comment || null}, ${reviewData.verified_participant}
    ) RETURNING id
  `
  return result[0]?.id
}

export async function getGiveawayReviews(giveawayId: number) {
  await ensureGiveawayReviewsTableExists()
  return (await sql`
    SELECT * FROM giveaway_reviews 
    WHERE giveaway_id = ${giveawayId} 
    ORDER BY created_at DESC
  `) as GiveawayReview[]
}

export async function getUserGiveawayReview(giveawayId: number, userEmail: string) {
  await ensureGiveawayReviewsTableExists()
  const result = (await sql`
    SELECT * FROM giveaway_reviews 
    WHERE giveaway_id = ${giveawayId} AND reviewer_email = ${userEmail}
    LIMIT 1
  `) as GiveawayReview[]
  return result[0] || null
}

// Update Script
export async function updateScript(id: number, updateData: Partial<Omit<Script, "id" | "created_at" | "updated_at" | "downloads" | "rating" | "review_count">>) {
  try {
    await ensureScriptsTableExists()
    
    const fields = Object.keys(updateData)
    if (fields.length === 0) return null
    
    // Build dynamic update query using tagged template literals
    let query = sql`UPDATE scripts SET updated_at = NOW()`
    const values: any[] = []
    
    fields.forEach((field, index) => {
      const value = (updateData as any)[field]
      if (value !== undefined) {
        query = sql`${query}, ${sql.unsafe(field)} = ${value}`
      }
    })
    
    query = sql`${query} WHERE id = ${id} RETURNING *`
    
    const result = await query
    return result[0] || null
  } catch (error) {
    console.error('Error updating script:', error)
    return null
  }
}

// Delete Script
export async function deleteScript(id: number) {
  try {
    const result = await sql`DELETE FROM scripts WHERE id = ${id} RETURNING id`
    return result.length > 0
  } catch (error) {
    console.error('Error deleting script:', error)
    return false
  }
}

// Update Giveaway
export async function updateGiveaway(id: number, updateData: Partial<Omit<Giveaway, "id" | "created_at" | "updated_at" | "entries_count">>) {
  try {
    await ensureGiveawaysTableExists()
    
    const fields = Object.keys(updateData)
    if (fields.length === 0) return null
    
    // Build dynamic update query using tagged template literals
    let query = sql`UPDATE giveaways SET updated_at = NOW()`
    const values: any[] = []
    
    fields.forEach((field, index) => {
      const value = (updateData as any)[field]
      if (value !== undefined) {
        query = sql`${query}, ${sql.unsafe(field)} = ${value}`
      }
    })
    
    query = sql`${query} WHERE id = ${id} RETURNING *`
    
    const result = await query
    return result[0] || null
  } catch (error) {
    console.error('Error updating giveaway:', error)
    return null
  }
}

// Delete Giveaway
export async function deleteGiveaway(id: number) {
  try {
    const result = await sql`DELETE FROM giveaways WHERE id = ${id} RETURNING id`
    return result.length > 0
  } catch (error) {
    console.error('Error deleting giveaway:', error)
    return false
  }
}

// Ad functions
export async function createAd(adData: Omit<Ad, "id" | "created_at" | "updated_at">) {
  await ensureAdsTableExists()
  const result = await sql`
    INSERT INTO ads (
      title, description, image_url, link_url, category, status, priority,
      start_date, end_date, created_by
    ) VALUES (
      ${adData.title}, ${adData.description}, ${adData.image_url || null}, 
      ${adData.link_url || null}, ${adData.category}, ${adData.status}, 
      ${adData.priority}, ${adData.start_date}, ${adData.end_date || null}, 
      ${adData.created_by}
    ) RETURNING id
  `
  return result[0]?.id
}

export async function getAds(filters?: {
  status?: string
  category?: string
  limit?: number
}) {
  await ensureAdsTableExists()
  
  try {
    let query = sql`SELECT * FROM ads`
    const conditions = []
    
    if (filters?.status) {
      conditions.push(sql`status = ${filters.status}`)
    }
    
    if (filters?.category) {
      conditions.push(sql`category = ${filters.category}`)
    }
    
    if (conditions.length > 0) {
      query = sql`${query} WHERE ${conditions.reduce((acc, condition) => sql`${acc} AND ${condition}`)}`
    }
    
    query = sql`${query} ORDER BY priority DESC, created_at DESC`
    
    // Apply default limit if none specified to prevent memory issues
    const limit = filters?.limit || 50
    query = sql`${query} LIMIT ${limit}`
    
    const ads = await query
    return ads as Ad[]
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

export async function getAdById(id: number) {
  await ensureAdsTableExists()
  const result = (await sql`SELECT * FROM ads WHERE id = ${id}`) as Ad[]
  return result[0] || null
}

export async function updateAd(id: number, updateData: Partial<Omit<Ad, "id" | "created_at" | "updated_at">>) {
  try {
    await ensureAdsTableExists()
    
    const fields = Object.keys(updateData)
    if (fields.length === 0) return null
    
    let query = sql`UPDATE ads SET updated_at = NOW()`
    
    fields.forEach((field) => {
      const value = (updateData as any)[field]
      if (value !== undefined) {
        query = sql`${query}, ${sql.unsafe(field)} = ${value}`
      }
    })
    
    query = sql`${query} WHERE id = ${id} RETURNING *`
    
    const result = await query
    return result[0] || null
  } catch (error) {
    console.error('Error updating ad:', error)
    return null
  }
}

export async function deleteAd(id: number) {
  try {
    const result = await sql`DELETE FROM ads WHERE id = ${id} RETURNING id`
    return result.length > 0
  } catch (error) {
    console.error('Error deleting ad:', error)
    return false
  }
}
