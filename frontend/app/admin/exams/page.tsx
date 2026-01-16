"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Calendar, Clock, FileText, Search, MoreHorizontal, TrendingUp } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function ExamsPage() {
    const [exams, setExams] = React.useState([
        { id: "EX-001", name: "Data Structures Mid-Term", type: "Mid-Term", subject: "Data Structures", date: "2024-03-15", time: "10:00 AM", status: "Scheduled", class: "SY-CS-A" },
        { id: "EX-002", name: "Database Management Final", type: "Final", subject: "DBMS", date: "2024-04-20", time: "02:00 PM", status: "Draft", class: "TY-CS-B" },
        { id: "EX-003", name: "Algorithms Quiz 1", type: "Quiz", subject: "Algorithms", date: "2024-02-10", time: "11:00 AM", status: "Completed", class: "SY-CS-A" },
    ])

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">Exam Management</h1>
                    <p className="text-muted-foreground mt-1">Schedule exams, manage papers, and publish results.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Calendar className="h-4 w-4" /> Calendar View
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90 gap-2">
                        <Plus className="h-4 w-4" /> Schedule Exam
                    </Button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="glass-dark border-primary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Exams</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24</div>
                        <p className="text-xs text-muted-foreground mt-1 text-green-500 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" /> +4 this month
                        </p>
                    </CardContent>
                </Card>
                <Card className="glass-dark border-primary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-indigo-400">8</div>
                        <p className="text-xs text-muted-foreground mt-1">Next: Mar 15</p>
                    </CardContent>
                </Card>
                <Card className="glass-dark border-primary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">3</div>
                        <p className="text-xs text-muted-foreground mt-1">Action required</p>
                    </CardContent>
                </Card>
                <Card className="glass-dark border-primary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">76%</div>
                        <p className="text-xs text-muted-foreground mt-1">Last semester</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="glass-dark border-primary/10">
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <CardTitle>Exam Schedule</CardTitle>
                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search exams..." className="pl-9 bg-secondary/50 border-white/10" />
                            </div>
                            <Select defaultValue="all">
                                <SelectTrigger className="w-[130px] bg-secondary/50 border-white/10">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="scheduled">Scheduled</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-white/5 border-white/10">
                                <TableHead className="text-primary">Exam Name</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Date & Time</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {exams.map((exam) => (
                                <TableRow key={exam.id} className="hover:bg-white/5 border-white/10">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{exam.name}</span>
                                            <span className="text-xs text-muted-foreground">{exam.type}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{exam.subject}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="border-white/20 bg-white/5">
                                            {exam.class}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {exam.date}</span>
                                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {exam.time}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={`
                                            ${exam.status === 'Scheduled' ? 'bg-indigo-500/20 text-indigo-400' :
                                                exam.status === 'Completed' ? 'bg-green-500/20 text-green-500' :
                                                    'bg-yellow-500/20 text-yellow-500'}
                                        `}>
                                            {exam.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="hover:bg-white/10 text-muted-foreground hover:text-white">
                                            <MoreHorizontal className="h-4 w-4" />
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
