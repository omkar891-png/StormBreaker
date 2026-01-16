"use client"

import * as React from "react"
import { useState } from "react"
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
import { ArrowLeft, CheckCircle, FileSpreadsheet, Upload, AlertCircle } from "lucide-react"

// Types
interface StudentPreview {
    name: string
    email: string
    password: string // In reality you might hash this later or generate it
    id: string
}

export default function AddStudentPage() {
    const router = useRouter()
    const [department, setDepartment] = useState("")
    const [year, setYear] = useState("")
    const [file, setFile] = useState<File | null>(null)

    const [isProcessing, setIsProcessing] = useState(false)
    const [previewData, setPreviewData] = useState<StudentPreview[]>([])

    // Basic CSV Parsing
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            setIsProcessing(true)

            const reader = new FileReader()
            reader.onload = (event) => {
                try {
                    const text = event.target?.result as string
                    const lines = text.split('\n')
                    const parsedData: StudentPreview[] = []

                    // Start from index 1 to skip header
                    for (let i = 1; i < lines.length; i++) {
                        const line = lines[i].trim()
                        if (!line) continue

                        // Simple CSV split (doesn't handle quoted commas)
                        const cols = line.split(',')
                        if (cols.length >= 3) {
                            parsedData.push({
                                name: cols[0].trim(),
                                email: cols[1].trim(),
                                id: cols[2].trim(),
                                password: `pass_${Math.random().toString(36).slice(-6)}`
                            })
                        }
                    }
                    setPreviewData(parsedData)
                } catch (err) {
                    console.error("Error parsing CSV", err)
                    alert("Failed to parse CSV file. Ensure format: Name,Email,ID")
                } finally {
                    setIsProcessing(false)
                }
            }
            reader.readAsText(selectedFile)
        }
    }

    const handleSave = () => {
        // In a real app, send data to backend here
        alert(`Successfully registered ${previewData.length} students to ${department} - ${year}`)
        router.push("/admin/students") // Redirect to students list
    }

    return (
        <main className="p-8 space-y-8 animate-fade-in max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Add New Students</h1>
                    <p className="text-muted-foreground">Bulk register students department-wise.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Configuration Form */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="glass-dark border-primary/20">
                        <CardHeader>
                            <CardTitle>Class Configuration</CardTitle>
                            <CardDescription>Select target class params.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Department</Label>
                                <Select onValueChange={setDepartment} value={department}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Dept" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                                        <SelectItem value="Data Science">Data Science</SelectItem>
                                        <SelectItem value="IT">Information Technology</SelectItem>
                                        <SelectItem value="AI/ML">AI & Machine Learning</SelectItem>
                                        <SelectItem value="Mechanical">Mechanical</SelectItem>
                                        <SelectItem value="Civil">Civil</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Academic Year</Label>
                                <Select onValueChange={setYear} value={year}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="First Year">First Year</SelectItem>
                                        <SelectItem value="DSE">Direct Second Year (DSE)</SelectItem>
                                        <SelectItem value="Second Year">Second Year</SelectItem>
                                        <SelectItem value="Third Year">Third Year</SelectItem>
                                        <SelectItem value="Final Year">Final Year</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-dark border-primary/20">
                        <CardHeader>
                            <CardTitle>Upload Data</CardTitle>
                            <CardDescription>CSV or Excel file with headers: Name, Email, ID.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-primary/5 transition-colors cursor-pointer group relative">
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept=".csv, .xlsx, .xls"
                                    onChange={handleFileChange}
                                />
                                <div className="p-3 bg-primary/10 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                    <Upload className="h-6 w-6 text-primary" />
                                </div>
                                <p className="text-sm font-medium">{file ? file.name : "Click to Upload File"}</p>
                                <p className="text-xs text-muted-foreground mt-1">.csv, .xlsx supported</p>
                            </div>

                            <Button variant="outline" className="w-full gap-2" asChild>
                                <a href="#">
                                    <FileSpreadsheet className="h-4 w-4" />
                                    Download Template
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Preview & Action */}
                <div className="lg:col-span-2">
                    <Card className="glass-dark border-primary/20 h-full flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Student List Preview</span>
                                <span className="text-sm font-normal text-muted-foreground">
                                    {previewData.length > 0 ? `${previewData.length} records found` : "No data uploaded"}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-hidden flex flex-col">
                            {previewData.length > 0 ? (
                                <div className="flex-1 overflow-y-auto custom-scrollbar border rounded-md border-white/10">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-white/5 text-muted-foreground sticky top-0">
                                            <tr>
                                                <th className="p-3 font-medium">Student Name</th>
                                                <th className="p-3 font-medium">Student ID</th>
                                                <th className="p-3 font-medium">User Login ID</th>
                                                <th className="p-3 font-medium">Generated Password</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {previewData.map((student, idx) => (
                                                <tr key={idx} className="hover:bg-white/5 transition-colors">
                                                    <td className="p-3">{student.name}</td>
                                                    <td className="p-3 font-mono text-xs">{student.id}</td>
                                                    <td className="p-3">{student.email}</td>
                                                    <td className="p-3 font-mono text-xs text-muted-foreground">{student.password}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                        <FileSpreadsheet className="h-8 w-8 opacity-20" />
                                    </div>
                                    <p>Upload a file to see the preview here</p>
                                </div>
                            )}

                            {previewData.length > 0 && (
                                <div className="pt-6 mt-auto border-t border-white/10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-yellow-500 bg-yellow-500/10 px-3 py-2 rounded-md">
                                            <AlertCircle className="h-4 w-4" />
                                            <span>Verify all details before confirming.</span>
                                        </div>
                                        <Button onClick={handleSave} size="lg" className="glow-primary-hover gap-2">
                                            <CheckCircle className="h-4 w-4" />
                                            Confirm & Add Students
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    )
}
