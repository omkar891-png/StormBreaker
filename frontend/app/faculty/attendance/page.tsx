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
import { Calendar, Search, Users, Eye, ArrowRight, RefreshCw } from "lucide-react"


export default function FacultyAttendanceHistory() {
    const [history, setHistory] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(true)
    const [searchTerm, setSearchTerm] = React.useState("")

    const fetchHistory = async () => {
        setLoading(true)
        const token = localStorage.getItem("token")
        if (!token) return

        try {
            const headers = { 'Authorization': `Bearer ${token}` }
            const res = await fetch('/api/attendance/my?limit=100', { headers })
            if (res.ok) {
                setHistory(await res.json())
            }
        } catch (error) {
            console.error("Error fetching history:", error)
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        fetchHistory()
    }, [])

    const filteredHistory = history.filter(h =>
        h.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.student?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.student?.roll_number?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="flex flex-col gap-6 animate-fade-in max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Attendance Logs</h1>
                    <p className="text-muted-foreground mt-1">Review all recent attendance records for your subjects.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="icon" onClick={fetchHistory} disabled={loading} className="rounded-full">
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            <Card className="glass-dark border-primary/10">
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <CardTitle>Individual Records</CardTitle>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search subject, name or roll..."
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
                                <TableHead>Student Name</TableHead>
                                <TableHead>Roll Number</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead className="text-center">Confidence</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={6} className="text-center py-10">Loading records...</TableCell></TableRow>
                            ) : filteredHistory.length === 0 ? (
                                <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No records found.</TableCell></TableRow>
                            ) : filteredHistory.map((log) => (
                                <TableRow key={log.id} className="hover:bg-white/5 border-white/10">
                                    <TableCell>
                                        <div className="flex flex-col text-sm">
                                            <span className="font-medium">{new Date(log.timestamp).toLocaleDateString()}</span>
                                            <span className="text-muted-foreground text-xs">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{log.student?.full_name || "Unknown"}</TableCell>
                                    <TableCell className="font-mono text-xs">{log.student?.roll_number || "N/A"}</TableCell>
                                    <TableCell>{log.subject}</TableCell>
                                    <TableCell className="text-center font-mono text-xs">{log.verification_confidence}</TableCell>
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
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
