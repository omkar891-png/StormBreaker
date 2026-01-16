import type React from "react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Sidebar } from "@/components/sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full pointer-events-none -z-10" />

            <DashboardNavbar />

            <div className="pt-24 pr-80 px-6 pb-8 min-h-screen">
                {children}
            </div>

            <Sidebar />
        </div>
    )
}
