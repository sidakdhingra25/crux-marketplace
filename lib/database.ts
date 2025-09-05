import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

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
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id text PRIMARY KEY,
      name text,
      email text,
      image text,
      username text,
      roles text[] DEFAULT '{user}',
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    )
  `
}

async function ensureScriptsTableExists() {
  await sql`
    CREATE TABLE IF NOT EXISTS scripts (
      id SERIAL PRIMARY KEY,
      title text NOT NULL,
      description text NOT NULL,
      price numeric NOT NULL,
      original_price numeric,
      category text NOT NULL,
      framework text,
      seller_name text NOT NULL,
      seller_email text NOT NULL,
      seller_id text,
      tags text[] DEFAULT '{}',
      features text[] DEFAULT '{}',
      requirements text[] DEFAULT '{}',
      images text[] DEFAULT '{}',
      videos text[] DEFAULT '{}',
      screenshots text[] DEFAULT '{}',
      cover_image text,
      demo_url text,
      documentation_url text,
      support_url text,
      version text DEFAULT '1.0.0',
      last_updated timestamptz DEFAULT now(),
      status text DEFAULT 'pending',
      featured boolean DEFAULT false,
      downloads integer DEFAULT 0,
      rating numeric DEFAULT 0,
      review_count integer DEFAULT 0,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    )
  `
  
  // Add screenshots column if it doesn't exist (for existing tables)
  try {
    await sql`ALTER TABLE scripts ADD COLUMN IF NOT EXISTS screenshots text[] DEFAULT '{}'`
  } catch (error) {
    // Column might already exist, ignore error
    console.log('Screenshots column already exists or error adding it:', error)
  }
  
  // Add cover_image column if it doesn't exist (for existing tables)
  try {
    await sql`ALTER TABLE scripts ADD COLUMN IF NOT EXISTS cover_image text`
  } catch (error) {
    // Column might already exist, ignore error
    console.log('Cover image column already exists or error adding it:', error)
  }
}

async function ensureGiveawaysTableExists() {
  await sql`
    CREATE TABLE IF NOT EXISTS giveaways (
      id SERIAL PRIMARY KEY,
      title text NOT NULL,
      description text NOT NULL,
      total_value text NOT NULL,
      category text NOT NULL,
      end_date text NOT NULL,
      max_entries integer,
      difficulty text NOT NULL,
      featured boolean DEFAULT false,
      auto_announce boolean DEFAULT false,
      creator_name text NOT NULL,
      creator_email text NOT NULL,
      creator_id text,
      images text[] DEFAULT '{}',
      videos text[] DEFAULT '{}',
      cover_image text,
      tags text[] DEFAULT '{}',
      rules text[] DEFAULT '{}',
      status text DEFAULT 'active',
      entries_count integer DEFAULT 0,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    )
  `
  
  // Add cover_image column if it doesn't exist (for existing tables)
  try {
    await sql`ALTER TABLE giveaways ADD COLUMN IF NOT EXISTS cover_image text`
  } catch (error) {
    // Column might already exist, ignore error
    console.log('Cover image column already exists or error adding it:', error)
  }
}

async function ensureGiveawayEntriesTableExists() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS giveaway_entries (
        id SERIAL PRIMARY KEY,
        giveaway_id integer NOT NULL REFERENCES giveaways(id) ON DELETE CASCADE,
        user_id text NOT NULL,
        user_name text,
        user_email text,
        entry_date timestamptz DEFAULT now(),
        status text DEFAULT 'active',
        points_earned integer DEFAULT 0,
        requirements_completed text[] DEFAULT '{}',
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now(),
        UNIQUE(giveaway_id, user_id)
      )
    `
    console.log('Giveaway entries table ensured')
  } catch (error) {
    console.error('Error creating giveaway entries table:', error)
    throw error
  }
}

async function ensureGiveawayReviewsTableExists() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS giveaway_reviews (
        id SERIAL PRIMARY KEY,
        giveaway_id integer NOT NULL REFERENCES giveaways(id) ON DELETE CASCADE,
        reviewer_name text NOT NULL,
        reviewer_email text NOT NULL,
        reviewer_id text,
        rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
        title text,
        comment text,
        verified_participant boolean DEFAULT false,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      )
    `
    console.log('Giveaway reviews table ensured')
  } catch (error) {
    console.error('Error creating giveaway reviews table:', error)
    throw error
  }
}

async function ensureAdsTableExists() {
  await sql`
    CREATE TABLE IF NOT EXISTS ads (
      id SERIAL PRIMARY KEY,
      title text NOT NULL,
      description text NOT NULL,
      image_url text,
      link_url text,
      category text NOT NULL,
      status text DEFAULT 'active', 
      priority integer DEFAULT 1,
      start_date timestamptz DEFAULT now(),
      end_date timestamptz,
      created_by text NOT NULL,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    )
  `
}

export async function upsertUser(user: {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  username?: string | null
  forceAdminIfUsername?: string | null
}) {
  await ensureUsersTableExists()
  await ensureGiveawayEntriesTableExists()
  // Give everyone admin role for now
  const defaultRoles = ['admin']
  await sql`
    INSERT INTO users (id, name, email, image, username, roles)
    VALUES (${user.id}, ${user.name ?? null}, ${user.email ?? null}, ${user.image ?? null}, ${user.username ?? null}, ${defaultRoles})
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      email = EXCLUDED.email,
      image = EXCLUDED.image,
      username = EXCLUDED.username,
      roles = ${defaultRoles},
      updated_at = now()
  `
}

export async function getUserById(id: string) {
  await ensureUsersTableExists()
  const rows = (await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`) as User[]
  return rows[0] ?? null
}

export async function getAllUsers(limit?: number) {
  await ensureUsersTableExists()
  const defaultLimit = limit || 100
  const users = (await sql`SELECT * FROM users ORDER BY created_at DESC LIMIT ${defaultLimit}`) as User[]
  return users
}

export async function updateUserRole(userId: string, role: UserRole) {
  await ensureUsersTableExists()
  const rows = await sql`UPDATE users SET role = ${role}, updated_at = now() WHERE id = ${userId} RETURNING *`
  return (rows as User[])[0] ?? null
}

export interface Script {
  id: number
  title: string
  description: string
  price: number
  original_price?: number
  category: string
  framework?: string
  seller_name: string
  seller_email: string
  seller_id?: string
  tags: string[]
  features: string[]
  requirements: string[]
  images: string[]
  videos: string[]
  screenshots: string[]
  cover_image?: string
  demo_url?: string
  documentation_url?: string
  support_url?: string
  version: string
  last_updated: string
  status: "pending" | "approved" | "rejected"
  featured: boolean
  downloads: number
  rating: number
  review_count: number
  created_at: string
  updated_at: string
}

export interface Giveaway {
  id: number
  title: string
  description: string
  total_value: string
  category: string
  end_date: string
  max_entries?: number
  difficulty: "Easy" | "Medium" | "Hard"
  featured: boolean
  auto_announce: boolean
  creator_name: string
  creator_email: string
  creator_id?: string
  images: string[]
  videos: string[]
  cover_image?: string
  tags: string[]
  rules: string[]
  status: "active" | "ended" | "cancelled"
  entries_count: number
  created_at: string
  updated_at: string
}

export interface GiveawayRequirement {
  id: number
  giveaway_id: number
  type: string
  description: string
  points: number
  required: boolean
  link?: string
}

export interface GiveawayPrize {
  id: number
  giveaway_id: number
  position: number
  name: string
  description?: string
  value: string
  winner_name?: string
  winner_email?: string
  claimed: boolean
}

export interface GiveawayEntry {
  id: number
  giveaway_id: number
  user_id: string
  user_name?: string
  user_email?: string
  entry_date: string
  status: "active" | "disqualified" | "winner"
  points_earned: number
  requirements_completed: string[]
  created_at: string
  updated_at: string
}

export interface ScriptReview {
  id: number
  script_id: number
  reviewer_name: string
  reviewer_email: string
  rating: number
  title?: string
  comment?: string
  verified_purchase: boolean
  created_at: string
  updated_at: string
}

export interface GiveawayReview {
  id: number
  giveaway_id: number
  reviewer_name: string
  reviewer_email: string
  reviewer_id?: string
  rating: number
  title?: string
  comment?: string
  verified_participant: boolean
  created_at: string
  updated_at: string
}

export interface Ad {
  id: number
  title: string
  description: string
  image_url?: string
  link_url?: string
  category: string
  status: "active" | "inactive" | "expired"
  priority: number
  start_date: string
  end_date?: string
  created_by: string
  created_at: string
  updated_at: string
}

// Script functions
export async function createScript(
  scriptData: Omit<Script, "id" | "created_at" | "updated_at" | "downloads" | "rating" | "review_count">,
) {
  await ensureScriptsTableExists()
  const result = await sql`
    INSERT INTO scripts (
      title, description, price, original_price, category, framework,
      seller_name, seller_email, seller_id, tags, features, requirements, images,
      videos, screenshots, cover_image, demo_url, documentation_url, support_url, version,
      last_updated, status, featured
    ) VALUES (
      ${scriptData.title}, ${scriptData.description}, ${scriptData.price},
      ${scriptData.original_price}, ${scriptData.category}, ${scriptData.framework},
      ${scriptData.seller_name}, ${scriptData.seller_email}, ${scriptData.seller_id || null}, ${scriptData.tags},
      ${scriptData.features}, ${scriptData.requirements}, ${scriptData.images},
      ${scriptData.videos}, ${scriptData.screenshots || []}, ${scriptData.cover_image || null}, ${scriptData.demo_url}, ${scriptData.documentation_url},
      ${scriptData.support_url}, ${scriptData.version}, ${scriptData.last_updated},
      ${scriptData.status}, ${scriptData.featured}
    ) RETURNING id
  `
  return result[0]?.id
}

export async function getScripts(filters?: {
  category?: string
  framework?: string
  status?: string
  featured?: boolean
  limit?: number
  offset?: number
}) {
  await ensureScriptsTableExists()
  
  try {
    let query = sql`SELECT * FROM scripts`
    const conditions: string[] = []
    
    if (filters?.category) {
      conditions.push(`category = '${filters.category}'`)
    }
    
    if (filters?.framework) {
      conditions.push(`framework = '${filters.framework}'`)
    }
    
    if (filters?.status) {
      conditions.push(`status = '${filters.status}'`)
    }
    
    if (filters?.featured) {
      conditions.push('featured = true')
    }
    
    if (conditions.length > 0) {
      query = sql`SELECT * FROM scripts WHERE ${sql.unsafe(conditions.join(' AND '))}`
    }
    
    query = sql`${query} ORDER BY created_at DESC`
    
    // Apply default limit to prevent memory issues
    const defaultLimit = filters?.limit || 100
    query = sql`${query} LIMIT ${defaultLimit}`
    
    if (filters?.offset) {
      query = sql`${query} OFFSET ${filters.offset}`
    }
    
    const scripts = await query
    return scripts as Script[]
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

export async function getScriptById(id: number) {
  await ensureScriptsTableExists()
  const result = (await sql`SELECT * FROM scripts WHERE id = ${id}`) as Script[]
  return result[0] || null
}

// Giveaway functions
export async function createGiveaway(
  giveawayData: Omit<Giveaway, "id" | "created_at" | "updated_at" | "entries_count">,
) {
  await ensureGiveawaysTableExists()
  const result = await sql`
    INSERT INTO giveaways (
      title, description, total_value, category, end_date, max_entries,
      difficulty, featured, auto_announce, creator_name, creator_email, creator_id,
      images, videos, cover_image, tags, rules, status
    ) VALUES (
      ${giveawayData.title}, ${giveawayData.description}, ${giveawayData.total_value},
      ${giveawayData.category}, ${giveawayData.end_date}, ${giveawayData.max_entries},
      ${giveawayData.difficulty}, ${giveawayData.featured}, ${giveawayData.auto_announce},
      ${giveawayData.creator_name}, ${giveawayData.creator_email}, ${giveawayData.creator_id || null}, ${giveawayData.images},
      ${giveawayData.videos}, ${giveawayData.cover_image || null}, ${giveawayData.tags}, ${giveawayData.rules}, ${giveawayData.status}
    ) RETURNING id
  `
  return result[0]?.id
}

export async function createGiveawayRequirement(requirementData: Omit<GiveawayRequirement, "id">) {
  const result = await sql`
    INSERT INTO giveaway_requirements (giveaway_id, type, description, points, required, link)
    VALUES (${requirementData.giveaway_id}, ${requirementData.type}, ${requirementData.description},
            ${requirementData.points}, ${requirementData.required}, ${requirementData.link})
    RETURNING id
  `
  return result[0]?.id
}

export async function createGiveawayPrize(prizeData: Omit<GiveawayPrize, "id" | "claimed">) {
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
  await ensureGiveawayEntriesTableExists()
  
  try {
    let query = sql`SELECT * FROM giveaways`
    const conditions: string[] = []
    const values: any[] = []
    
    if (filters?.status && filters.status !== 'all') {
      conditions.push('status = $1')
      values.push(filters.status)
    }
    
    if (filters?.featured) {
      conditions.push('featured = true')
    }
    
    if (conditions.length > 0) {
      query = sql`SELECT * FROM giveaways WHERE ${sql.unsafe(conditions.join(' AND '))}`
    }
    
    query = sql`${query} ORDER BY created_at DESC`
    
    // Apply default limit to prevent memory issues
    const defaultLimit = filters?.limit || 100
    query = sql`${query} LIMIT ${defaultLimit}`
    
    if (filters?.offset) {
      query = sql`${query} OFFSET ${filters.offset}`
    }
    
    const giveaways = await query
    console.log('Raw giveaways from database:', giveaways)
    return giveaways as Giveaway[]
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

export async function getGiveawayById(id: number) {
  await ensureGiveawayEntriesTableExists()
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
