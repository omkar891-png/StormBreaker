"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Upload } from "lucide-react"

export default function StudentOnboarding() {
    const router = useRouter()
    const [file, setFile] = React.useState<File | null>(null)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState("")

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setError("")
        }
    }

    const handleSubmit = async () => {
        if (!file) {
            setError("Please select a photo to upload.")
            return
        }

        setLoading(true)
        setError("")

        const formData = new FormData()
        formData.append("file", file)

        try {
            const token = localStorage.getItem("token")
            const response = await fetch("http://localhost:8000/students/upload-face", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.detail || "Failed to upload face")
            }

            // Success
            router.push("/student/dashboard")
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-primary/20 shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl text-center text-primary">Welcome to StormBreaker</CardTitle>
                    <CardDescription className="text-center">
                        To activate your account, please upload a clear photo of your face. This will be used for automated attendance.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="face-upload">Profile Photo / Face Scan</Label>
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="face-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/10 transition-colors border-muted-foreground/25 hover:border-primary/50">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        {file ? file.name : "Click to upload or drag and drop"}
                                    </p>
                                </div>
                                <Input
                                    id="face-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-destructive/15 text-destructive p-3 rounded-md flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            <div>
                                <h5 className="font-medium leading-none tracking-tight">Error</h5>
                                <div className="text-sm opacity-90 mt-1">{error}</div>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Registering Face..." : "Complete Setup"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
