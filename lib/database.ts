import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

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
  tags: string[]
  features: string[]
  requirements: string[]
  images: string[]
  videos: string[]
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
  images: string[]
  videos: string[]
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

// Script functions
export async function createScript(
  scriptData: Omit<Script, "id" | "created_at" | "updated_at" | "downloads" | "rating" | "review_count">,
) {
  const result = await sql`
    INSERT INTO scripts (
      title, description, price, original_price, category, framework,
      seller_name, seller_email, tags, features, requirements, images,
      videos, demo_url, documentation_url, support_url, version,
      last_updated, status, featured
    ) VALUES (
      ${scriptData.title}, ${scriptData.description}, ${scriptData.price},
      ${scriptData.original_price}, ${scriptData.category}, ${scriptData.framework},
      ${scriptData.seller_name}, ${scriptData.seller_email}, ${scriptData.tags},
      ${scriptData.features}, ${scriptData.requirements}, ${scriptData.images},
      ${scriptData.videos}, ${scriptData.demo_url}, ${scriptData.documentation_url},
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
  let query = `SELECT * FROM scripts WHERE 1=1`
  const params: any[] = []

  if (filters?.category) {
    query += ` AND category = $${params.length + 1}`
    params.push(filters.category)
  }

  if (filters?.framework) {
    query += ` AND framework = $${params.length + 1}`
    params.push(filters.framework)
  }

  if (filters?.status) {
    query += ` AND status = $${params.length + 1}`
    params.push(filters.status)
  }

  if (filters?.featured !== undefined) {
    query += ` AND featured = $${params.length + 1}`
    params.push(filters.featured)
  }

  query += ` ORDER BY created_at DESC`

  if (filters?.limit) {
    query += ` LIMIT $${params.length + 1}`
    params.push(filters.limit)
  }

  if (filters?.offset) {
    query += ` OFFSET $${params.length + 1}`
    params.push(filters.offset)
  }

  return (await sql(query, ...params)) as Script[]
}

export async function getScriptById(id: number) {
  const result = (await sql`SELECT * FROM scripts WHERE id = ${id}`) as Script[]
  return result[0] || null
}

// Giveaway functions
export async function createGiveaway(
  giveawayData: Omit<Giveaway, "id" | "created_at" | "updated_at" | "entries_count">,
) {
  const result = await sql`
    INSERT INTO giveaways (
      title, description, total_value, category, end_date, max_entries,
      difficulty, featured, auto_announce, creator_name, creator_email,
      images, videos, tags, rules, status
    ) VALUES (
      ${giveawayData.title}, ${giveawayData.description}, ${giveawayData.total_value},
      ${giveawayData.category}, ${giveawayData.end_date}, ${giveawayData.max_entries},
      ${giveawayData.difficulty}, ${giveawayData.featured}, ${giveawayData.auto_announce},
      ${giveawayData.creator_name}, ${giveawayData.creator_email}, ${giveawayData.images},
      ${giveawayData.videos}, ${giveawayData.tags}, ${giveawayData.rules}, ${giveawayData.status}
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
  let query = `SELECT * FROM giveaways WHERE 1=1`
  const params: any[] = []

  if (filters?.status) {
    query += ` AND status = $${params.length + 1}`
    params.push(filters.status)
  }

  if (filters?.featured !== undefined) {
    query += ` AND featured = $${params.length + 1}`
    params.push(filters.featured)
  }

  query += ` ORDER BY created_at DESC`

  if (filters?.limit) {
    query += ` LIMIT $${params.length + 1}`
    params.push(filters.limit)
  }

  if (filters?.offset) {
    query += ` OFFSET $${params.length + 1}`
    params.push(filters.offset)
  }

  return (await sql(query, ...params)) as Giveaway[]
}

export async function getGiveawayById(id: number) {
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

// Update Script
export async function updateScript(id: number, updateData: Partial<Omit<Script, "id" | "created_at" | "updated_at" | "downloads" | "rating" | "review_count">>) {
  const fields = Object.keys(updateData)
  if (fields.length === 0) return null
  const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(", ")
  const params = [id, ...fields.map((f) => (updateData as any)[f])]
  const query = `UPDATE scripts SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`
  const { rows } = await (sql as any).query(query, params)
  return rows[0] || null
}

// Update Giveaway
export async function updateGiveaway(id: number, updateData: Partial<Omit<Giveaway, "id" | "created_at" | "updated_at" | "entries_count">>) {
  const fields = Object.keys(updateData)
  if (fields.length === 0) return null
  const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(", ")
  const params = [id, ...fields.map((f) => (updateData as any)[f])]
  const query = `UPDATE giveaways SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`
  const { rows } = await (sql as any).query(query, params)
  return rows[0] || null
}
