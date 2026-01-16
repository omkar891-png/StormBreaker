"use client"

import Link from "next/link"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Search, Plus, Filter, MoreHorizontal, FileDown } from "lucide-react"


export default function StudentsListPage() {
    return (
        <main className="p-8 space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Students Directory</h1>
                    <p className="text-muted-foreground">Manage student enrollments and records.</p>
                </div>
                <Button className="glow-primary-hover gap-2" asChild>
                    <Link href="/admin/students/add">
                        <Plus className="h-4 w-4" /> Add New Students
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
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2 border-white/10 text-xs">
                            <FileDown className="h-4 w-4" /> Export CSV
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
                            {[
                                { name: "Alex Doe", id: "STU-2024-001", dept: "Computer Science", year: "2nd Year", img: "/avatars/01.png" },
                                { name: "John Smith", id: "STU-2024-002", dept: "Information Tech", year: "1st Year", img: "/avatars/02.png" },
                                { name: "Sarah Connor", id: "STU-2024-005", dept: "AI & ML", year: "3rd Year", img: "/avatars/03.png" },
                                { name: "Mike Ross", id: "STU-2024-012", dept: "Legal Tech", year: "Final Year", img: "AD" },
                            ].map((student, i) => (
                                <TableRow key={i} className="border-white/10 hover:bg-white/5 transition-colors group">
                                    <TableCell>
                                        <Avatar className="h-9 w-9 border border-white/10">
                                            <AvatarImage src={student.img} />
                                            <AvatarFallback className="text-xs">{student.img.length <= 2 ? student.img : "ST"}</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium text-foreground">{student.name}</TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground">{student.id}</TableCell>
                                    <TableCell>{student.dept}</TableCell>
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
