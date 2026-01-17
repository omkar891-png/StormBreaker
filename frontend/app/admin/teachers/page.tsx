"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Search, Plus, Filter, MoreHorizontal, Mail, Phone, RefreshCw } from "lucide-react"

interface Teacher {
    id: number
    full_name: string
    department: string
    phone: string
    subjects: string
    user?: {
        email: string
    }
}

export default function TeachersListPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    const fetchTeachers = async () => {
        setLoading(true)
        const token = localStorage.getItem("token")
        if (!token) return

        try {
            const res = await fetch('/api/admin/teachers', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (res.ok) {
                const data = await res.json()
                setTeachers(data)
            }
        } catch (error) {
            console.error("Error fetching teachers:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTeachers()
    }, [])

    const filteredTeachers = teachers.filter(t =>
        t.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.user?.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <main className="p-8 space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Teachers Directory</h1>
                    <p className="text-muted-foreground">Manage faculty members and assignments.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" size="icon" onClick={fetchTeachers} disabled={loading} className="rounded-full">
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button className="glow-primary-hover gap-2" asChild>
                        <Link href="/admin/teachers/add">
                            <Plus className="h-4 w-4" /> Add New Teacher
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
                                placeholder="Search by name, email or department..."
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
                                <TableHead>Teacher Name</TableHead>
                                <TableHead>Contact Info</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Assigned Subjects</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                        Loading teachers...
                                    </TableCell>
                                </TableRow>
                            ) : filteredTeachers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                        No teachers found.
                                    </TableCell>
                                </TableRow>
                            ) : filteredTeachers.map((teacher) => (
                                <TableRow key={teacher.id} className="border-white/10 hover:bg-white/5 transition-colors group">
                                    <TableCell>
                                        <Avatar className="h-9 w-9 border border-white/10">
                                            <AvatarFallback className="text-xs">{teacher.full_name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-foreground">{teacher.full_name}</div>
                                        <div className="font-mono text-xs text-muted-foreground">ID: {teacher.id}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Mail className="h-3 w-3" /> {teacher.user?.email || "N/A"}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Phone className="h-3 w-3" /> {teacher.phone}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{teacher.department}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {teacher.subjects ? teacher.subjects.split(',').map((sub, j) => (
                                                <span key={j} className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                                    {sub.trim()}
                                                </span>
                                            )) : <span className="text-xs text-muted-foreground">None</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-500/10 text-green-500 ring-1 ring-inset ring-green-500/20">
                                            Active
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

