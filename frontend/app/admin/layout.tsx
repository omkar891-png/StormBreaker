import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background relative flex">
            <AdminSidebar />
            <div className="flex-1 ml-64 relative overflow-x-hidden">
                {/* Background Gradients - fixed to viewport relative to content area */}
                <div className="fixed top-0 left-64 right-0 h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10 mx-auto w-1/2" />

                {children}
            </div>
        </div>
    )
}
