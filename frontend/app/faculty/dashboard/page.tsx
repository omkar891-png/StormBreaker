"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Play, Calendar, Users, Clock, CheckCircle, BarChart3, RefreshCw } from "lucide-react"

export default function FacultyDashboard() {
    const router = useRouter()
    const [stats, setStats] = React.useState<any>(null)
    const [recentSessions, setRecentSessions] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(true)

    // State for "Create Live Lecture"
    const [lectureForm, setLectureForm] = React.useState({
        dept: "",
        classYear: "",
        subject: "",
    })

    const fetchData = async () => {
        const token = localStorage.getItem("token")
        if (!token) return

        try {
            const headers = { 'Authorization': `Bearer ${token}` }

            // Fetch Faculty Stats
            const statsRes = await fetch('/api/reports/faculty-stats', { headers })
            let statsData = null
            if (statsRes.ok) {
                statsData = await statsRes.json()
                setStats(statsData)
            }

            // Fetch Recent Attendance for subjects assigned to teacher
            const attendanceRes = await fetch('/api/attendance/my?limit=10', { headers })
            if (attendanceRes.ok) {
                const logs = await attendanceRes.json()
                setRecentSessions(logs)
            }

            // Sync lecture form with teacher's department if empty
            if (statsData) {
                setLectureForm(prev => ({
                    ...prev,
                    dept: prev.dept || statsData.department || "",
                    subject: prev.subject || (statsData.subjects ? statsData.subjects.split(',')[0].trim() : "")
                }))
            }
        } catch (error) {
            console.error("Error fetching faculty data:", error)
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        fetchData()
        // Simple polling for "real-time"
        const interval = setInterval(fetchData, 10000)
        return () => clearInterval(interval)
    }, [])

    const handleStartLecture = async () => {
        const token = localStorage.getItem("token")
        if (!token) return

        try {
            const response = await fetch("/api/sessions/start", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    subject: lectureForm.subject,
                    department: lectureForm.dept,
                    year: lectureForm.classYear,
                    division: ""
                })
            })

            if (response.ok) {
                const session = await response.json()
                router.push(`/faculty/lecture/live?dept=${lectureForm.dept}&class=${lectureForm.classYear}&sub=${lectureForm.subject}&session_id=${session.id}`)
            } else {
                const err = await response.json()
                alert(`Failed to start session: ${err.detail || 'Unknown error'}`)
            }
        } catch (error) {
            console.error("Error starting session:", error)
            alert("Network error while starting session")
        }
    }

    return (
        <main className="p-8 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome, {stats?.full_name || "Professor"}</h1>
                    <p className="text-muted-foreground">Manage your lectures and track student progress in {stats?.department || "your department"}.</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/5 px-4 py-2 rounded-full border border-white/10">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* START LIVE LECTURE CARD */}
                <Card className="glass-dark border-indigo-500/30 shadow-[0_0_30px_-5px_theme(colors.indigo.500/0.2)] lg:col-span-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Play className="h-64 w-64 text-indigo-500" />
                    </div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl text-indigo-400">
                            <Play className="h-6 w-6 fill-current" /> Initialize Live Session
                        </CardTitle>
                        <CardDescription>Configure the session details to start marking attendance.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Department</Label>
                                <Select value={lectureForm.dept} onValueChange={(v) => setLectureForm({ ...lectureForm, dept: v })}>
                                    <SelectTrigger className="bg-background/50 border-white/10"><SelectValue placeholder="Select Dept" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CS">Computer Science</SelectItem>
                                        <SelectItem value="IT">Info Tech</SelectItem>
                                        <SelectItem value="ME">Mechanical Engineering</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Class / Year</Label>
                                <Select value={lectureForm.classYear} onValueChange={(v) => setLectureForm({ ...lectureForm, classYear: v })}>
                                    <SelectTrigger className="bg-background/50 border-white/10"><SelectValue placeholder="Select Year" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="FY">First Year</SelectItem>
                                        <SelectItem value="SY">Second Year</SelectItem>
                                        <SelectItem value="TY">Third Year</SelectItem>
                                        <SelectItem value="BE">Final Year</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Subject</Label>
                                <Select value={lectureForm.subject} onValueChange={(v) => setLectureForm({ ...lectureForm, subject: v })}>
                                    <SelectTrigger className="bg-background/50 border-white/10"><SelectValue placeholder="Select Subject" /></SelectTrigger>
                                    <SelectContent>
                                        {stats?.subjects?.split(',').map((sub: string) => (
                                            <SelectItem key={sub.trim()} value={sub.trim()}>{sub.trim()}</SelectItem>
                                        ))}
                                        {!stats?.subjects && <SelectItem value="none" disabled>No subjects assigned</SelectItem>}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20" onClick={handleStartLecture}>
                            Start Attendance Session <Play className="ml-2 h-4 w-4 fill-current" />
                        </Button>
                    </CardContent>
                </Card>

                {/* STATS & QUICK INFO */}
                <div className="space-y-6">
                    <Card className="glass-dark border-primary/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Active Subjects</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{loading ? "..." : stats?.lectures_today || 0} / {stats?.total_subjects || 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">Sessions with records today</p>
                        </CardContent>
                    </Card>
                    <Card className="glass-dark border-primary/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Attendance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-500">{loading ? "..." : (stats?.avg_attendance || 0)}%</div>
                            <p className="text-xs text-muted-foreground mt-1 text-green-400">System average</p>
                        </CardContent>
                    </Card>
                    <Card className="glass-dark border-primary/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Quick Refresh</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" size="sm" onClick={fetchData} className="w-full gap-2">
                                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Sync Data
                            </Button>
                        </CardContent>
                    </Card>
                </div>

            </div>

            {/* RECENT ACTIVITY / LOGS */}
            <Card className="glass-dark border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Recent Attendance Logs</CardTitle>
                        <CardDescription>Live feed of students marking attendance in your subjects.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader className="bg-white/5">
                            <TableRow className="border-white/10 hover:bg-white/5">
                                <TableHead>Subject</TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead>Roll No</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={6} className="text-center py-10">Loading...</TableCell></TableRow>
                            ) : recentSessions.length === 0 ? (
                                <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No recent attendance found.</TableCell></TableRow>
                            ) : recentSessions.map((log, i) => (
                                <TableRow key={i} className="border-white/10 hover:bg-white/5">
                                    <TableCell className="font-medium">{log.subject}</TableCell>
                                    <TableCell>{log.student?.full_name || "Unknown"}</TableCell>
                                    <TableCell className="font-mono text-xs">{log.student?.roll_number || "N/A"}</TableCell>
                                    <TableCell className="text-xs text-primary">{new Date(log.timestamp).toLocaleTimeString()}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className={log.status === "PRESENT"
                                                ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                                : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                            }
                                        >
                                            {log.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href="/faculty/attendance">View</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </main>
    )
}
