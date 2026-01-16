"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent, role: string) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (!email || !password) {
        setError("Please fill in all fields")
        setIsLoading(false)
        return
      }



      const formData = new URLSearchParams()
      formData.append('username', email)
      formData.append('password', password)

      console.log("Login Attempt:", { email, password, role });
      console.log("FormData:", formData.toString());



      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Invalid credentials')
      }

      const data = await res.json()

      // Store session
      localStorage.setItem("token", data.access_token)
      localStorage.setItem("user", JSON.stringify({
        email,
        role: data.role,
        id: data.id
      }))

      if (data.role === 'student') {
        router.push("/student/dashboard")
      } else if (data.role === 'admin') {
        router.push("/admin/dashboard")
      } else if (data.role === 'faculty') {
        router.push("/faculty/dashboard")
      } else {
        router.push("/dashboard")
      }

    } catch (err: any) {
      console.error(err)
      setError(err.message || "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-transparent"></div>

      <Card className="w-full max-w-md glass-dark">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" className="w-full mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="faculty">Faculty</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>

            {["student", "faculty", "admin"].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <form onSubmit={(e) => handleLogin(e, tab)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${tab}-email`}>Email or Username</Label>
                    <Input
                      id={`${tab}-email`}
                      type="email"
                      placeholder={tab === 'student' ? "student@university.edu" : "admin@university.edu"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${tab}-password`}>Password</Label>
                    <Input
                      id={`${tab}-password`}
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>



                  {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  <Button type="submit" size="lg" className="w-full glow-primary-hover" disabled={isLoading}>
                    {isLoading ? "Logging in..." : `Login as ${tab.charAt(0).toUpperCase() + tab.slice(1)}`}
                  </Button>
                </form>
              </TabsContent>
            ))}
          </Tabs>


        </CardContent>
      </Card>
    </div>
  )
}
