"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard,
    Presentation,
    ClipboardCheck,
    FileText,
    Bell,
    MessageSquare,
    Settings,
    LogOut,
    UserCheck,
    BookCheck
} from "lucide-react"

const sidebarItems = [
    { label: "Dashboard", href: "/faculty/dashboard", icon: LayoutDashboard },
    { label: "Live Lecture", href: "/faculty/lecture/live", icon: Presentation },
    { label: "Attendance History", href: "/faculty/attendance", icon: ClipboardCheck },
    { label: "Assignments", href: "/faculty/assignments", icon: BookCheck },
    { label: "Student Marks", href: "/faculty/marks", icon: FileText }, // Future
    { label: "Notifications", href: "/faculty/notifications", icon: Bell }, // Future
    { label: "My Profile", href: "/faculty/profile", icon: UserCheck },
]

export function FacultySidebar() {
    const pathname = usePathname()

    return (
        <aside className="fixed left-0 top-0 h-full w-64 glass-dark border-r border-primary/10 flex flex-col z-40 bg-background/80 backdrop-blur-xl">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-primary/10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center glow-primary">
                        <span className="text-white font-bold text-sm">FT</span>
                    </div>
                    <span className="font-bold text-lg tracking-tight">Faculty Portal</span>
                </div>
            </div>

            {/* Nav Items */}
            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
                <div className="text-xs font-semibold text-muted-foreground mb-4 px-3 uppercase tracking-wider">
                    Teaching Functions
                </div>
                {sidebarItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-3 mb-1 font-medium",
                                pathname === item.href
                                    ? "bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/25 hover:text-indigo-400"
                                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Button>
                    </Link>
                ))}
            </div>

            {/* User & Logout */}
            <div className="p-4 border-t border-primary/10 bg-black/20">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                        JD
                    </div>
                    <div className="text-sm">
                        <p className="font-medium">Prof. John Doe</p>
                        <p className="text-xs text-muted-foreground">Computer Science</p>
                    </div>
                </div>
                <Button variant="destructive" className="w-full justify-start gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 shadow-none border border-red-500/20" asChild>
                    <Link href="/auth/login">
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Link>
                </Button>
            </div>
        </aside>
    )
}
