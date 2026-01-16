import { FacultySidebar } from "@/components/faculty-sidebar"

export default function FacultyLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-black text-foreground font-sans selection:bg-indigo-500/30">
            <FacultySidebar />
            <div className="flex-1 ml-64 relative z-10 w-full overflow-x-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none -z-10" />
                <div className="container mx-auto max-w-7xl py-6">
                    {children}
                </div>
            </div>
        </div>
    )
}
