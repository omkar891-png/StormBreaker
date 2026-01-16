"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function DashboardNavbar() {
  const pathname = usePathname()

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Attendance", href: "/dashboard/attendance" },
    { label: "Students", href: "/dashboard/students" },
    { label: "Reports", href: "/dashboard/reports" },
    { label: "Settings", href: "/dashboard/settings" },
  ]

  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark">
      <div className="max-w-full px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary shadow-lg shadow-primary/40">
            <span className="text-white font-bold text-lg">SA</span>
          </div>
          <span className="font-bold text-lg hidden sm:inline">Smart Attendance</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "rounded-lg transition-all duration-300",
                    isActive
                      ? "bg-primary text-primary-foreground glow-primary-hover"
                      : "hover:bg-primary/10 text-foreground",
                  )}
                >
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center cursor-pointer hover:shadow-lg hover:shadow-primary/50 transition-shadow">
            <span className="text-white font-semibold text-sm">JD</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
