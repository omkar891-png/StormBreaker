"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Camera, Download, Shield } from "lucide-react"

export default function StudentProfilePage() {
    // Mock Data - replaced with partial real data fetch if needed
    // For now, let's keep the mock data for display but implement the upload logic
    const [student, setStudent] = useState({
        name: "Alex Doe", // This should come from API /students/me
        studentId: "STU-2024-001",
        course: "Computer Science",
        year: "2nd Year",
        section: "A",
        documentType: "National ID",
        documentNumber: "ABC-12345-XYZ",
        email: "alex.doe@university.edu",
        password: "TempPassword123!",
        profileImage: "/avatars/01.png"
    })

    const [isUploading, setIsUploading] = useState(false)

    // Hidden file input ref
    const fileInputRef = useState<HTMLInputElement | null>(null)

    const triggerUpload = () => {
        document.getElementById('file-upload')?.click()
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return

        const file = e.target.files[0]
        setIsUploading(true)

        try {
            const formData = new FormData()
            formData.append('file', file)

            const token = localStorage.getItem('token')
            const res = await fetch('http://127.0.0.1:8000/students/upload-face', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })

            if (!res.ok) throw new Error('Upload failed')

            alert("Face registered successfully!")
            // Optionally refresh profile image here

        } catch (err) {
            console.error(err)
            alert("Failed to upload face. Please try again.")
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
            <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
            />

            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full pointer-events-none -z-10" />

            {/* Navbar / Header */}
            <nav className="border-b border-primary/10 glass-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/student/dashboard">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <h1 className="text-xl font-bold">My Profile</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                            <span className="text-primary font-bold text-xs">SA</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 container max-w-4xl mx-auto py-8 px-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Left Column - Profile Card */}
                    <Card className="md:col-span-1 glass-dark border-primary/20 h-fit">
                        <CardHeader className="text-center">
                            <div className="relative mx-auto w-32 h-32 mb-4 group">
                                <Avatar className="w-full h-full border-4 border-primary/20 group-hover:border-primary transition-colors">
                                    <AvatarImage src={student.profileImage} />
                                    <AvatarFallback>AD</AvatarFallback>
                                </Avatar>
                                <button
                                    onClick={triggerUpload}
                                    className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-transform hover:scale-105 active:scale-95"
                                    title="Upload new photo"
                                >
                                    <Camera className="h-4 w-4" />
                                </button>
                            </div>
                            <CardTitle>{student.name}</CardTitle>
                            <CardDescription>{student.studentId}</CardDescription>
                            <div className="mt-4 px-3 py-1 bg-primary/10 rounded-full text-xs font-medium text-primary inline-block">
                                Active Student
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                                <p className="text-xs text-muted-foreground mb-1">Attendance Rate</p>
                                <div className="flex items-end justify-between">
                                    <span className="text-2xl font-bold text-primary">85%</span>
                                    <span className="text-xs text-green-400">Good</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right Column - Details */}
                    <div className="md:col-span-2 space-y-6">

                        {/* Personal Details */}
                        <Card className="glass-dark border-primary/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-primary" />
                                    Academic & Personal Details
                                </CardTitle>
                                <CardDescription>View your official administrative records.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input value={student.name} readOnly className="bg-background/50" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Course / Major</Label>
                                    <Input value={student.course} readOnly className="bg-background/50" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Year & Section</Label>
                                    <Input value={`${student.year} - Section ${student.section}`} readOnly className="bg-background/50" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Official Email</Label>
                                    <Input value={student.email} readOnly className="bg-background/50" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Identity Verification */}
                        <Card className="glass-dark border-primary/20">
                            <CardHeader>
                                <CardTitle>Identity Verification</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Document Type</Label>
                                        <Input value={student.documentType} readOnly className="bg-background/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Document Number</Label>
                                        <Input value={student.documentNumber} readOnly className="bg-background/50 font-mono" />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/10">
                                    <div className="space-y-2">
                                        <Label className="flex justify-between">
                                            <span>System Access Password</span>
                                            <span className="text-xs text-muted-foreground font-normal">(Provided by Admin)</span>
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                value={student.password}
                                                readOnly
                                                type="text"
                                                className="bg-background/50 pr-20 font-mono text-sm"
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground px-2 py-0.5 bg-secondary/50 rounded">
                                                Read-only
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex justify-end pt-4">
                            <Button className="w-full sm:w-auto glow-primary-hover shadow-lg shadow-primary/20 gap-2 h-12 text-md" size="lg">
                                <Download className="h-5 w-5" />
                                Download Digital ID Card
                            </Button>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    )
}
