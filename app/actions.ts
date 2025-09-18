// app/actions.ts
"use server";

import { sql } from "drizzle-orm";

// ...existing code...

export async function getData() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        throw new Error("DATABASE_URL environment variable is not set");
    }
    // ...existing code...
    const data = await sql`...`;
    return data;
}