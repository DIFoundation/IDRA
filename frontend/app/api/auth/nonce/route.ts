import { type NextRequest, NextResponse } from "next/server"
// Store nonce for db
const nonceStore = new Map<string, { nonce: string; timestamp: number }>()

export async function POST(request: NextRequest) {
	try {
		const { address } = await request.json()

		if (!address) {
			return NextResponse.json({ error: "Address required" }, { status: 400 })
		}

		// Generate a random nonce
		const nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

		// Store nonce with timestamp (expires in 10 minutes)
		nonceStore.set(address.toLowerCase(), {
			nonce,
			timestamp: Date.now(),
		})

		return NextResponse.json({ nonce })
	} catch (error) {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 })
	}
}
