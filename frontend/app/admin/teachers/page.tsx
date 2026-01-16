"use client"

import Link from "next/link"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Search, Plus, Filter, MoreHorizontal, FileDown, Mail, Phone } from "lucide-react"

export default function TeachersListPage() {
    return (
        <main className="p-8 space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Teachers Directory</h1>
                    <p className="text-muted-foreground">Manage faculty members and assignments.</p>
                </div>
                <Button className="glow-primary-hover gap-2" asChild>
                    <Link href="/admin/teachers/add">
                        <Plus className="h-4 w-4" /> Add New Teacher
                    </Link>
                </Button>
            </div>

            <Card className="glass-dark border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="flex items-center gap-2 flex-1">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by name, ID or department..."
                                className="pl-9 bg-background/50 border-white/10 focus:border-primary/50"
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
                            {[
                                {
                                    name: "Prof. Alan Turing",
                                    id: "FAC-001",
                                    dept: "Computer Science",
                                    email: "alan.t@univ.edu",
                                    phone: "+1 234 567 890",
                                    subjects: ["Data Structures", "Algorithms"],
                                    status: "Active",
                                    img: "/avatars/t1.png"
                                },
                                {
                                    name: "Dr. Grace Hopper",
                                    id: "FAC-002",
                                    dept: "Information Tech",
                                    email: "grace.h@univ.edu",
                                    phone: "+1 987 654 321",
                                    subjects: ["Compiler Design"],
                                    status: "Active",
                                    img: "/avatars/t2.png"
                                },
                                {
                                    name: "Prof. Richard Feynman",
                                    id: "FAC-003",
                                    dept: "Physics",
                                    email: "richard.f@univ.edu",
                                    phone: "+1 555 123 456",
                                    subjects: ["Quantum Mechanics", "Physics I"],
                                    status: "On Leave",
                                    img: "/avatars/t3.png"
                                },
                            ].map((teacher, i) => (
                                <TableRow key={i} className="border-white/10 hover:bg-white/5 transition-colors group">
                                    <TableCell>
                                        <Avatar className="h-9 w-9 border border-white/10">
                                            <AvatarImage src={teacher.img} />
                                            <AvatarFallback className="text-xs">T</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-foreground">{teacher.name}</div>
                                        <div className="font-mono text-xs text-muted-foreground">{teacher.id}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Mail className="h-3 w-3" /> {teacher.email}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Phone className="h-3 w-3" /> {teacher.phone}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{teacher.dept}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {teacher.subjects.map((sub, j) => (
                                                <span key={j} className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                                    {sub}
                                                </span>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${teacher.status === 'Active'
                                            ? "bg-green-500/10 text-green-500 ring-1 ring-inset ring-green-500/20"
                                            : "bg-yellow-500/10 text-yellow-500 ring-1 ring-inset ring-yellow-500/20"
                                            }`}>
                                            {teacher.status}
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
