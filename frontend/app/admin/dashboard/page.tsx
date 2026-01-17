"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Users, GraduationCap, Calendar, AlertTriangle, TrendingUp, Clock, Plus, Download, RefreshCw } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface DashboardStats {
    total_students: number
    total_teachers: number
    total_exams: number
    total_notifications: number
    present_today: number
    absent_today: number
}

interface AttendanceRecord {
    id: number
    student_id: number
    timestamp: string
    status: string
    subject: string
    student?: {
        full_name: string
        roll_number: string
    }
}

interface Defaulter {
    student_id: number
    name: string
    roll_number: string
    attendance_count: number
}

interface HistoryData {
    date: string
    count: number
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [recentAttendance, setRecentAttendance] = useState<AttendanceRecord[]>([])
    const [defaulters, setDefaulters] = useState<Defaulter[]>([])
    const [history, setHistory] = useState<HistoryData[]>([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        setLoading(true)
        const token = localStorage.getItem("token")
        if (!token) return

        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            }

            // Fetch Stats
            const statsRes = await fetch('/api/reports/dashboard-stats', { headers })
            if (statsRes.ok) {
                const statsData = await statsRes.json()
                setStats(statsData)
            }

            // Fetch Recent Attendance
            const attendanceRes = await fetch('/api/attendance/?limit=5', { headers })
            if (attendanceRes.ok) {
                const attendanceData = await attendanceRes.json()
                setRecentAttendance(attendanceData)
            }

            // Fetch Defaulters
            const defaultersRes = await fetch('/api/reports/defaulters', { headers })
            if (defaultersRes.ok) {
                const defaultersData = await defaultersRes.json()
                setDefaulters(defaultersData)
            }

            // Fetch Attendance History
            const historyRes = await fetch('/api/reports/attendance-history', { headers })
            if (historyRes.ok) {
                const historyData = await historyRes.json()
                setHistory(historyData)
            }

        } catch (error) {
            console.error("Error fetching dashboard data:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const chartData = useMemo(() => {
        if (!history || history.length === 0) {
            return [
                { date: 'Mon', count: 0 },
                { date: 'Tue', count: 0 },
                { date: 'Wed', count: 0 },
                { date: 'Thu', count: 0 },
                { date: 'Fri', count: 0 },
            ]
        }
        return history.map(h => ({
            date: new Date(h.date).toLocaleDateString('en-US', { weekday: 'short' }),
            count: h.count
        }))
    }, [history])

    return (
        <main className="p-8 space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                    <p className="text-muted-foreground">Welcome back, Admin. Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" onClick={fetchData} disabled={loading} className="rounded-full">
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
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
                        <div className="text-2xl font-bold">{loading ? "..." : stats?.total_students || 0}</div>
                        <p className="text-xs text-muted-foreground">Registered in system</p>
                    </CardContent>
                </Card>
                <Card className="glass-dark border-primary/20 hover:border-primary/50 transition-colors group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? "..." : stats?.total_teachers || 0}</div>
                        <p className="text-xs text-muted-foreground">Active faculty members</p>
                    </CardContent>
                </Card>
                <Card className="glass-dark border-primary/20 hover:border-primary/50 transition-colors group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Present Today</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground group-hover:text-green-400 transition-colors" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-400">{loading ? "..." : stats?.present_today || 0}</div>
                        <p className="text-xs text-muted-foreground">Students marked today</p>
                    </CardContent>
                </Card>
                <Card className="glass-dark border-primary/20 hover:border-primary/50 transition-colors group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Defaulters</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground group-hover:text-red-400 transition-colors" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-400">{loading ? "..." : defaulters.length}</div>
                        <p className="text-xs text-muted-foreground">Below attendance threshold</p>
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
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e1b4b', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px' }}
                                        itemStyle={{ color: '#818cf8' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#6366f1"
                                        fillOpacity={1}
                                        fill="url(#colorCount)"
                                        strokeWidth={3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
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
                                {recentAttendance.length > 0 ? (
                                    recentAttendance.map((record, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-background/40 border border-white/5 hover:border-primary/20 transition-all">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 rounded bg-primary/10 text-primary mt-1">
                                                    <Clock className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">{record.subject}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {record.student?.full_name || `Student ID: ${record.student_id}`} ({record.student?.roll_number || 'N/A'}) • <span className="text-primary">{new Date(record.timestamp).toLocaleTimeString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-xs font-bold px-2 py-0.5 rounded inline-block mb-1 bg-green-500/20 text-green-400`}>
                                                    {record.status}
                                                </div>
                                                <div className="text-xs text-muted-foreground">{new Date(record.timestamp).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No recent attendance records found.
                                    </div>
                                )}
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
                            <Button variant="outline" className="h-20 flex-col gap-2 border-white/10 hover:border-accent/50 hover:bg-accent/5 transition-all" asChild>
                                <Link href="/admin/teachers/add">
                                    <GraduationCap className="h-5 w-5 text-accent" />
                                    <span className="text-xs">Add Teacher</span>
                                </Link>
                            </Button>
                            <Button variant="outline" className="h-20 flex-col gap-2 border-white/10 hover:border-green-400/50 hover:bg-green-400/5 transition-all" asChild>
                                <Link href="/admin/academic">
                                    <Calendar className="h-5 w-5 text-green-400" />
                                    <span className="text-xs">Academic Structure</span>
                                </Link>
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
                            <CardTitle className="text-sm font-medium text-muted-foreground">Defaulters List</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3 relative">
                                {defaulters.length > 0 ? (
                                    defaulters.map((defaulter, i) => (
                                        <div key={i} className="flex gap-3 relative">
                                            <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 z-10 bg-red-400`}></div>
                                            <div>
                                                <p className="text-xs font-medium">{defaulter.name} ({defaulter.roll_number})</p>
                                                <p className="text-xs opacity-70">Attendance: {defaulter.attendance_count}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-xs text-muted-foreground italic">No defaulters found below threshold.</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </main>
    )
}
