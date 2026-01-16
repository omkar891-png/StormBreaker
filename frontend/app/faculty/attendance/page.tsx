"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Search, Users, Eye, ArrowRight } from "lucide-react"

const MOCK_HISTORY = [
    { id: "LEC-101", subject: "Data Structures", class: "SY-CS-A", date: "2024-03-14", time: "10:00 AM", students: 58, status: "Completed", avg: "88%" },
    { id: "LEC-102", subject: "Algorithms", class: "SY-CS-A", date: "2024-03-12", time: "02:00 PM", students: 55, status: "Completed", avg: "82%" },
    { id: "LEC-103", subject: "Data Structures", class: "SY-CS-A", date: "2024-03-10", time: "10:00 AM", students: 60, status: "Completed", avg: "95%" },
    { id: "LEC-104", subject: "DBMS", class: "TY-IT-B", date: "2024-03-09", time: "11:00 AM", students: 42, status: "Completed", avg: "75%" },
    { id: "LEC-105", subject: "Operating Systems", class: "TY-CS-A", date: "2024-03-08", time: "09:00 AM", students: 0, status: "Cancelled", avg: "-" },
]

export default function FacultyAttendanceHistory() {
    const [history, setHistory] = React.useState(MOCK_HISTORY)
    const [searchTerm, setSearchTerm] = React.useState("")

    const filteredHistory = history.filter(h =>
        h.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.class.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="flex flex-col gap-6 animate-fade-in max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Attendance History</h1>
                    <p className="text-muted-foreground mt-1">Review past lectures and attendance records.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Select defaultValue="this-month">
                        <SelectTrigger className="w-[140px] bg-secondary/50 border-white/10">
                            <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="this-month">This Month</SelectItem>
                            <SelectItem value="last-month">Last Month</SelectItem>
                            <SelectItem value="all">All Time</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card className="glass-dark border-primary/10">
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <CardTitle>Session Logs</CardTitle>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search subject or class..."
                                className="pl-9 bg-secondary/50 border-white/10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-white/5 border-white/10">
                                <TableHead className="text-indigo-400">Date & Time</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead className="text-center">Students</TableHead>
                                <TableHead className="text-center">Attendance %</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredHistory.map((session) => (
                                <TableRow key={session.id} className="hover:bg-white/5 border-white/10">
                                    <TableCell>
                                        <div className="flex flex-col text-sm">
                                            <span className="font-medium">{session.date}</span>
                                            <span className="text-muted-foreground text-xs">{session.time}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{session.subject}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="border-white/20 bg-white/5 font-mono">
                                            {session.class}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">{session.students}</TableCell>
                                    <TableCell className="text-center">
                                        <span className={`font-bold ${parseInt(session.avg) >= 75 ? 'text-green-500' :
                                                parseInt(session.avg) >= 50 ? 'text-yellow-500' :
                                                    session.status === 'Cancelled' ? 'text-muted-foreground' : 'text-red-500'
                                            }`}>
                                            {session.avg}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={session.status === 'Completed' ? 'default' : 'destructive'}
                                            className={session.status === 'Completed' ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}>
                                            {session.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
