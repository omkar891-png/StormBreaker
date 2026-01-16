"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/50 backdrop-blur-md border-b border-white/10 support-[backdrop-filter]:bg-background/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="bg-primary/20 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground">
                SmartAttendance
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button className="rounded-full shadow-lg shadow-primary/20" asChild>
              <Link href="/auth/login">Portal Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
