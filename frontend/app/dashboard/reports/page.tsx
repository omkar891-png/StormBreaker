"use client"

import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ReportsPage() {
  return (
    <>
      <DashboardNavbar />

      <div className="pt-24 pr-80 px-6 pb-8">
        <h1 className="text-4xl font-bold mb-2">Reports & Analytics</h1>
        <p className="text-muted-foreground mb-8">View comprehensive attendance analytics and reports</p>

        {/* Report Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[
            {
              title: "Attendance Summary",
              desc: "Overall attendance statistics and trends",
              icon: "📊",
            },
            {
              title: "Anti-Proxy Alerts",
              desc: "Detected proxy attempts and security events",
              icon: "🔒",
            },
            {
              title: "Student Performance",
              desc: "Individual student attendance patterns",
              icon: "📈",
            },
            {
              title: "System Health",
              desc: "System reliability and performance metrics",
              icon: "💚",
            },
          ].map((report, idx) => (
            <Card
              key={idx}
              className="glass-dark border-primary/20 hover:border-primary/50 transition-all cursor-pointer"
            >
              <CardContent className="pt-6">
                <div className="text-3xl mb-3">{report.icon}</div>
                <h3 className="font-semibold mb-1">{report.title}</h3>
                <p className="text-xs text-muted-foreground mb-4">{report.desc}</p>
                <Button variant="outline" size="sm" className="w-full text-xs glow-primary-hover bg-transparent">
                  View Report
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analytics Overview */}
        <Card className="glass-dark border-primary/20">
          <CardHeader>
            <CardTitle>Monthly Analytics</CardTitle>
            <CardDescription>Last 30 days performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: "Total Sessions", value: "142", change: "+5%" },
                { label: "Avg Attendance", value: "87%", change: "+2%" },
                { label: "Anti-Proxy Blocks", value: "23", change: "-3%" },
                { label: "System Uptime", value: "99.8%", change: "Stable" },
              ].map((metric, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-background/30 border border-primary/10">
                  <p className="text-xs text-muted-foreground mb-2">{metric.label}</p>
                  <p className="text-2xl font-bold text-primary">{metric.value}</p>
                  <p className="text-xs text-accent mt-2">{metric.change}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Sidebar />
    </>
  )
}
