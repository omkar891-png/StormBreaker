"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Search, Plus, Filter, MoreHorizontal, FileDown, RefreshCw } from "lucide-react"

interface Student {
    id: number
    full_name: string
    roll_number: string
    department: string
    year: string
    profile_picture: string | null
}

export default function StudentsListPage() {
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    const fetchStudents = async () => {
        setLoading(true)
        const token = localStorage.getItem("token")
        if (!token) return

        try {
            const res = await fetch('/api/students/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (res.ok) {
                const data = await res.json()
                setStudents(data)
            }
        } catch (error) {
            console.error("Error fetching students:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStudents()
    }, [])

    const filteredStudents = students.filter(s =>
        s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.roll_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.department.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <main className="p-8 space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Students Directory</h1>
                    <p className="text-muted-foreground">Manage student enrollments and records.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" size="icon" onClick={fetchStudents} disabled={loading} className="rounded-full">
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button className="glow-primary-hover gap-2" asChild>
                        <Link href="/admin/students/add">
                            <Plus className="h-4 w-4" /> Add New Students
                        </Link>
                    </Button>
                </div>
            </div>

            <Card className="glass-dark border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="flex items-center gap-2 flex-1">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by name, roll number or department..."
                                className="pl-9 bg-background/50 border-white/10 focus:border-primary/50"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="icon" className="border-white/10 text-muted-foreground hover:text-foreground">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader className="bg-white/5">
                            <TableRow className="border-white/10 hover:bg-white/5">
                                <TableHead className="w-[80px]">Image</TableHead>
                                <TableHead>Student Name</TableHead>
                                <TableHead>Student ID</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Year</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                        Loading students...
                                    </TableCell>
                                </TableRow>
                            ) : filteredStudents.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                        No students found.
                                    </TableCell>
                                </TableRow>
                            ) : filteredStudents.map((student) => (
                                <TableRow key={student.id} className="border-white/10 hover:bg-white/5 transition-colors group">
                                    <TableCell>
                                        <Avatar className="h-9 w-9 border border-white/10">
                                            <AvatarImage src={`http://localhost:8000${student.profile_picture}`} />
                                            <AvatarFallback className="text-xs">{student.full_name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium text-foreground">{student.full_name}</TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground">{student.roll_number}</TableCell>
                                    <TableCell>{student.department}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                            {student.year}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                            <MoreHorizontal className="h-4 w-4" />
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

