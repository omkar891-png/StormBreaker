"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { ScanFace, CreditCard, CheckCircle2, Clock, MapPin, AlertTriangle } from "lucide-react"

export default function StudentDashboard() {
    return (
        <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">Loading dashboard...</div>}>
            <StudentDashboardContent />
        </React.Suspense>
    )
}

function StudentDashboardContent() {
    const [studentProfile, setStudentProfile] = React.useState<any>(null)
    const [stats, setStats] = React.useState<any>(null)
    const [activeSession, setActiveSession] = React.useState<any>(null)
    const [loading, setLoading] = React.useState(true)
    const router = useRouter()
    const searchParams = useSearchParams()

    // Live Lecture State
    const [attendanceStatus, setAttendanceStatus] = React.useState<"idle" | "verifying" | "submitted">("idle")
    const [verificationMethod, setVerificationMethod] = React.useState("face")
    const [submittedTime, setSubmittedTime] = React.useState("")

    const fetchData = React.useCallback(async () => {
        const token = localStorage.getItem("token")
        if (!token) {
            router.push("/auth/login")
            return
        }

        try {
            const headers = { "Authorization": `Bearer ${token}` }

            // 1. Fetch Student Stats & Profile Info
            const statsRes = await fetch("/api/reports/student-stats", { headers })
            if (statsRes.status === 401) {
                router.push("/auth/login")
                return
            }
            if (!statsRes.ok) throw new Error("Failed to fetch statistics")
            const statsData = await statsRes.json()
            setStats(statsData)
            setStudentProfile(statsData)

            // Check if profile is complete
            if (!statsData.is_profile_complete) {
                router.push("/student/onboarding")
                return
            }

            // 2. Fetch Active Session for this student's class (ignore division as per request)
            const sessionsRes = await fetch(`/api/sessions/active?dept=${statsData.department}&year=${statsData.year}`, { headers })
            if (sessionsRes.ok) {
                const sessions = await sessionsRes.json()
                // Just take the first active session for now
                if (sessions.length > 0) {
                    setActiveSession(sessions[0])
                } else {
                    setActiveSession(null)
                }
            }

        } catch (error) {
            console.error("Error fetching dashboard data:", error)
        } finally {
            setLoading(false)
        }
    }, [router])

    React.useEffect(() => {
        fetchData()
        // Poll for active sessions every 5 seconds for real-time responsiveness
        const interval = setInterval(fetchData, 5000)
        return () => clearInterval(interval)
    }, [fetchData])

    React.useEffect(() => {
        if (searchParams.get('verified') === 'true') {
            setAttendanceStatus("submitted")
            setSubmittedTime(new Date().toLocaleTimeString())
        }
    }, [searchParams])

    const handleMarkAttendance = () => {
        if (!activeSession) return;

        if (verificationMethod === 'face') {
            router.push(`/student/attendance/face?subject=${encodeURIComponent(activeSession.subject)}&session_id=${activeSession.id}`)
            return
        }
        if (verificationMethod === 'idcard') {
            router.push(`/student/attendance/id-card?subject=${encodeURIComponent(activeSession.subject)}&session_id=${activeSession.id}`)
            return
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background text-muted-foreground gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="animate-pulse">Loading Your Dashboard...</p>
            </div>
        )
    }

    if (!studentProfile) return null;

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full pointer-events-none -z-10" />

            {/* Top Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-primary/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
                                <span className="text-white font-bold text-sm">SA</span>
                            </div>
                            <span className="font-bold text-lg hidden sm:block">Smart Attendance</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium leading-none">{studentProfile.full_name}</p>
                                <p className="text-xs text-muted-foreground">{studentProfile.roll_number}</p>
                            </div>
                            <Link href="/student/profile">
                                <Avatar className="h-9 w-9 border-2 border-primary/20 cursor-pointer hover:border-primary transition-colors">
                                    <AvatarImage src={studentProfile.profile_picture || "/avatars/01.png"} alt={studentProfile.full_name} />
                                    <AvatarFallback>{studentProfile.full_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </Link>
                            <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
                                <Link href="/auth/login">Logout</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">

                {/* --- SMART ALERT FOR DEFAULTERS --- */}
                {(stats?.attendance_percentage || 0) < 75 && (
                    <Card className="border-l-4 border-l-red-500 bg-red-500/10 border-red-500/20 shadow-lg shadow-red-500/5">
                        <CardContent className="p-6 flex items-start gap-4">
                            <div className="p-3 bg-red-500/20 rounded-full shrink-0 animate-pulse">
                                <AlertTriangle className="h-6 w-6 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-red-500 mb-1">Attendance Alert: Action Required</h3>
                                <p className="text-muted-foreground mb-3">
                                    Your current attendance is <span className="font-bold text-red-400">{stats?.attendance_percentage}%</span>,
                                    which is below the mandatory 75% threshold. You are currently on the defaulter list.
                                </p>
                                <div className="flex gap-2">
                                    <Button variant="destructive" size="sm" className="bg-red-500 hover:bg-red-600 text-white border-none shadow-lg shadow-red-500/20">Contact HOD</Button>
                                    <Button variant="outline" size="sm" className="border-red-500/30 hover:bg-red-500/10 text-red-400 hover:text-red-300">View Detention Policy</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* --- LIVE LECTURE STATUS SECTION --- */}
                <Card className={`border-2 shadow-2xl relative overflow-hidden ${activeSession ? 'border-indigo-500/50 shadow-indigo-500/10' : 'border-white/10'}`}>
                    {activeSession && (
                        <div className="absolute top-0 right-0 p-4">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                            </span>
                        </div>
                    )}
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <Badge variant={activeSession ? "default" : "secondary"} className={activeSession ? "bg-indigo-600 hover:bg-indigo-700" : ""}>
                                {activeSession ? "LIVE LECTURE ACTIVE" : "NO ACTIVE LECTURE"}
                            </Badge>
                            {activeSession && <span className="text-xs text-indigo-400 font-mono animate-pulse">Session ID: LEC-{activeSession.id}</span>}
                        </div>
                        <CardTitle className="text-2xl">
                            {activeSession ? activeSession.subject : "You're all caught up!"}
                        </CardTitle>
                        <CardDescription>
                            {activeSession
                                ? `Dept: ${activeSession.department} • Year: ${activeSession.year} • Div: ${activeSession.division}`
                                : "Check back later for your next scheduled session."}
                        </CardDescription>
                    </CardHeader>
                    {activeSession && (
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm text-muted-foreground bg-white/5 p-3 rounded-lg border border-white/10">
                                    <Clock className="h-4 w-4 text-indigo-400" />
                                    <span>Started: {new Date(activeSession.start_time).toLocaleTimeString()}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground bg-white/5 p-3 rounded-lg border border-white/10">
                                    <MapPin className="h-4 w-4 text-indigo-400" />
                                    <span>Live in Classroom</span>
                                </div>
                            </div>

                            <div className="flex flex-col justify-center">
                                {attendanceStatus === 'submitted' ? (
                                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center animate-in zoom-in duration-300">
                                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_theme(colors.green.500/0.4)]">
                                            <CheckCircle2 className="h-8 w-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-green-500 mb-1">Attendance Submitted!</h3>
                                        <p className="text-sm text-muted-foreground">Verified at {submittedTime}</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <p className="text-sm text-muted-foreground mb-2">Select Verification Method:</p>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <Button
                                                variant={verificationMethod === 'face' ? "default" : "outline"}
                                                className={`h-20 flex flex-col gap-2 ${verificationMethod === 'face' ? 'bg-indigo-600 border-indigo-500' : 'border-white/10'}`}
                                                onClick={() => setVerificationMethod('face')}
                                                disabled={attendanceStatus === 'verifying'}
                                            >
                                                <ScanFace className="h-6 w-6" />
                                                <span className="text-xs">Face ID</span>
                                            </Button>
                                            <Button
                                                variant={verificationMethod === 'idcard' ? "default" : "outline"}
                                                className={`h-20 flex flex-col gap-2 ${verificationMethod === 'idcard' ? 'bg-indigo-600 border-indigo-500' : 'border-white/10'}`}
                                                onClick={() => setVerificationMethod('idcard')}
                                                disabled={attendanceStatus === 'verifying'}
                                            >
                                                <CreditCard className="h-6 w-6" />
                                                <span className="text-xs">ID Card</span>
                                            </Button>
                                        </div>

                                        <Button
                                            size="lg"
                                            className="w-full text-lg h-14 bg-indigo-600 hover:bg-indigo-700 shadow-[0_0_20px_-5px_theme(colors.indigo.500/0.5)] transition-all active:scale-95"
                                            onClick={handleMarkAttendance}
                                            disabled={attendanceStatus === 'verifying'}
                                        >
                                            {attendanceStatus === 'verifying' ? (
                                                <span className="flex items-center gap-2">
                                                    <ScanFace className="animate-pulse" /> Verifying...
                                                </span>
                                            ) : (
                                                "Mark Attendance Now"
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    )}
                    {!activeSession && (
                        <CardFooter>
                            <Button disabled className="w-full opacity-50 cursor-not-allowed">No Active Lecture Right Now</Button>
                        </CardFooter>
                    )}
                </Card>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Attendance Card */}
                    <Card className="glass-dark border-primary/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Attendance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-4xl font-bold text-primary">{stats?.attendance_percentage || 0}%</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Last: {stats?.last_marked ? `${stats.last_marked.subject} at ${new Date(stats.last_marked.timestamp).toLocaleTimeString()}` : "Never"}
                                    </p>
                                </div>
                                <div className="h-16 w-16 rounded-full border-4 border-primary/30 flex items-center justify-center border-t-primary">
                                    <span className="text-xs font-bold">{stats?.attendance_percentage || 0}%</span>
                                </div>
                            </div>
                            <div className="mt-4 h-2 w-full bg-secondary/30 rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${stats?.attendance_percentage || 0}%` }}></div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Performance Card */}
                    <Card className="glass-dark border-primary/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Performance Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-4xl font-bold text-accent">
                                        {(stats?.attendance_percentage || 0) > 75 ? "Excellent" : (stats?.attendance_percentage || 0) > 60 ? "Good" : "Needs Attention"}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">Based on attendance</p>
                                </div>
                                <div className="text-4xl">🏆</div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-4">
                                <div className="bg-primary/10 p-2 rounded text-center">
                                    <span className="block text-xs text-muted-foreground">GPA</span>
                                    <span className="font-bold text-primary">3.8</span>
                                </div>
                                <div className="bg-primary/10 p-2 rounded text-center">
                                    <span className="block text-xs text-muted-foreground">Rank</span>
                                    <span className="font-bold text-primary">#12</span>
                                </div>
                                <div className="bg-primary/10 p-2 rounded text-center">
                                    <span className="block text-xs text-muted-foreground">Credits</span>
                                    <span className="font-bold text-primary">24</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Academics Card */}
                    <Card className="glass-dark border-primary/10 hover:border-primary/40 transition-all group">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">📚</span>
                                Academics
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                <Link href="/student/results">
                                    <li className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                                        View Results & Grades
                                    </li>
                                </Link>
                                <Link href="/student/assignments">
                                    <li className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                                        My Assignments
                                    </li>
                                </Link>
                                <Link href="/student/timetable">
                                    <li className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                                        Class Timetable
                                    </li>
                                </Link>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Exams Card */}
                    <Card className="glass-dark border-primary/10 hover:border-primary/40 transition-all group">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="p-2 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">📝</span>
                                Exam Portal
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent/50"></span>
                                    Exam Registration
                                </li>
                                <li className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent/50"></span>
                                    Admit Cards
                                </li>
                                <li className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent/50"></span>
                                    Results & Grades
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Support Card */}
                    <Card className="glass-dark border-primary/10 hover:border-primary/40 transition-all group">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="p-2 rounded-lg bg-green-500/10 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">💬</span>
                                Support
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/50"></span>
                                    Submit Feedback
                                </li>
                                <Link href="/student/leave">
                                    <li className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500/50"></span>
                                        Request Leave
                                    </li>
                                </Link>
                                <li className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/50"></span>
                                    Help Desk
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    )
}
