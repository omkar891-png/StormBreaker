"use client"

import * as React from "react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Switch } from "../../../components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { User, Lock, Bell, Settings, Shield, Save, LogOut } from "lucide-react"

export default function SettingsPage() {
    return (
        <div className="flex flex-col gap-6 animate-fade-in max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your account and system preferences.</p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-secondary/20">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="system">System</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                {/* Profile Settings */}
                <TabsContent value="profile">
                    <Card className="glass-dark border-primary/10 mt-4">
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your personal details and public profile.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-6">
                                <Avatar className="h-24 w-24 border-2 border-primary/20">
                                    <AvatarImage src="/avatars/admin.png" />
                                    <AvatarFallback className="text-xl">AD</AvatarFallback>
                                </Avatar>
                                <div className="space-y-2">
                                    <Button variant="outline" size="sm">Change Avatar</Button>
                                    <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 800K</p>
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" defaultValue="Admin" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" defaultValue="User" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" defaultValue="admin@stormbreaker.edu" type="email" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Input id="role" defaultValue="Super Admin" disabled className="bg-muted" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 border-t border-white/5 pt-6">
                            <Button variant="ghost">Cancel</Button>
                            <Button className="gap-2"><Save className="h-4 w-4" /> Save Changes</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* System Settings */}
                <TabsContent value="system">
                    <Card className="glass-dark border-primary/10 mt-4">
                        <CardHeader>
                            <CardTitle>System Preferences</CardTitle>
                            <CardDescription>Configure global system behavior.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between rounded-lg border border-white/5 p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Email Notifications</Label>
                                    <p className="text-xs text-muted-foreground">Receive daily summaries via email.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between rounded-lg border border-white/5 p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Attendance Alerts</Label>
                                    <p className="text-xs text-muted-foreground">Notify when attendance drops below 75%.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between rounded-lg border border-white/5 p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Dark Mode</Label>
                                    <p className="text-xs text-muted-foreground">Force dark theme across the dashboard.</p>
                                </div>
                                <Switch defaultChecked disabled />
                            </div>
                            <div className="space-y-2 pt-4">
                                <Label htmlFor="threshold">Late Arrival Threshold (Minutes)</Label>
                                <Input id="threshold" type="number" defaultValue="15" className="max-w-[200px]" />
                                <p className="text-xs text-muted-foreground">Students arriving after this time will be marked late.</p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 border-t border-white/5 pt-6">
                            <Button className="gap-2"><Save className="h-4 w-4" /> Save Preferences</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security">
                    <Card className="glass-dark border-primary/10 mt-4">
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>Manage your password and session.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current">Current Password</Label>
                                <Input id="current" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new">New Password</Label>
                                <Input id="new" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm">Confirm Password</Label>
                                <Input id="confirm" type="password" />
                            </div>
                            <div className="pt-4">
                                <Button variant="destructive" className="gap-2 w-full sm:w-auto">
                                    <LogOut className="h-4 w-4" /> Log out of all devices
                                </Button>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 border-t border-white/5 pt-6">
                            <Button className="gap-2"><Save className="h-4 w-4" /> Update Password</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
