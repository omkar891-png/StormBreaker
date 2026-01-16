"use client"

import * as React from "react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Badge } from "../../../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Plus, BookOpen, Layers, Users, ArrowRight } from "lucide-react"

export default function AcademicPage() {
    return (
        <main className="p-8 space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Academic Structure</h1>
                    <p className="text-muted-foreground">Manage classes, subjects, and curriculum hierarchy.</p>
                </div>
            </div>

            <Tabs defaultValue="classes" className="space-y-6">
                <TabsList className="bg-white/5 border border-white/10 p-1">
                    <TabsTrigger value="classes" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Users className="h-4 w-4" /> Classes & Divisions
                    </TabsTrigger>
                    <TabsTrigger value="subjects" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <BookOpen className="h-4 w-4" /> Subjects Library
                    </TabsTrigger>
                    <TabsTrigger value="structure" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Layers className="h-4 w-4" /> Curriculum Mapping
                    </TabsTrigger>
                </TabsList>

                {/* CLASSES TAB */}
                <TabsContent value="classes" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Create Class Form */}
                        <Card className="glass-dark border-primary/20 h-fit">
                            <CardHeader>
                                <CardTitle>Create New Class</CardTitle>
                                <CardDescription>Define a new class division.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <span className="text-xs font-medium">Department</span>
                                    <Select>
                                        <SelectTrigger className="bg-background/50 border-white/10"><SelectValue placeholder="Select Dept" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CS">Computer Science</SelectItem>
                                            <SelectItem value="IT">IT</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-xs font-medium">Year</span>
                                    <Select>
                                        <SelectTrigger className="bg-background/50 border-white/10"><SelectValue placeholder="Select Year" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="FY">First Year</SelectItem>
                                            <SelectItem value="SY">Second Year</SelectItem>
                                            <SelectItem value="TY">Third Year</SelectItem>
                                            <SelectItem value="BE">Final Year</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-xs font-medium">Division</span>
                                    <Input placeholder="e.g. A, B, C" className="bg-background/50 border-white/10" />
                                </div>
                                <Button className="w-full glow-primary-hover">Create Class</Button>
                            </CardContent>
                        </Card>

                        {/* Class List */}
                        <Card className="glass-dark border-primary/20 md:col-span-2">
                            <CardHeader>
                                <CardTitle>Existing Classes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader className="bg-white/5">
                                        <TableRow className="border-white/10 hover:bg-white/5">
                                            <TableHead>Class Name</TableHead>
                                            <TableHead>Department</TableHead>
                                            <TableHead>Students</TableHead>
                                            <TableHead>Class Teacher</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {[
                                            { name: "SY-CS-A", dept: "Comp. Sci", students: 64, teacher: "Prof. Alan" },
                                            { name: "SY-CS-B", dept: "Comp. Sci", students: 62, teacher: "Prof. Smith" },
                                            { name: "TY-IT-A", dept: "Info Tech", students: 58, teacher: "Prof. Grace" },
                                        ].map((cls, i) => (
                                            <TableRow key={i} className="border-white/10 hover:bg-white/5 transition-colors">
                                                <TableCell className="font-bold">{cls.name}</TableCell>
                                                <TableCell>{cls.dept}</TableCell>
                                                <TableCell>{cls.students}</TableCell>
                                                <TableCell className="text-muted-foreground text-xs">{cls.teacher}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" className="h-8">Manage</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* SUBJECTS TAB */}
                <TabsContent value="subjects" className="space-y-6">
                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-lg border border-white/10">
                        <div className="flex gap-4 items-center">
                            <Input placeholder="Search subjects..." className="w-[300px] bg-background/50 border-white/10" />
                            <Select>
                                <SelectTrigger className="w-[180px] bg-background/50 border-white/10">
                                    <SelectValue placeholder="All Departments" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Departments</SelectItem>
                                    <SelectItem value="cs">Computer Science</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button className="glow-primary-hover gap-2">
                            <Plus className="h-4 w-4" /> Add Subject
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { name: "Data Structures", code: "CS-201", type: "Core", credits: 4 },
                            { name: "Database Management", code: "CS-202", type: "Core", credits: 4 },
                            { name: "Software Engineering", code: "CS-203", type: "Theory", credits: 3 },
                            { name: "Computer Networks", code: "IT-301", type: "Core", credits: 4 },
                            { name: "Machine Learning", code: "CS-401", type: "Elective", credits: 3 },
                        ].map((sub, i) => (
                            <Card key={i} className="glass-dark border-primary/20 hover:border-primary/50 transition-colors cursor-pointer group">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">{sub.code}</Badge>
                                        <Badge variant="secondary" className="bg-white/10">{sub.type}</Badge>
                                    </div>
                                    <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">{sub.name}</h3>
                                    <p className="text-sm text-muted-foreground">{sub.credits} Credits</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* STRUCTURE TAB */}
                <TabsContent value="structure" className="space-y-6">
                    <Card className="glass-dark border-primary/20">
                        <CardHeader>
                            <CardTitle>Class-Subject Mapping</CardTitle>
                            <CardDescription>Assign subjects and teachers to classes.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    { class: "SY-CS-A", subjects: ["Data Structures (Prof. Alan)", "DBMS (Prof. Smith)", "Maths (Prof. Nash)"] },
                                    { class: "SY-CS-B", subjects: ["Data Structures (Prof. Alan)", "DBMS (Prof. Taylor)", "Maths (Prof. Nash)"] },
                                ].map((mapping, i) => (
                                    <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="bg-primary/20 p-2 rounded text-primary font-bold">{mapping.class}</div>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                            <div className="text-sm text-muted-foreground">3 Subjects Assigned</div>
                                            <Button variant="ghost" size="sm" className="ml-auto text-xs">Edit Mapping</Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {mapping.subjects.map((sub, j) => (
                                                <Badge key={j} variant="outline" className="border-white/10 bg-black/20 text-muted-foreground py-1.5">
                                                    {sub}
                                                </Badge>
                                            ))}
                                            <button className="text-xs flex items-center gap-1 px-3 py-1 rounded-full border border-dashed border-white/20 hover:bg-white/5 text-muted-foreground transition-colors">
                                                <Plus className="h-3 w-3" /> Add
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </main>
    )
}
