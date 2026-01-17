"use client"

import * as React from "react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Badge } from "../../../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Plus, BookOpen, Layers, Users, ArrowRight, RefreshCw, Loader2 } from "lucide-react"

interface Subject {
    id: number
    name: string
    code: string
    department: string
    type: string
    credits: number
}

interface ClassGroup {
    id: number
    name: string
    department: string
    year: string
    division: string
}

export default function AcademicPage() {
    const [subjects, setSubjects] = React.useState<Subject[]>([])
    const [classes, setClasses] = React.useState<ClassGroup[]>([])
    const [loading, setLoading] = React.useState(true)
    const [creating, setCreating] = React.useState(false)

    // Form States
    const [newClass, setNewClass] = React.useState({
        department: "CS",
        year: "SY",
        division: ""
    })

    const [newSubject, setNewSubject] = React.useState({
        name: "",
        code: "",
        department: "CS",
        type: "Core",
        credits: 4
    })

    const fetchData = async () => {
        setLoading(true)
        const token = localStorage.getItem("token")
        if (!token) return

        try {
            const headers = { 'Authorization': `Bearer ${token}` }
            const [subRes, clsRes] = await Promise.all([
                fetch('/api/admin/subjects', { headers }),
                fetch('/api/admin/classes', { headers })
            ])

            if (subRes.ok) setSubjects(await subRes.json())
            if (clsRes.ok) setClasses(await clsRes.json())
        } catch (error) {
            console.error("Error fetching academic data:", error)
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        fetchData()
    }, [])

    const handleCreateClass = async () => {
        const token = localStorage.getItem("token")
        if (!token) return
        setCreating(true)

        try {
            const res = await fetch('/api/admin/classes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: `${newClass.year}-${newClass.department}-${newClass.division}`,
                    department: newClass.department,
                    year: newClass.year,
                    division: newClass.division
                })
            })

            if (res.ok) {
                fetchData()
                setNewClass({ ...newClass, division: "" })
            }
        } catch (error) {
            console.error("Error creating class:", error)
        } finally {
            setCreating(false)
        }
    }

    const handleCreateSubject = async () => {
        const token = localStorage.getItem("token")
        if (!token) return
        setCreating(true)

        try {
            const res = await fetch('/api/admin/subjects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newSubject)
            })

            if (res.ok) {
                fetchData()
                setNewSubject({ name: "", code: "", department: "CS", type: "Core", credits: 4 })
            }
        } catch (error) {
            console.error("Error creating subject:", error)
        } finally {
            setCreating(false)
        }
    }

    return (
        <main className="p-8 space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Academic Structure</h1>
                    <p className="text-muted-foreground">Manage classes, subjects, and curriculum hierarchy.</p>
                </div>
                <Button variant="outline" size="icon" onClick={fetchData} disabled={loading} className="rounded-full">
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            <Tabs defaultValue="classes" className="space-y-6">
                <TabsList className="bg-white/5 border border-white/10 p-1">
                    <TabsTrigger value="classes" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Users className="h-4 w-4" /> Classes & Divisions
                    </TabsTrigger>
                    <TabsTrigger value="subjects" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <BookOpen className="h-4 w-4" /> Subjects Library
                    </TabsTrigger>
                </TabsList>

                {/* CLASSES TAB */}
                <TabsContent value="classes" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="glass-dark border-primary/20 h-fit">
                            <CardHeader>
                                <CardTitle>Create New Class</CardTitle>
                                <CardDescription>Define a new class division.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <span className="text-xs font-medium">Department</span>
                                    <Select value={newClass.department} onValueChange={(v) => setNewClass({ ...newClass, department: v })}>
                                        <SelectTrigger className="bg-background/50 border-white/10"><SelectValue placeholder="Select Dept" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CS">Computer Science</SelectItem>
                                            <SelectItem value="IT">IT</SelectItem>
                                            <SelectItem value="ME">Mechanical Engineering</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-xs font-medium">Year</span>
                                    <Select value={newClass.year} onValueChange={(v) => setNewClass({ ...newClass, year: v })}>
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
                                    <Input
                                        placeholder="e.g. A, B, C"
                                        className="bg-background/50 border-white/10"
                                        value={newClass.division}
                                        onChange={(e) => setNewClass({ ...newClass, division: e.target.value })}
                                    />
                                </div>
                                <Button className="w-full glow-primary-hover" onClick={handleCreateClass} disabled={creating}>
                                    {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Class"}
                                </Button>
                            </CardContent>
                        </Card>

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
                                            <TableHead>Year</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow><TableCell colSpan={4} className="text-center py-4">Loading...</TableCell></TableRow>
                                        ) : classes.length === 0 ? (
                                            <TableRow><TableCell colSpan={4} className="text-center py-4 text-muted-foreground">No classes found.</TableCell></TableRow>
                                        ) : classes.map((cls) => (
                                            <TableRow key={cls.id} className="border-white/10 hover:bg-white/5 transition-colors">
                                                <TableCell className="font-bold">{cls.name}</TableCell>
                                                <TableCell>{cls.department}</TableCell>
                                                <TableCell>{cls.year}</TableCell>
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="glass-dark border-primary/20 h-fit">
                            <CardHeader>
                                <CardTitle>Add Subject</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <span className="text-xs font-medium">Name</span>
                                    <Input value={newSubject.name} onChange={e => setNewSubject({ ...newSubject, name: e.target.value })} placeholder="e.g. Data Structures" className="bg-background/50 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <span className="text-xs font-medium">Code</span>
                                    <Input value={newSubject.code} onChange={e => setNewSubject({ ...newSubject, code: e.target.value })} placeholder="e.g. CS201" className="bg-background/50 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <span className="text-xs font-medium">Type</span>
                                    <Select value={newSubject.type} onValueChange={v => setNewSubject({ ...newSubject, type: v })}>
                                        <SelectTrigger className="bg-background/50 border-white/10"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Core">Core</SelectItem>
                                            <SelectItem value="Theory">Theory</SelectItem>
                                            <SelectItem value="Lab">Lab</SelectItem>
                                            <SelectItem value="Elective">Elective</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button className="w-full glow-primary-hover" onClick={handleCreateSubject} disabled={creating}>
                                    {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Subject"}
                                </Button>
                            </CardContent>
                        </Card>

                        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {loading ? (
                                <div className="col-span-full text-center py-10">Loading subjects...</div>
                            ) : subjects.length === 0 ? (
                                <div className="col-span-full text-center py-10 text-muted-foreground">No subjects found.</div>
                            ) : subjects.map((sub) => (
                                <Card key={sub.id} className="glass-dark border-primary/20 hover:border-primary/50 transition-colors cursor-pointer group">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">{sub.code}</Badge>
                                            <Badge variant="secondary" className="bg-white/10">{sub.type}</Badge>
                                        </div>
                                        <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">{sub.name}</h3>
                                        <p className="text-sm text-muted-foreground">{sub.credits} Credits • {sub.department}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </main>
    )
}

