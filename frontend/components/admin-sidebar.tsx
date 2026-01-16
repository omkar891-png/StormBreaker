"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    CalendarRange,
    ClipboardCheck,
    FileText,
    Bell,
    MessageSquare,
    Settings,
    LogOut,
    BookOpen
} from "lucide-react"

const sidebarItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Students", href: "/admin/students", icon: Users },
    { label: "Teachers", href: "/admin/teachers", icon: GraduationCap },
    { label: "Classes & Subjects", href: "/admin/academic", icon: BookOpen },
    { label: "Attendance", href: "/admin/attendance", icon: ClipboardCheck },
    { label: "Exams", href: "/admin/exams", icon: CalendarRange },
    { label: "Reports", href: "/admin/reports", icon: FileText },
    { label: "Notifications", href: "/admin/notifications", icon: Bell },
    { label: "Feedback", href: "/admin/feedback", icon: MessageSquare },
    { label: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="fixed left-0 top-0 h-full w-64 glass-dark border-r border-primary/10 flex flex-col z-40 bg-background/80 backdrop-blur-xl">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-primary/10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
                        <span className="text-white font-bold text-sm">SA</span>
                    </div>
                    <span className="font-bold text-lg tracking-tight">Admin Portal</span>
                </div>
            </div>

            {/* Nav Items */}
            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
                <div className="text-xs font-semibold text-muted-foreground mb-4 px-3 uppercase tracking-wider">
                    Core Management
                </div>
                {sidebarItems.slice(0, 4).map((item) => (
                    <Link key={item.href} href={item.href}>
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-3 mb-1 font-medium",
                                pathname === item.href
                                    ? "bg-primary/20 text-primary hover:bg-primary/25 hover:text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Button>
                    </Link>
                ))}

                <div className="text-xs font-semibold text-muted-foreground mt-6 mb-4 px-3 uppercase tracking-wider">
                    Analytics & Tools
                </div>
                {sidebarItems.slice(4).map((item) => (
                    <Link key={item.href} href={item.href}>
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-3 mb-1 font-medium",
                                pathname === item.href
                                    ? "bg-primary/20 text-primary hover:bg-primary/25 hover:text-primary"
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
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-bold text-xs">
                        AD
                    </div>
                    <div className="text-sm">
                        <p className="font-medium">Admin User</p>
                        <p className="text-xs text-muted-foreground">System Administrator</p>
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
