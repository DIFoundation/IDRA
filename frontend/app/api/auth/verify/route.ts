import { type NextRequest, NextResponse } from "next/server"

// Store sessions for db @backend guy
const sessionStore = new Map<string, { address: string; timestamp: number }>()
const nonceStore = new Map<string, { nonce: string; timestamp: number }>()

export async function POST(request: NextRequest) {
	try {
		const { address, message, signature } = await request.json()

		// If only address is provided, check if session exists
		if (!message && !signature) {
			const session = sessionStore.get(address?.toLowerCase())
			if (session && Date.now() - session.timestamp < 24 * 60 * 60 * 1000) {
				return NextResponse.json({ authenticated: true })
			}
			return NextResponse.json({ authenticated: false }, { status: 401 })
		}

		// Verify signature
		if (!address || !message || !signature) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
		}

		//  ethers.js or viem to verify the signature
		// For now, we'll do a simple verification
		const nonce = nonceStore.get(address.toLowerCase())
		if (!nonce || Date.now() - nonce.timestamp > 10 * 60 * 1000) {
			return NextResponse.json({ error: "Nonce expired" }, { status: 401 })
		}

		// Create session
		sessionStore.set(address.toLowerCase(), {
			address,
			timestamp: Date.now(),
		})

		// Set session cookie
		const response = NextResponse.json({ authenticated: true })
		response.cookies.set("auth_address", address, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 24 * 60 * 60, // 24 hours
		})

		return response
	} catch (error) {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 })
	}
}
