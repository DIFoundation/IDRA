"use client"

import { useState } from "react"
import { useSiweAuth } from "@/hooks/use-siwe-auth"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Lock, Users, Clock, TrendingUp, AlertCircle } from "lucide-react"
import { CapsuleList } from "@/components/capsules/capsule-list"
import { CreateCapsuleDialog } from "@/components/capsules/create-capsule-dialog"

interface Capsule {
	id: string
	name: string
	description: string
	createdAt: string
	size: number
	encrypted: boolean
	accessCount: number
}

interface DashboardStats {
	totalCapsules: number
	totalSize: number
	pendingRequests: number
	activeGuardians: number
}

export default function DashboardPage() {
	const { isAuthenticated, isConnected, address } = useSiweAuth()x
	const [capsules, setCapsules] = useState<Capsule[]>([
		{
			id: "1",
			name: "Personal Documents",
			description: "Important personal files and documents",
			createdAt: "2024-01-15",
			size: 2.5,
			encrypted: true,
			accessCount: 0,
		},
		{
			id: "2",
			name: "Financial Records",
			description: "Bank statements and tax documents",
			createdAt: "2024-01-10",
			size: 1.2,
			encrypted: true,
			accessCount: 2,
		},
		{
			id: "3",
			name: "Medical History",
			description: "Health records and prescriptions",
			createdAt: "2024-01-05",
			size: 0.8,
			encrypted: true,
			accessCount: 1,
		},
	])
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

	//   if (!isConnected || !isAuthenticated) {
	//     redirect("/")
	//   }

	const stats: DashboardStats = {
		totalCapsules: capsules.length,
		totalSize: capsules.reduce((sum, c) => sum + c.size, 0),
		pendingRequests: 3,
		activeGuardians: 2,
	}

	const handleCreateCapsule = (data: { name: string; description: string }) => {
		const newCapsule: Capsule = {
			id: String(capsules.length + 1),
			name: data.name,
			description: data.description,
			createdAt: new Date().toISOString().split("T")[0],
			size: 0,
			encrypted: true,
			accessCount: 0,
		}
		setCapsules([...capsules, newCapsule])
		setIsCreateDialogOpen(false)
	}

	const handleDeleteCapsule = (id: string) => {
		setCapsules(capsules.filter((c) => c.id !== id))
	}

	return (
		<div className="min-h-screen bg-background">
			<Header />

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Header Section */}
				<div className="flex justify-between items-start mb-8">
					<div>
						<h1 className="text-3xl font-bold mb-2">Dashboard</h1>
						<p className="text-muted-foreground">
							Welcome back, {address?.slice(0, 6)}...{address?.slice(-4)}
						</p>
					</div>
					<Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
						<Plus className="w-4 h-4" />
						New Capsule
					</Button>
				</div>

				{/* Stats Grid */}
				<div className="grid md:grid-cols-4 gap-4 mb-8">
					<Card className="glass">
						<CardContent className="pt-6">
							<div className="flex items-start justify-between">
								<div>
									<p className="text-xs text-muted-foreground mb-1">Total Capsules</p>
									<p className="text-3xl font-bold text-primary">{stats.totalCapsules}</p>
								</div>
								<Lock className="w-8 h-8 text-primary/50" />
							</div>
						</CardContent>
					</Card>

					<Card className="glass">
						<CardContent className="pt-6">
							<div className="flex items-start justify-between">
								<div>
									<p className="text-xs text-muted-foreground mb-1">Storage Used</p>
									<p className="text-3xl font-bold text-primary">{stats.totalSize.toFixed(1)}</p>
									<p className="text-xs text-muted-foreground">GB</p>
								</div>
								<TrendingUp className="w-8 h-8 text-primary/50" />
							</div>
						</CardContent>
					</Card>

					<Card className="glass">
						<CardContent className="pt-6">
							<div className="flex items-start justify-between">
								<div>
									<p className="text-xs text-muted-foreground mb-1">Pending Requests</p>
									<p className="text-3xl font-bold text-yellow-600">{stats.pendingRequests}</p>
								</div>
								<Clock className="w-8 h-8 text-yellow-600/50" />
							</div>
						</CardContent>
					</Card>

					<Card className="glass">
						<CardContent className="pt-6">
							<div className="flex items-start justify-between">
								<div>
									<p className="text-xs text-muted-foreground mb-1">Active Guardians</p>
									<p className="text-3xl font-bold text-green-600">{stats.activeGuardians}</p>
								</div>
								<Users className="w-8 h-8 text-green-600/50" />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Quick Actions */}
				<div className="mb-8">
					<h2 className="text-lg font-bold mb-4">Quick Actions</h2>
					<div className="grid md:grid-cols-3 gap-4">
						<Card className="glass hover:border-primary/50 transition-colors cursor-pointer">
							<CardContent className="pt-6">
								<div className="flex items-center gap-3">
									<div className="p-3 bg-primary/10 rounded-lg">
										<Lock className="w-5 h-5 text-primary" />
									</div>
									<div>
										<p className="font-semibold text-sm">Create Capsule</p>
										<p className="text-xs text-muted-foreground">Store encrypted data</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="glass hover:border-primary/50 transition-colors cursor-pointer">
							<CardContent className="pt-6">
								<div className="flex items-center gap-3">
									<div className="p-3 bg-yellow-600/10 rounded-lg">
										<Clock className="w-5 h-5 text-yellow-600" />
									</div>
									<div>
										<p className="font-semibold text-sm">View Requests</p>
										<p className="text-xs text-muted-foreground">{stats.pendingRequests} pending</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="glass hover:border-primary/50 transition-colors cursor-pointer">
							<CardContent className="pt-6">
								<div className="flex items-center gap-3">
									<div className="p-3 bg-green-600/10 rounded-lg">
										<Users className="w-5 h-5 text-green-600" />
									</div>
									<div>
										<p className="font-semibold text-sm">Manage Guardians</p>
										<p className="text-xs text-muted-foreground">{stats.activeGuardians} active</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Recent Activity Alert */}
				<div className="mb-8">
					<Card className="glass border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
						<CardContent className="pt-6 flex items-start gap-3">
							<AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
							<div>
								<p className="font-semibold text-sm text-blue-900 dark:text-blue-100">
									New access request
								</p>
								<p className="text-sm text-blue-800 dark:text-blue-200">
									Alice Johnson requested access to "Personal Documents" for identity verification
								</p>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Capsules Section */}
				<div>
					<h2 className="text-lg font-bold mb-4">Your Capsules</h2>
					<CapsuleList capsules={capsules} onDelete={handleDeleteCapsule} />
				</div>

				{/* Create Dialog */}
				<CreateCapsuleDialog
					open={isCreateDialogOpen}
					onOpenChange={setIsCreateDialogOpen}
					onCreate={handleCreateCapsule}
				/>
			</main>
		</div>
	)
}
