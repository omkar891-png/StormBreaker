"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Search, Filter, Download, Calendar as CalendarIcon, AlertTriangle, CheckCircle, XCircle, RefreshCw } from "lucide-react"

interface AttendanceRecord {
    id: number
    timestamp: string
    status: string
    subject: string
    verification_confidence: string
    student: {
        id: number
        full_name: string
        roll_number: string
        profile_picture: string | null
    }
}

interface Defaulter {
    student_id: number
    name: string
    roll_number: string
    attendance_count: number
}

export default function AttendancePage() {
    const [view, setView] = React.useState<"daily" | "defaulters" | "all">("daily")
    const [records, setRecords] = React.useState<AttendanceRecord[]>([])
    const [allRecords, setAllRecords] = React.useState<AttendanceRecord[]>([])
    const [defaulters, setDefaulters] = React.useState<Defaulter[]>([])
    const [loading, setLoading] = React.useState(true)
    const [searchQuery, setSearchQuery] = React.useState("")

    const fetchData = async () => {
        setLoading(true)
        const token = localStorage.getItem("token")
        if (!token) {
            setLoading(false)
            return
        }

        try {
            const headers = { 'Authorization': `Bearer ${token}` }
            if (view === "daily") {
                const res = await fetch('/api/attendance/?limit=100', { headers })
                if (res.ok) setRecords(await res.json())
                else setRecords([])
            } else if (view === "all") {
                const res = await fetch('/api/attendance/?limit=500', { headers })
                if (res.ok) setAllRecords(await res.json())
                else setAllRecords([])
            } else {
                const res = await fetch('/api/reports/defaulters', { headers })
                if (res.ok) setDefaulters(await res.json())
                else setDefaulters([])
            }
        } catch (error) {
            console.error("Error fetching attendance data:", error)
            if (view === "daily") setRecords([])
            else if (view === "all") setAllRecords([])
            else setDefaulters([])
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        fetchData()
    }, [view])

    const displayRecords = view === "daily" ? records : allRecords

    const filteredRecords = displayRecords.filter(r =>
        r.student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.student.roll_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.subject.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <main className="p-8 space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Attendance Monitoring</h1>
                    <p className="text-muted-foreground">Track daily attendance and identify defaulters.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={fetchData} disabled={loading} className="rounded-full mr-2">
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button
                        variant={view === "daily" ? "default" : "outline"}
                        onClick={() => setView("daily")}
                        className="gap-2"
                    >
                        <CalendarIcon className="h-4 w-4" /> Daily View
                    </Button>
                    <Button
                        variant={view === "all" ? "default" : "outline"}
                        onClick={() => setView("all")}
                        className="gap-2"
                    >
                        <Search className="h-4 w-4" /> All Records
                    </Button>
                    <Button
                        variant={view === "defaulters" ? "destructive" : "outline"}
                        onClick={() => setView("defaulters")}
                        className="gap-2"
                    >
                        <AlertTriangle className="h-4 w-4" /> Defaulters List
                    </Button>
                </div>
            </div>

            {/* Filters Bar */}
            <Card className="glass-dark border-primary/20">
                <CardContent className="p-4 flex flex-wrap gap-4 items-end">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Quick Search (Name, ID, Subject)..."
                            className="pl-9 bg-background/50 border-white/10 focus:border-primary/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2 w-[180px]">
                        <span className="text-xs font-medium">Department</span>
                        <Select defaultValue="ALL">
                            <SelectTrigger className="bg-background/50 border-white/10">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Departments</SelectItem>
                                <SelectItem value="CS">Computer Science</SelectItem>
                                <SelectItem value="IT">IT</SelectItem>
                                <SelectItem value="ME">Mechanical Engineering</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button variant="secondary" className="ml-auto glow-primary-hover gap-2">
                        <Download className="h-4 w-4" /> Export Report
                    </Button>
                </CardContent>
            </Card>

            {/* Attendance Table */}
            <Card className="glass-dark border-primary/20">
                <CardHeader>
                    <CardTitle>
                        {view === "daily" ? "Daily Attendance Records" : view === "all" ? "All Attendance Records" : "Defaulters List"}
                    </CardTitle>
                    <CardDescription>
                        {view === "daily" ? "Real-time log of student check-ins." : view === "all" ? "Complete history of all attendance logs." : "Students with attendance below 75% threshold."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader className="bg-white/5">
                            <TableRow className="border-white/10 hover:bg-white/5">
                                <TableHead className="w-[60px]">Img</TableHead>
                                <TableHead>Student Name</TableHead>
                                <TableHead>Roll Number</TableHead>
                                {view !== "defaulters" ? (
                                    <>
                                        <TableHead>Date & Time</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Confidence</TableHead>
                                        <TableHead>Status</TableHead>
                                    </>
                                ) : (
                                    <>
                                        <TableHead>Attendance Count</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={8} className="text-center py-10">Loading...</TableCell></TableRow>
                            ) : (view === "daily" || view === "all" ? (
                                filteredRecords.length === 0 ? (
                                    <TableRow><TableCell colSpan={8} className="text-center py-10 text-muted-foreground">No records found.</TableCell></TableRow>
                                ) : filteredRecords.map((stu) => (
                                    <TableRow key={stu.id} className="border-white/10 hover:bg-white/5 transition-colors">
                                        <TableCell>
                                            <Avatar className="h-8 w-8 border border-white/10">
                                                <AvatarImage src={`http://localhost:8000${stu.student.profile_picture}`} />
                                                <AvatarFallback>{stu.student.full_name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="font-medium">{stu.student.full_name}</TableCell>
                                        <TableCell className="font-mono text-xs text-muted-foreground">{stu.student.roll_number}</TableCell>
                                        <TableCell className="font-mono text-xs text-primary">
                                            {view === "daily" ? new Date(stu.timestamp).toLocaleTimeString() : new Date(stu.timestamp).toLocaleString()}
                                        </TableCell>
                                        <TableCell>{stu.subject}</TableCell>
                                        <TableCell className="text-xs">{stu.verification_confidence}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-green-500/10 text-green-500">
                                                <CheckCircle className="h-3 w-3" />
                                                {stu.status}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                defaulters.length === 0 ? (
                                    <TableRow><TableCell colSpan={8} className="text-center py-10 text-muted-foreground">No defaulters identified.</TableCell></TableRow>
                                ) : defaulters.map((stu, i) => (
                                    <TableRow key={i} className="border-white/10 hover:bg-white/5 transition-colors">
                                        <TableCell>
                                            <Avatar className="h-8 w-8 border border-white/10">
                                                <AvatarFallback>{stu.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="font-medium">{stu.name}</TableCell>
                                        <TableCell className="font-mono text-xs text-muted-foreground">{stu.roll_number}</TableCell>
                                        <TableCell className="text-red-400 font-bold">{stu.attendance_count} records</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="destructive" size="sm" className="h-8 text-xs gap-2">
                                                <AlertTriangle className="h-3 w-3" /> Send Warning
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </main>
    )
}
