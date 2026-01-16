"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, AlertCircle, CheckCircle, FileSpreadsheet } from "lucide-react"

export default function BatchUploadPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [stats, setStats] = useState<any>(null)
    const [dept, setDept] = useState("CS")
    const [year, setYear] = useState("SY")

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return

        const file = e.target.files[0]
        const formData = new FormData()
        formData.append("file", file)
        formData.append("department", dept)
        formData.append("year", year)

        setIsLoading(true)
        setStats(null)

        try {
            const token = localStorage.getItem("token")
            const res = await fetch("http://127.0.0.1:8000/students/batch-upload", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            })

            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.detail || "Upload failed")
            }
            setStats(data)

        } catch (err: any) {
            setStats({ error: err.message })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="p-8 space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Batch Student Upload</h1>
                <p className="text-muted-foreground">Upload an Excel file to add multiple students at once.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Card className="glass-dark border-primary/20">
                    <CardHeader>
                        <CardTitle>Upload Configuration</CardTitle>
                        <CardDescription>Select target class and file</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Department</Label>
                                <Select defaultValue={dept} onValueChange={setDept}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CS">Computer Science</SelectItem>
                                        <SelectItem value="IT">Info Tech</SelectItem>
                                        <SelectItem value="ME">Mechanical</SelectItem>
                                        <SelectItem value="EE">Electrical</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Year</Label>
                                <Select defaultValue={year} onValueChange={setYear}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="FY">First Year</SelectItem>
                                        <SelectItem value="SY">Second Year</SelectItem>
                                        <SelectItem value="TY">Third Year</SelectItem>
                                        <SelectItem value="Final">Final Year</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="border-2 border-dashed border-white/10 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors relative">
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept=".xlsx, .xls, .csv"
                                onChange={handleFileUpload}
                                disabled={isLoading}
                            />
                            <FileSpreadsheet className="h-10 w-10 text-primary mb-2" />
                            <p className="text-sm font-medium">Click or Drag Excel File Here</p>
                            <p className="text-xs text-muted-foreground mt-1">.xlsx, .csv supported</p>
                            <p className="text-xs text-muted-foreground mt-2">Required Columns: Name, Email id, Password, Roll no</p>
                        </div>

                        {isLoading && <p className="text-center text-sm animate-pulse text-primary">Processing...</p>}
                    </CardContent>
                </Card>

                {stats && (
                    <Card className={`glass-dark border-primary/20 ${stats.error ? 'border-red-500/50' : 'border-green-500/50'}`}>
                        <CardHeader>
                            <CardTitle>Upload Results</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {stats.error ? (
                                <div className="flex items-center gap-2 text-red-400">
                                    <AlertCircle className="h-5 w-5" />
                                    <span>{stats.error}</span>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2 text-green-400">
                                        <CheckCircle className="h-5 w-5" />
                                        <span>{stats.message}</span>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-lg space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Total Rows Processed:</span>
                                            <span className="font-bold">{stats.total_rows}</span>
                                        </div>
                                        <div className="flex justify-between text-green-400">
                                            <span>Successfully Added:</span>
                                            <span className="font-bold">{stats.success_count}</span>
                                        </div>
                                        {stats.errors && stats.errors.length > 0 && (
                                            <div className="mt-4 pt-4 border-t border-white/10">
                                                <p className="font-bold text-red-400 mb-2">Errors:</p>
                                                <ul className="list-disc pl-4 space-y-1 text-red-300/80 max-h-[200px] overflow-y-auto">
                                                    {stats.errors.map((err: string, i: number) => (
                                                        <li key={i}>{err}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </main>
    )
}
