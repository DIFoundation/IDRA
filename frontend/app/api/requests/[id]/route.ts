import { type NextRequest, NextResponse } from "next/server"

// database
const requestsStore: Map<string, any> = new Map()

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const { status } = await request.json()
		const requestId = params.id

		if (!["approved", "rejected", "pending"].includes(status)) {
			return NextResponse.json({ error: "Invalid status" }, { status: 400 })
		}

		// update database
		const updatedRequest = {
			id: requestId,
			status,
			updatedAt: new Date().toISOString(),
		}

		return NextResponse.json({ request: updatedRequest })
	} catch (error) {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 })
	}
}
