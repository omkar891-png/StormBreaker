"use client"

import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {
  return (
    <>
      <DashboardNavbar />

      <div className="pt-24 pr-80 px-6 pb-8">
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground mb-8">Manage your account and system preferences</p>

        <div className="space-y-6 max-w-2xl">
          {/* Profile Settings */}
          <Card className="glass-dark border-primary/20">
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Full Name</Label>
                <Input placeholder="John Doe" className="bg-background/50 border-primary/20 mt-1" />
              </div>
              <div>
                <Label className="text-xs">Email</Label>
                <Input placeholder="john@college.edu" className="bg-background/50 border-primary/20 mt-1" />
              </div>
              <Button className="glow-primary-hover">Save Changes</Button>
            </CardContent>
          </Card>

          {/* System Preferences */}
          <Card className="glass-dark border-primary/20">
            <CardHeader>
              <CardTitle>System Preferences</CardTitle>
              <CardDescription>Configure system behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Enable Notifications</p>
                  <p className="text-xs text-muted-foreground">Get alerts for important events</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
              <Button variant="outline" className="w-full text-xs bg-transparent">
                More Preferences
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Sidebar />
    </>
  )
}
