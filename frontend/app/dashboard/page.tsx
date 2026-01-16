"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <>
      {/* Welcome Section */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold mb-2">Welcome Back, John</h1>
        <p className="text-muted-foreground">Here's your attendance system overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-slide-up">
        {[
          { label: "Today's Attendance", value: "247", subtext: "Students marked" },
          { label: "Pending Verification", value: "12", subtext: "Requires review" },
          { label: "System Alerts", value: "3", subtext: "Anti-proxy detected" },
        ].map((stat, idx) => (
          <Card
            key={idx}
            className="glass-dark border-primary/20 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.subtext}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
        {/* Live Attendance Status */}
        <Card className="glass-dark border-primary/20 lg:col-span-2">
          <CardHeader>
            <CardTitle>Live Attendance Status</CardTitle>
            <CardDescription>Real-time session tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { session: "CS101 - Data Structures", count: "45/50", status: "Active" },
                { session: "CS102 - Web Development", count: "38/42", status: "Active" },
                { session: "CS103 - Database Design", count: "0/35", status: "Not Started" },
              ].map((session, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-primary/10 hover:border-primary/30 transition-all"
                >
                  <div>
                    <p className="font-medium text-sm">{session.session}</p>
                    <p className="text-xs text-muted-foreground">{session.count} students</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${session.status === "Active" ? "bg-primary/20 text-primary" : "bg-muted/20 text-muted-foreground"
                      }`}
                  >
                    {session.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-dark border-primary/20">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                "Face verification failed - Retry initiated",
                "ID card swap detected in CS101",
                "Liveness check passed - Attendance marked",
                "New student enrollment processed",
              ].map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                  <p className="text-muted-foreground">{activity}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="glass-dark border-primary/20">
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-medium">Recognition Accuracy</span>
                  <span className="text-xs text-primary font-semibold">98.5%</span>
                </div>
                <div className="w-full bg-background/30 rounded-full h-2">
                  <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full w-[98.5%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-medium">System Uptime</span>
                  <span className="text-xs text-accent font-semibold">99.9%</span>
                </div>
                <div className="w-full bg-background/30 rounded-full h-2">
                  <div className="bg-gradient-to-r from-accent to-primary h-2 rounded-full w-[99.9%]"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="mt-8 p-6 rounded-lg glass-dark border-primary/30 border flex items-center justify-between animate-slide-up">
        <div>
          <h3 className="font-semibold mb-1">Start Live Session</h3>
          <p className="text-sm text-muted-foreground">Begin attendance marking for your class</p>
        </div>
        <Button className="glow-primary-hover bg-primary hover:bg-primary/90">Start Session</Button>
      </div>

      {/* Styles removed - relying on tailwindcss-animate if valid, or just simple transition */}
    </>
  )
}
