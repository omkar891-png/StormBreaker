"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, CheckCircle, Upload } from "lucide-react"

export default function AddTeacherPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)

    // Mock Form State
    const [formData, setFormData] = React.useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        department: "",
        subjects: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            alert("Teacher added successfully!")
            router.push("/admin/teachers")
        }, 1000)
    }

    return (
        <main className="p-8 space-y-8 animate-fade-in max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Add New Teacher</h1>
                    <p className="text-muted-foreground">Register a new faculty member.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Personal Details */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="glass-dark border-primary/20">
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Basic details of the teacher.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>First Name</Label>
                                <Input
                                    placeholder="John"
                                    required
                                    className="bg-background/50 border-white/10"
                                    value={formData.firstName}
                                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Last Name</Label>
                                <Input
                                    placeholder="Doe"
                                    required
                                    className="bg-background/50 border-white/10"
                                    value={formData.lastName}
                                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email Address</Label>
                                <Input
                                    type="email"
                                    placeholder="john.doe@college.edu"
                                    required
                                    className="bg-background/50 border-white/10"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input
                                    type="tel"
                                    placeholder="+1 234..."
                                    required
                                    className="bg-background/50 border-white/10"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-dark border-primary/20">
                        <CardHeader>
                            <CardTitle>Academic Details</CardTitle>
                            <CardDescription>Department and Subject Assignments.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Department</Label>
                                <Select onValueChange={(val) => setFormData({ ...formData, department: val })}>
                                    <SelectTrigger className="bg-background/50 border-white/10">
                                        <SelectValue placeholder="Select Department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CS">Computer Science</SelectItem>
                                        <SelectItem value="IT">Information Tech</SelectItem>
                                        <SelectItem value="DS">Data Science</SelectItem>
                                        <SelectItem value="AI">AI & ML</SelectItem>
                                        <SelectItem value="ME">Mechanical</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Assigned Subjects (Comma separated)</Label>
                                <Input
                                    placeholder="e.g. Data Structures, Algorithms"
                                    className="bg-background/50 border-white/10"
                                    value={formData.subjects}
                                    onChange={e => setFormData({ ...formData, subjects: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground">You can link specific Subject IDs later in Classes & Subjects.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Profile Photo & Actions */}
                <div className="space-y-6">
                    <Card className="glass-dark border-primary/20">
                        <CardHeader>
                            <CardTitle>Profile Photo</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center space-y-4">
                            <div className="w-32 h-32 rounded-full bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center relative overflow-hidden group hover:border-primary/50 transition-colors">
                                <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                            </div>
                            <p className="text-xs text-muted-foreground text-center">Click to upload or drag and drop<br />SVG, PNG, JPG or GIF</p>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-3">
                        <Button type="submit" size="lg" className="w-full glow-primary-hover gap-2" disabled={isLoading}>
                            {isLoading ? "Saving..." : (
                                <>
                                    <CheckCircle className="h-4 w-4" /> Save Teacher
                                </>
                            )}
                        </Button>
                        <Button variant="outline" type="button" className="w-full border-white/10" onClick={() => router.back()}>
                            Cancel
                        </Button>
                    </div>
                </div>

            </form>
        </main>
    )
}
