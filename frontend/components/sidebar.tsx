"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarItem {
  label: string
  icon: string
  action: string
  color?: string
}

const quickAccessItems: SidebarItem[] = [
  { label: "Mark Attendance", icon: "✓", action: "mark", color: "text-primary" },
  { label: "Today's Attendance", icon: "📊", action: "today" },
  { label: "Scan ID Card", icon: "🆔", action: "scan" },
  { label: "Face Recognition", icon: "👤", action: "face" },
  { label: "Notifications", icon: "🔔", action: "notify", color: "text-accent" },
  { label: "Help", icon: "❓", action: "help" },
]

export function Sidebar() {
  const [activeAction, setActiveAction] = useState<string | null>(null)

  return (
    <aside className="fixed right-4 top-24 flex flex-col gap-2 w-64 glass-dark p-4 rounded-lg h-[calc(100vh-8rem)] overflow-y-auto">
      <h3 className="text-sm font-semibold text-primary mb-4">Quick Access</h3>

      <div className="space-y-2">
        {quickAccessItems.map((item) => (
          <button
            key={item.action}
            onClick={() => setActiveAction(item.action)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
              "hover:bg-primary/20 hover:border-primary/50",
              "border border-transparent",
              activeAction === item.action
                ? "bg-primary/30 border-primary/50 shadow-lg shadow-primary/30"
                : "bg-background/20 hover:shadow-md hover:shadow-primary/20",
            )}
          >
            <span className={cn("text-xl", item.color)}>{item.icon}</span>
            <span className="text-xs font-medium text-foreground flex-1 text-left">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-primary/20">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs bg-transparent"
          onClick={() => {
            localStorage.removeItem("user")
            window.location.href = "/auth/login"
          }}
        >
          Logout
        </Button>
      </div>
    </aside>
  )
}
