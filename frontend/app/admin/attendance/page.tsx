"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Search, Filter, Download, Calendar as CalendarIcon, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

export default function AttendancePage() {
    const [view, setView] = React.useState<"daily" | "defaulters">("daily")

    return (
        <main className="p-8 space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Attendance Monitoring</h1>
                    <p className="text-muted-foreground">Track daily attendance and identify defaulters.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant={view === "daily" ? "default" : "outline"}
                        onClick={() => setView("daily")}
                        className="gap-2"
                    >
                        <CalendarIcon className="h-4 w-4" /> Daily View
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
                    <div className="space-y-2 w-[180px]">
                        <span className="text-xs font-medium">Department</span>
                        <Select defaultValue="CS">
                            <SelectTrigger className="bg-background/50 border-white/10">
                                <SelectValue placeholder="Select Dept" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CS">Computer Science</SelectItem>
                                <SelectItem value="IT">IT</SelectItem>
                                <SelectItem value="ME">Mechanical</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 w-[150px]">
                        <span className="text-xs font-medium">Class / Year</span>
                        <Select defaultValue="SY">
                            <SelectTrigger className="bg-background/50 border-white/10">
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="FY">First Year</SelectItem>
                                <SelectItem value="SY">Second Year</SelectItem>
                                <SelectItem value="TY">Third Year</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 w-[200px]">
                        <span className="text-xs font-medium">Subject</span>
                        <Select defaultValue="DS">
                            <SelectTrigger className="bg-background/50 border-white/10">
                                <SelectValue placeholder="Select Subject" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DS">Data Structures</SelectItem>
                                <SelectItem value="OS">Operating Systems</SelectItem>
                                <SelectItem value="DB">Database Management</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 w-[180px]">
                        <span className="text-xs font-medium">Date</span>
                        <Input type="date" className="bg-background/50 border-white/10" />
                    </div>

                    <Button variant="secondary" className="ml-auto glow-primary-hover gap-2">
                        <Download className="h-4 w-4" /> Export Report
                    </Button>
                </CardContent>
            </Card>

            {/* Stats Overview (Daily View Only) */}
            {view === "daily" && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="glass-dark border-primary/20 bg-green-500/5">
                        <CardContent className="p-6 text-center">
                            <p className="text-sm font-medium text-muted-foreground">Present</p>
                            <p className="text-3xl font-bold text-green-500">58</p>
                        </CardContent>
                    </Card>
                    <Card className="glass-dark border-primary/20 bg-red-500/5">
                        <CardContent className="p-6 text-center">
                            <p className="text-sm font-medium text-muted-foreground">Absent</p>
                            <p className="text-3xl font-bold text-red-500">12</p>
                        </CardContent>
                    </Card>
                    <Card className="glass-dark border-primary/20">
                        <CardContent className="p-6 text-center">
                            <p className="text-sm font-medium text-muted-foreground">Total Strength</p>
                            <p className="text-3xl font-bold">70</p>
                        </CardContent>
                    </Card>
                    <Card className="glass-dark border-primary/20">
                        <CardContent className="p-6 text-center">
                            <p className="text-sm font-medium text-muted-foreground">Attendance %</p>
                            <p className="text-3xl font-bold text-primary">82.8%</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Attendance Table */}
            <Card className="glass-dark border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>{view === "daily" ? "Daily Attendance Records" : "Defaulters List (<75%)"}</span>
                        {view === "daily" && (
                            <div className="relative w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search student..." className="pl-8 h-9 bg-background/50 border-white/10" />
                            </div>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader className="bg-white/5">
                            <TableRow className="border-white/10 hover:bg-white/5">
                                <TableHead className="w-[60px]">Img</TableHead>
                                <TableHead>Student Name</TableHead>
                                <TableHead>Student ID</TableHead>
                                {view === "daily" ? (
                                    <>
                                        <TableHead>Time In</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </>
                                ) : (
                                    <>
                                        <TableHead>Total Lectures</TableHead>
                                        <TableHead>Attended</TableHead>
                                        <TableHead>Percent</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Mock Data based on View */}
                            {view === "daily" ? (
                                // DAILY VIEW MOCK
                                [
                                    { name: "Alex Doe", id: "CS-2024-001", time: "09:55 AM", status: "Present", img: "/avatars/01.png" },
                                    { name: "John Smith", id: "CS-2024-002", time: "10:05 AM", status: "Late", img: "/avatars/02.png" },
                                    { name: "Sarah Connor", id: "CS-2024-005", time: "-", status: "Absent", img: "/avatars/03.png" },
                                    { name: "Mike Ross", id: "CS-2024-012", time: "09:50 AM", status: "Present", img: "AD" },
                                ].map((stu, i) => (
                                    <TableRow key={i} className="border-white/10 hover:bg-white/5 transition-colors">
                                        <TableCell>
                                            <Avatar className="h-8 w-8 border border-white/10">
                                                <AvatarImage src={stu.img} />
                                                <AvatarFallback>S</AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="font-medium">{stu.name}</TableCell>
                                        <TableCell className="font-mono text-xs text-muted-foreground">{stu.id}</TableCell>
                                        <TableCell className="font-mono text-xs">{stu.time}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${stu.status === 'Present' ? "bg-green-500/10 text-green-500" :
                                                    stu.status === 'Late' ? "bg-yellow-500/10 text-yellow-500" :
                                                        "bg-red-500/10 text-red-500"
                                                }`}>
                                                {stu.status === 'Present' && <CheckCircle className="h-3 w-3" />}
                                                {stu.status === 'Absent' && <XCircle className="h-3 w-3" />}
                                                {stu.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" className="h-8 text-xs">Edit</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                // DEFAULTERS LIST MOCK
                                [
                                    { name: "Sarah Connor", id: "CS-2024-005", total: 45, attended: 20, pct: 44, img: "/avatars/03.png" },
                                    { name: "Tom Riddle", id: "CS-2024-099", total: 45, attended: 15, pct: 33, img: "/avatars/04.png" },
                                ].map((stu, i) => (
                                    <TableRow key={i} className="border-white/10 hover:bg-white/5 transition-colors">
                                        <TableCell>
                                            <Avatar className="h-8 w-8 border border-white/10">
                                                <AvatarImage src={stu.img} />
                                                <AvatarFallback>S</AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="font-medium">{stu.name}</TableCell>
                                        <TableCell className="font-mono text-xs text-muted-foreground">{stu.id}</TableCell>
                                        <TableCell>{stu.total}</TableCell>
                                        <TableCell>{stu.attended}</TableCell>
                                        <TableCell>
                                            <span className="font-bold text-red-500">{stu.pct}%</span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="destructive" size="sm" className="h-8 text-xs gap-2">
                                                <AlertTriangle className="h-3 w-3" /> Send Warning
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </main>
    )
}
