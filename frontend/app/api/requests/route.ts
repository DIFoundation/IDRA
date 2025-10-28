import { type NextRequest, NextResponse } from "next/server"

// Mock  database to store access requests
const requestsStore: Array<{
	id: string
	requesterAddress: string
	capsuleId: string
	status: string
	createdAt: string
}> = []

export async function GET(request: NextRequest) {
	try {
		const address = request.nextUrl.searchParams.get("address")

		if (!address) {
			return NextResponse.json({ error: "Address required" }, { status: 400 })
		}

		// Filter requests for this user
		const userRequests = requestsStore.filter((r) => r.requesterAddress === address)

		return NextResponse.json({ requests: userRequests })
	} catch (error) {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 })
	}
}

export async function POST(request: NextRequest) {
	try {
		const { requesterAddress, capsuleId, reason } = await request.json()

		if (!requesterAddress || !capsuleId) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
		}

		const newRequest = {
			id: Math.random().toString(36).substring(7),
			requesterAddress,
			capsuleId,
			status: "pending",
			createdAt: new Date().toISOString(),
		}

		requestsStore.push(newRequest)

		return NextResponse.json({ request: newRequest }, { status: 201 })
	} catch (error) {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 })
	}
}
