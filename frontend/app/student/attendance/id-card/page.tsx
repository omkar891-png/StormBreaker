"use client"

import * as React from "react"
import Webcam from "react-webcam"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CreditCard, CheckCircle2, RotateCcw } from "lucide-react"

export default function IdCardVerificationPage() {
    const router = useRouter()
    const webcamRef = React.useRef<Webcam>(null)
    const [imgSrc, setImgSrc] = React.useState<string | null>(null)
    const [status, setStatus] = React.useState<"idle" | "verifying" | "success" | "error">("idle")

    const capture = React.useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot()
        if (imageSrc) {
            setImgSrc(imageSrc)
        }
    }, [webcamRef])

    const handleRetake = () => {
        setImgSrc(null)
        setStatus("idle")
    }

    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
    const subject = searchParams?.get('sub') || "General"
    const sessionId = searchParams?.get('session_id')

    const handleVerify = async () => {
        if (!imgSrc) return
        setStatus("verifying")

        try {
            const formData = new FormData()
            const blob = await (await fetch(imgSrc)).blob()
            formData.append("file", blob, "id_card.jpg")
            formData.append("subject", subject)
            if (sessionId) formData.append("session_id", sessionId)

            const token = localStorage.getItem("token")
            const response = await fetch("/api/attendance/mark", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            })

            const result = await response.json()
            if (response.ok) {
                setStatus("success")
                setTimeout(() => {
                    router.push(`/student/dashboard?verified=true&session=${sessionId}`)
                }, 2000)
            } else {
                console.error("Verification failed:", result.detail)
                setStatus("error")
                alert(result.detail || "Verification failed. Please try again.")
            }
        } catch (error) {
            console.error("Verification error:", error)
            setStatus("error")
            alert("An error occurred during verification.")
        }
    }

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "environment" // Use rear camera if available
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-blue-500/10 blur-[100px] pointer-events-none" />

            <Card className="w-full max-w-lg glass-dark border-primary/20 relative z-10">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl flex items-center justify-center gap-2">
                        <CreditCard className="h-6 w-6 text-blue-400" /> ID Card Verification
                    </CardTitle>
                    <CardDescription>
                        Align your Student ID card within the box.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">

                    {/* Camera / Image Container */}
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-white/20 bg-black/50 shadow-2xl">
                        {status === 'success' ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-500/20 backdrop-blur-sm z-20">
                                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_theme(colors.green.500)] animate-in zoom-in">
                                    <CheckCircle2 className="h-10 w-10 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white">ID Verified!</h3>
                                <p className="text-sm text-green-200">Processing attendance...</p>
                            </div>
                        ) : null}

                        {imgSrc ? (
                            <img src={imgSrc} alt="captured" className="w-full h-full object-cover" />
                        ) : (
                            <Webcam
                                audio={false}
                                height={720}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                width={1280}
                                videoConstraints={videoConstraints}
                                className="w-full h-full object-cover"
                            />
                        )}

                        {/* Overlay Box (Rectangular for ID) */}
                        {!imgSrc && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-[70%] h-[60%] border-[3px] border-blue-500/50 rounded-lg relative flex items-center justify-center opacity-70">
                                    <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-blue-400 -mt-1 -ml-1"></div>
                                    <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-blue-400 -mt-1 -mr-1"></div>
                                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-blue-400 -mb-1 -ml-1"></div>
                                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-blue-400 -mb-1 -mr-1"></div>
                                    <p className="text-blue-400 text-xs font-mono bg-black/50 px-2 py-1 rounded">SCAN ID</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="flex gap-4 w-full justify-center">
                        {!imgSrc ? (
                            <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg shadow-lg shadow-blue-500/20" onClick={capture}>
                                <CreditCard className="mr-2 h-5 w-5" /> Capture ID
                            </Button>
                        ) : (
                            <>
                                {status !== 'success' && status !== 'verifying' && (
                                    <>
                                        <Button variant="outline" size="lg" className="flex-1 border-white/10 hover:bg-white/5" onClick={handleRetake}>
                                            <RotateCcw className="mr-2 h-4 w-4" /> Retake
                                        </Button>
                                        <Button size="lg" className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={handleVerify}>
                                            <CheckCircle2 className="mr-2 h-4 w-4" /> Verify ID
                                        </Button>
                                    </>
                                )}
                                {status === 'verifying' && (
                                    <Button disabled size="lg" className="w-full bg-blue-600/50">
                                        Analyzing ID...
                                    </Button>
                                )}
                            </>
                        )}
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
