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
import { Play, Calendar, Users, Clock, CheckCircle, BarChart3 } from "lucide-react"

export default function FacultyDashboard() {
    const router = useRouter()

    // Mock State for "Create Live Lecture"
    const [lectureForm, setLectureForm] = React.useState({
        dept: "CS",
        classYear: "SY",
        div: "A",
        subject: "DS",
    })

    const handleStartLecture = () => {
        // Navigate to the live lecture page with query params (simulated)
        router.push(`/faculty/lecture/live?dept=${lectureForm.dept}&class=${lectureForm.classYear}&div=${lectureForm.div}&sub=${lectureForm.subject}`)
    }

    return (
        <main className="p-8 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome, Prof. Doe</h1>
                    <p className="text-muted-foreground">Manage your lectures and track student progress.</p>
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
                                <Select defaultValue={lectureForm.dept} onValueChange={(v) => setLectureForm({ ...lectureForm, dept: v })}>
                                    <SelectTrigger className="bg-background/50 border-white/10"><SelectValue placeholder="Select Dept" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CS">Computer Science</SelectItem>
                                        <SelectItem value="IT">Info Tech</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Class / Year</Label>
                                <Select defaultValue={lectureForm.classYear} onValueChange={(v) => setLectureForm({ ...lectureForm, classYear: v })}>
                                    <SelectTrigger className="bg-background/50 border-white/10"><SelectValue placeholder="Select Year" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="SY">Second Year</SelectItem>
                                        <SelectItem value="TY">Third Year</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Division</Label>
                                <Select defaultValue={lectureForm.div} onValueChange={(v) => setLectureForm({ ...lectureForm, div: v })}>
                                    <SelectTrigger className="bg-background/50 border-white/10"><SelectValue placeholder="Select Div" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="A">Div A</SelectItem>
                                        <SelectItem value="B">Div B</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Subject</Label>
                                <Select defaultValue={lectureForm.subject} onValueChange={(v) => setLectureForm({ ...lectureForm, subject: v })}>
                                    <SelectTrigger className="bg-background/50 border-white/10"><SelectValue placeholder="Select Subject" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DS">Data Structures</SelectItem>
                                        <SelectItem value="OS">Operating Systems</SelectItem>
                                        <SelectItem value="DBMS">Database Mgmt</SelectItem>
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
                            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Lectures</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">2 / 4</div>
                            <p className="text-xs text-muted-foreground mt-1">Completed 2 sessions today</p>
                        </CardContent>
                    </Card>
                    <Card className="glass-dark border-primary/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Attendance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-500">88%</div>
                            <p className="text-xs text-muted-foreground mt-1 text-green-400">+2% from last week</p>
                        </CardContent>
                    </Card>
                    <Card className="glass-dark border-primary/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Assignments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">12</div>
                            <button className="text-xs text-indigo-400 hover:underline mt-1">Review Submissions</button>
                        </CardContent>
                    </Card>
                </div>

            </div>

            {/* RECENT ACTIVITY / LOGS */}
            <Card className="glass-dark border-primary/20">
                <CardHeader>
                    <CardTitle>Recent Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader className="bg-white/5">
                            <TableRow className="border-white/10 hover:bg-white/5">
                                <TableHead>Subject</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Attendance</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[
                                { sub: "Operating Systems", class: "TY-IT-A", time: "11:00 AM - 12:00 PM", count: "54/60", status: "Completed" },
                                { sub: "Data Structures", class: "SY-CS-A", time: "09:00 AM - 10:00 AM", count: "58/65", status: "Completed" },
                            ].map((session, i) => (
                                <TableRow key={i} className="border-white/10 hover:bg-white/5">
                                    <TableCell className="font-medium">{session.sub}</TableCell>
                                    <TableCell>{session.class}</TableCell>
                                    <TableCell>{session.time}</TableCell>
                                    <TableCell>{session.count}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">{session.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">View Report</Button>
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
