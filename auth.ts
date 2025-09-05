import type { NextAuthOptions } from "next-auth"
import Discord from "next-auth/providers/discord"
import { upsertUser, getUserById } from "@/lib/database-new"

export const authOptions: NextAuthOptions = {
	providers: [
		Discord({
			clientId: process.env.DISCORD_CLIENT_ID as string,
			clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
		}),
	],
	callbacks: {
		async signIn({ user, profile }) {
			try {
				const username = (profile as any)?.username || user.name || null
				await upsertUser({
					id: String((user as any).id || (user as any).sub || (profile as any)?.id || ""),
					name: user.name || null,
					email: user.email || null,
					image: user.image || null,
					username: username ? String(username) : null,
					forceAdminIfUsername: "sidakftw",
				})
				return true
			} catch (e) {
				console.error("signIn upsert error", e)
				return false
			}
		},
		async session({ session, token }) {
			if (session?.user && token?.sub) {
				;(session.user as any).id = token.sub
				try {
					const dbUser = await getUserById(token.sub)
					if (dbUser) {
						;(session.user as any).roles = dbUser.roles
						;(session.user as any).username = dbUser.username
					}
				} catch (e) {
					// ignore
				}
			}
			return session
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
}

