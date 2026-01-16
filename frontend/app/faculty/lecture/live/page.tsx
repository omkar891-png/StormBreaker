"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
    Users,
    ScanFace,
    CheckCircle2,
    XCircle,
    Clock,
    LogOut,
    Search,
    RefreshCw
} from "lucide-react"

// Mock Students Data
const MOCK_STUDENTS = [
    { id: "CS01", name: "Alex Doe", img: "/avatars/01.png", status: "pending" },
    { id: "CS02", name: "John Smith", img: "/avatars/02.png", status: "pending" },
    { id: "CS03", name: "Sarah Connor", img: "/avatars/03.png", status: "pending" },
    { id: "CS04", name: "Mike Ross", img: "/avatars/04.png", status: "pending" },
    { id: "CS05", name: "Rachel Green", img: "/avatars/05.png", status: "pending" },
    { id: "CS06", name: "Harvey Specter", img: "/avatars/06.png", status: "pending" },
    { id: "CS07", name: "Louis Litt", img: "/avatars/07.png", status: "pending" },
    { id: "CS08", name: "Donna Paulsen", img: "/avatars/08.png", status: "pending" },
]

export default function LiveLecturePage() {
    const searchParams = useSearchParams()
    const router = useRouter()

    // Session Details from URL
    const dept = searchParams.get('dept') || "CS"
    const classYear = searchParams.get('class') || "SY"
    const div = searchParams.get('div') || "A"
    const subject = searchParams.get('sub') || "Unknown Subject"

    const [students, setStudents] = React.useState(MOCK_STUDENTS)
    const [isScanning, setIsScanning] = React.useState(false)
    const [sessionActive, setSessionActive] = React.useState(true)

    // Stats
    const total = students.length
    const present = students.filter(s => s.status === 'present').length
    const absent = students.filter(s => s.status === 'absent').length

    // Function to toggle status manually
    const toggleStatus = (id: string, newStatus: string) => {
        if (!sessionActive) return
        setStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s))
    }

    // Simulate Face Scan
    const simulateScan = () => {
        if (!sessionActive) return
        setIsScanning(true)

        // Randomly mark 2-3 pending students as present
        setTimeout(() => {
            setStudents(prev => {
                const pending = prev.filter(s => s.status === 'pending')
                if (pending.length === 0) return prev

                const verified = []
                const indices = new Set<number>()
                while (indices.size < Math.min(3, pending.length)) {
                    indices.add(Math.floor(Math.random() * pending.length))
                }

                // Create a map of IDs to update
                const idsToUpdate = new Set(Array.from(indices).map((i: number) => pending[i].id))

                return prev.map(s => idsToUpdate.has(s.id) ? { ...s, status: 'present' } : s)
            })
            setIsScanning(false)
        }, 2000)
    }

    const endSession = () => {
        const confirmEnd = window.confirm("Are you sure you want to end this session? All pending students will be marked Absent.")
        if (confirmEnd) {
            setStudents(prev => prev.map(s => s.status === 'pending' ? { ...s, status: 'absent' } : s))
            setSessionActive(false)
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] animate-fade-in p-6 gap-6">

            {/* Header / Control Bar */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 sticky top-0 z-20">
                <div>
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-indigo-400 border-indigo-500/30 px-3 py-1">LIVE</Badge>
                        <h1 className="text-2xl font-bold tracking-tight">{subject}</h1>
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm flex items-center gap-2">
                        <Users className="h-4 w-4" /> {classYear}-{dept} / Div {div}
                        <span className="text-white/20">|</span>
                        <Clock className="h-4 w-4" /> Started at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {sessionActive ? (
                        <>
                            <Button variant="secondary" className="gap-2" onClick={simulateScan} disabled={isScanning}>
                                {isScanning ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ScanFace className="h-4 w-4" />}
                                {isScanning ? "Scanning..." : "Simulate Face Scan"}
                            </Button>
                            <Button variant="destructive" className="gap-2" onClick={endSession}>
                                <LogOut className="h-4 w-4" /> End Session
                            </Button>
                        </>
                    ) : (
                        <Button className="bg-green-600 hover:bg-green-700 text-white gap-2" onClick={() => router.push('/faculty/dashboard')}>
                            <CheckCircle2 className="h-4 w-4" /> Finish & Save
                        </Button>
                    )}
                </div>
            </header>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 overflow-hidden">

                {/* Visualizer / Feed (Left) */}
                <div className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-4">
                        <Card className="glass-dark border-green-500/20 bg-green-500/5">
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold text-green-500">{present}</span>
                                <span className="text-xs text-muted-foreground uppercase tracking-wider">Present</span>
                            </CardContent>
                        </Card>
                        <Card className="glass-dark border-red-500/20 bg-red-500/5">
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold text-red-500">{absent}</span>
                                <span className="text-xs text-muted-foreground uppercase tracking-wider">Absent</span>
                            </CardContent>
                        </Card>
                        <Card className="glass-dark border-white/10">
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold text-white">{total}</span>
                                <span className="text-xs text-muted-foreground uppercase tracking-wider">Total</span>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Student Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {students.map((student) => (
                            <Card
                                key={student.id}
                                className={`
                                    border transition-all duration-300 relative overflow-hidden group
                                    ${student.status === 'present' ? 'border-green-500/50 bg-green-500/10' :
                                        student.status === 'absent' ? 'border-red-500/50 bg-red-500/10 opacity-70' :
                                            'border-white/10 bg-white/5 hover:border-white/30'}
                                `}
                            >
                                <CardContent className="p-4 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <Avatar className={`h-10 w-10 border-2 ${student.status === 'present' ? 'border-green-500' :
                                            student.status === 'absent' ? 'border-red-500' : 'border-transparent'
                                            }`}>
                                            <AvatarImage src={student.img} />
                                            <AvatarFallback>S</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-sm leading-none">{student.name}</p>
                                            <p className="text-xs text-muted-foreground mt-1 font-mono">{student.id}</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons (Only visible if active or specific status) */}
                                    {sessionActive && (
                                        <div className="flex flex-col gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => toggleStatus(student.id, 'present')}
                                                className={`p-1 rounded-full hover:bg-green-500 hover:text-white transition-colors ${student.status === 'present' ? 'text-green-500' : 'text-muted-foreground'}`}
                                                title="Mark Present"
                                            >
                                                <CheckCircle2 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => toggleStatus(student.id, 'absent')}
                                                className={`p-1 rounded-full hover:bg-red-500 hover:text-white transition-colors ${student.status === 'absent' ? 'text-red-500' : 'text-muted-foreground'}`}
                                                title="Mark Absent"
                                            >
                                                <XCircle className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </CardContent>
                                {student.status === 'present' && (
                                    <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_theme(colors.green.500)]" />
                                )}
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Sidebar / Logs (Right) */}
                <Card className="glass-dark border-primary/20 h-full flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-lg">Activity Log</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto text-sm space-y-4 custom-scrollbar pr-2">
                        {isScanning && (
                            <div className="flex items-center gap-2 text-indigo-400 animate-pulse">
                                <ScanFace className="h-4 w-4" /> Processing face data...
                            </div>
                        )}
                        {students.filter(s => s.status !== 'pending').reverse().map((s, i) => (
                            <div key={i} className="flex gap-2 items-start text-xs border-b border-white/5 pb-2">
                                <span className="text-muted-foreground font-mono">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                <div>
                                    <span className="font-bold">{s.name}</span> was marked <span className={s.status === 'present' ? 'text-green-500' : 'text-red-500'}>{s.status}</span>.
                                </div>
                            </div>
                        ))}
                        <div className="text-muted-foreground italic">Session started...</div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}
