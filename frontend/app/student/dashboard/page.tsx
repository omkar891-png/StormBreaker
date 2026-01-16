"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { ScanFace, CreditCard, CheckCircle2, Clock, MapPin } from "lucide-react"

export default function StudentDashboard() {
    // Mock Data
    const student = {
        name: "Alex Doe",
        id: "STU-2024-001",
        course: "Computer Science",
        attendance: 85,
        lastMarked: "Today, 9:30 AM",
        performance: "Excellent"
    }

    const router = useRouter()
    const searchParams = useSearchParams()

    // Live Lecture State (Mocked: True to demonstrate the feature)
    const [isLectureActive, setIsLectureActive] = React.useState(true)
    const [attendanceStatus, setAttendanceStatus] = React.useState<"idle" | "verifying" | "submitted">("idle")
    const [verificationMethod, setVerificationMethod] = React.useState("face")
    const [submittedTime, setSubmittedTime] = React.useState("")

    React.useEffect(() => {
        if (searchParams.get('verified') === 'true') {
            setAttendanceStatus("submitted")
            setSubmittedTime(new Date().toLocaleTimeString())
            // Clear param to avoid sticky state on refresh (optional, but good practice)
            // router.replace('/student/dashboard') 
        }
    }, [searchParams])

    const handleMarkAttendance = () => {
        if (verificationMethod === 'face') {
            router.push('/student/attendance/face')
            return
        }
        if (verificationMethod === 'idcard') {
            router.push('/student/attendance/id-card')
            return
        }


        setAttendanceStatus("verifying")
        // Simulate Verification Delay
        setTimeout(() => {
            setAttendanceStatus("submitted")
            setSubmittedTime(new Date().toLocaleTimeString())
        }, 2500)
    }

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
                                <p className="text-sm font-medium leading-none">{student.name}</p>
                                <p className="text-xs text-muted-foreground">{student.id}</p>
                            </div>
                            <Link href="/student/profile">
                                <Avatar className="h-9 w-9 border-2 border-primary/20 cursor-pointer hover:border-primary transition-colors">
                                    <AvatarImage src="/avatars/01.png" alt={student.name} />
                                    <AvatarFallback>AD</AvatarFallback>
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

                {/* --- LIVE LECTURE STATUS SECTION --- */}
                <Card className={`border-2 shadow-2xl relative overflow-hidden ${isLectureActive ? 'border-indigo-500/50 shadow-indigo-500/10' : 'border-white/10'}`}>
                    {isLectureActive && (
                        <div className="absolute top-0 right-0 p-4">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                            </span>
                        </div>
                    )}
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <Badge variant={isLectureActive ? "default" : "secondary"} className={isLectureActive ? "bg-indigo-600 hover:bg-indigo-700" : ""}>
                                {isLectureActive ? "LIVE LECTURE ACTIVE" : "NO ACTIVE LECTURE"}
                            </Badge>
                            {isLectureActive && <span className="text-xs text-indigo-400 font-mono animate-pulse">Session ID: LEC-8921</span>}
                        </div>
                        <CardTitle className="text-2xl">
                            {isLectureActive ? "Data Structures & Algorithms" : "You're all caught up!"}
                        </CardTitle>
                        <CardDescription>
                            {isLectureActive
                                ? "Prof. John Doe • Computer Science • Sy-CS-A"
                                : "Check back later for your next scheduled session."}
                        </CardDescription>
                    </CardHeader>
                    {isLectureActive && (
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm text-muted-foreground bg-white/5 p-3 rounded-lg border border-white/10">
                                    <Clock className="h-4 w-4 text-indigo-400" />
                                    <span>Started: 10:00 AM</span>
                                    <span className="text-white/20">|</span>
                                    <span>Ends: 11:00 AM</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground bg-white/5 p-3 rounded-lg border border-white/10">
                                    <MapPin className="h-4 w-4 text-indigo-400" />
                                    <span>Room 304, Main Building</span>
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
                    {!isLectureActive && (
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
                                    <div className="text-4xl font-bold text-primary">{student.attendance}%</div>
                                    <p className="text-xs text-muted-foreground mt-1">Last marked: {student.lastMarked}</p>
                                </div>
                                <div className="h-16 w-16 rounded-full border-4 border-primary/30 flex items-center justify-center border-t-primary">
                                    <span className="text-xs font-bold">{student.attendance}%</span>
                                </div>
                            </div>
                            <div className="mt-4 h-2 w-full bg-secondary/30 rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${student.attendance}%` }}></div>
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
                                    <div className="text-4xl font-bold text-accent">{student.performance}</div>
                                    <p className="text-xs text-muted-foreground mt-1">Based on recent exams</p>
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
                                <li className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                                    Attendance History
                                </li>
                                <li className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                                    View Reports
                                </li>
                                <li className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                                    Class Schedule
                                </li>
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
                                <li className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/50"></span>
                                    Request Leave
                                </li>
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
