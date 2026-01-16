"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Users, GraduationCap, Calendar, AlertTriangle, TrendingUp, Clock, Plus, Download } from "lucide-react"

export default function AdminDashboardPage() {
    return (
        <main className="p-8 space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                    <p className="text-muted-foreground">Welcome back, Admin. Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10">
                        <Download className="h-4 w-4" /> Export Report
                    </Button>
                    <Button className="gap-2 glow-primary-hover shadow-lg shadow-primary/20">
                        <Plus className="h-4 w-4" /> Quick Add
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="glass-dark border-primary/20 hover:border-primary/50 transition-colors group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2,543</div>
                        <p className="text-xs text-muted-foreground">+180 from last month</p>
                    </CardContent>
                </Card>
                <Card className="glass-dark border-primary/20 hover:border-primary/50 transition-colors group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">128</div>
                        <p className="text-xs text-muted-foreground">+4 new hires</p>
                    </CardContent>
                </Card>
                <Card className="glass-dark border-primary/20 hover:border-primary/50 transition-colors group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground group-hover:text-green-400 transition-colors" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-400">88.2%</div>
                        <p className="text-xs text-muted-foreground">+2.1% this week</p>
                    </CardContent>
                </Card>
                <Card className="glass-dark border-primary/20 hover:border-primary/50 transition-colors group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Defaulters</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground group-hover:text-red-400 transition-colors" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-400">43</div>
                        <p className="text-xs text-muted-foreground">Below 75% threshold</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Chart / Detailed Stats Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Analytics Panel Placeholder */}
                    <Card className="glass-dark border-primary/20 h-[400px]">
                        <CardHeader>
                            <CardTitle>Attendance Analytics</CardTitle>
                            <CardDescription>Daily attendance trends across all departments</CardDescription>
                        </CardHeader>
                        <CardContent className="h-full flex items-center justify-center text-muted-foreground">
                            {/* Placeholder for Recharts or similar */}
                            <div className="w-full h-[300px] bg-white/5 rounded-lg flex items-center justify-center border border-white/5 border-dashed">
                                <div className="text-center">
                                    <TrendingUp className="h-10 w-10 mx-auto mb-2 opacity-50" />
                                    <p>Attendance Graph Visuals</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Live Lecture Status */}
                    <Card className="glass-dark border-primary/20">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Live Lecture Status</CardTitle>
                                <CardDescription>Real-time classroom monitoring</CardDescription>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded animate-pulse">
                                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                Live Updates
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    { class: "CS-A", subject: "Data Structures", teacher: "Prof. Alan Turing", time: "10:00 - 11:00 AM", status: "Ongoing", room: "Lab 3" },
                                    { class: "CS-B", subject: "Web Dev", teacher: "Prof. Tim Berners-Lee", time: "10:00 - 11:00 AM", status: "Ongoing", room: "Room 101" },
                                    { class: "ME-A", subject: "Thermodynamics", teacher: "Prof. S. Carnot", time: "10:00 - 11:00 AM", status: "Late Start", room: "Room 204" },
                                    { class: "EE-A", subject: "Circuits", teacher: "Prof. N. Tesla", time: "11:00 - 12:00 PM", status: "Scheduled", room: "Lab 1" },
                                ].map((lecture, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-background/40 border border-white/5 hover:border-primary/20 transition-all">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 rounded bg-primary/10 text-primary mt-1">
                                                <Clock className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="font-medium">{lecture.subject}</div>
                                                <div className="text-xs text-muted-foreground">{lecture.teacher} • <span className="text-primary">{lecture.class}</span></div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-xs font-bold px-2 py-0.5 rounded inline-block mb-1 ${lecture.status === 'Ongoing' ? 'bg-green-500/20 text-green-400' :
                                                lecture.status === 'Late Start' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                {lecture.status}
                                            </div>
                                            <div className="text-xs text-muted-foreground">{lecture.room}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions & Notifications */}
                <div className="space-y-6">
                    {/* Quick Management */}
                    <Card className="glass-dark border-primary/20">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="h-20 flex-col gap-2 border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all" asChild>
                                <Link href="/admin/students/add">
                                    <Users className="h-5 w-5 text-primary" />
                                    <span className="text-xs">Add Student</span>
                                </Link>
                            </Button>
                            <Button variant="outline" className="h-20 flex-col gap-2 border-white/10 hover:border-accent/50 hover:bg-accent/5 transition-all">
                                <GraduationCap className="h-5 w-5 text-accent" />
                                <span className="text-xs">Add Teacher</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex-col gap-2 border-white/10 hover:border-green-400/50 hover:bg-green-400/5 transition-all">
                                <Calendar className="h-5 w-5 text-green-400" />
                                <span className="text-xs">Schedule Class</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex-col gap-2 border-white/10 hover:border-yellow-400/50 hover:bg-yellow-400/5 transition-all">
                                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                                <span className="text-xs">Send Alert</span>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Recent Activity / Logs */}
                    <Card className="glass-dark border-primary/20 font-mono text-sm max-h-[400px] overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">System Logs</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3 relative">
                                {/* Simple timeline line */}
                                <div className="absolute left-1.5 top-2 bottom-0 w-px bg-white/10"></div>

                                {[
                                    { time: "10:42 AM", msg: "Attendance marked for CS-A", type: "success" },
                                    { time: "10:30 AM", msg: "New student registered: Alex D.", type: "info" },
                                    { time: "09:15 AM", msg: "System backup completed", type: "system" },
                                    { time: "09:00 AM", msg: "Server Restarted", type: "system" },
                                ].map((log, i) => (
                                    <div key={i} className="flex gap-3 relative">
                                        <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 z-10 ${log.type === 'success' ? 'bg-green-400' :
                                            log.type === 'info' ? 'bg-blue-400' : 'bg-gray-400'
                                            }`}></div>
                                        <div>
                                            <p className="text-xs opacity-70 mb-0.5">{log.time}</p>
                                            <p className="text-xs font-medium">{log.msg}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </main>
    )
}
