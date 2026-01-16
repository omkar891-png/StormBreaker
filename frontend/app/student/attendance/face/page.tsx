"use client"

import * as React from "react"
import Webcam from "react-webcam"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Camera, CheckCircle2, RotateCcw, AlertCircle } from "lucide-react"

export default function FaceVerificationPage() {
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

    const handleVerify = () => {
        setStatus("verifying")
        // Simulate API call
        setTimeout(() => {
            setStatus("success")
            // Redirect back to dashboard after a delay
            setTimeout(() => {
                router.push("/student/attendance/id-card")
            }, 2000)
        }, 2000)
    }

    const videoConstraints = {
        width: 500,
        height: 500,
        facingMode: "user"
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] pointer-events-none" />

            <Card className="w-full max-w-lg glass-dark border-primary/20 relative z-10">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl flex items-center justify-center gap-2">
                        <Camera className="h-6 w-6 text-indigo-400" /> Face Verification
                    </CardTitle>
                    <CardDescription>
                        Position your face within the frame and click capture.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">

                    {/* Camera / Image Container */}
                    <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-2xl overflow-hidden border-2 border-dashed border-white/20 bg-black/50 shadow-2xl">
                        {status === 'success' ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-500/20 backdrop-blur-sm z-20">
                                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_theme(colors.green.500)] animate-in zoom-in">
                                    <CheckCircle2 className="h-10 w-10 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Verified!</h3>
                                <p className="text-sm text-green-200">Redirecting...</p>
                            </div>
                        ) : null}

                        {imgSrc ? (
                            <img src={imgSrc} alt="captured" className="w-full h-full object-cover transform scale-x-[-1]" />
                        ) : (
                            <Webcam
                                audio={false}
                                height={400}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                width={400}
                                videoConstraints={videoConstraints}
                                className="w-full h-full object-cover transform scale-x-[-1]"
                            />
                        )}

                        {/* Overlay Box */}
                        {!imgSrc && (
                            <div className="absolute inset-0 border-[3px] border-indigo-500/50 m-8 rounded-xl pointer-events-none opacity-50 flex items-center justify-center">
                                <div className="w-full h-[1px] bg-indigo-500/30 absolute"></div>
                                <div className="h-full w-[1px] bg-indigo-500/30 absolute"></div>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="flex gap-4 w-full justify-center">
                        {!imgSrc ? (
                            <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 h-14 text-lg shadow-lg shadow-indigo-500/20" onClick={capture}>
                                <Camera className="mr-2 h-5 w-5" /> Capture Photo
                            </Button>
                        ) : (
                            <>
                                {status !== 'success' && status !== 'verifying' && (
                                    <>
                                        <Button variant="outline" size="lg" className="flex-1 border-white/10 hover:bg-white/5" onClick={handleRetake}>
                                            <RotateCcw className="mr-2 h-4 w-4" /> Retake
                                        </Button>
                                        <Button size="lg" className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={handleVerify}>
                                            <CheckCircle2 className="mr-2 h-4 w-4" /> Verify
                                        </Button>
                                    </>
                                )}
                                {status === 'verifying' && (
                                    <Button disabled size="lg" className="w-full bg-indigo-600/50">
                                        Processing...
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
