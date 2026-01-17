"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LeaveRequest {
    id: number;
    student_id: number;
    reason: string;
    start_date: string;
    end_date: string;
    status: string;
    applied_at: string;
    approved_by: number | null;
}

export default function StudentLeavePage() {
    const router = useRouter();
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [studentId, setStudentId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        reason: "",
        start_date: "",
        end_date: "",
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("userId");

            if (!token || !userId) {
                router.push("/auth/login");
                return;
            }

            const profileRes = await fetch(`http://localhost:8000/students/profile/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!profileRes.ok) throw new Error("Failed to fetch profile");
            const profileData = await profileRes.json();
            setStudentId(profileData.id);

            const leaveRes = await fetch(`http://localhost:8000/leave/student/${profileData.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (leaveRes.ok) {
                const leaveData = await leaveRes.json();
                setLeaveRequests(leaveData);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentId) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:8000/leave/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    student_id: studentId,
                    reason: formData.reason,
                    start_date: new Date(formData.start_date).toISOString(),
                    end_date: new Date(formData.end_date).toISOString(),
                }),
            });

            if (res.ok) {
                setFormData({ reason: "", start_date: "", end_date: "" });
                setShowForm(false);
                fetchData();
            }
        } catch (error) {
            console.error("Error submitting leave request:", error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "APPROVED":
                return "bg-green-400/10 text-green-400 border-green-400/20";
            case "REJECTED":
                return "bg-red-400/10 text-red-400 border-red-400/20";
            default:
                return "bg-yellow-400/10 text-yellow-400 border-yellow-400/20";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "APPROVED":
                return "✓";
            case "REJECTED":
                return "✗";
            default:
                return "⏳";
        }
    };

    if (loading) {
        return (
            <main className="p-8 flex items-center justify-center min-h-screen">
                <div className="text-xl text-muted-foreground">Loading leave requests...</div>
            </main>
        );
    }

    return (
        <main className="p-8 space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Leave Requests</h1>
                    <p className="text-muted-foreground">Apply for and manage your leave applications</p>
                </div>
                <Button
                    onClick={() => setShowForm(!showForm)}
                    className="glow-primary-hover"
                >
                    {showForm ? "Cancel" : "+ New Leave Request"}
                </Button>
            </div>

            {showForm && (
                <Card className="glass-dark border-primary/20">
                    <CardHeader>
                        <CardTitle>Apply for Leave</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Reason</label>
                                <textarea
                                    required
                                    className="w-full p-3 bg-background/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                                    rows={3}
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    placeholder="Enter reason for leave..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full p-3 bg-background/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                                        value={formData.start_date}
                                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">End Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full p-3 bg-background/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                                        value={formData.end_date}
                                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full glow-primary-hover">
                                Submit Leave Request
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {leaveRequests.length === 0 ? (
                <Card className="glass-dark border-primary/20">
                    <CardContent className="p-12 text-center">
                        <div className="text-6xl mb-4">🏖️</div>
                        <h2 className="text-2xl font-semibold mb-2">No Leave Requests</h2>
                        <p className="text-muted-foreground">You haven't applied for any leave yet.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {leaveRequests.map((leave) => {
                        const startDate = new Date(leave.start_date);
                        const endDate = new Date(leave.end_date);
                        const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

                        return (
                            <Card key={leave.id} className="glass-dark border-primary/20 hover:border-primary/50 transition-colors">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-semibold">Leave Request #{leave.id}</h3>
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(leave.status)}`}>
                                                    {getStatusIcon(leave.status)} {leave.status}
                                                </span>
                                            </div>
                                            <p className="text-muted-foreground mb-3">{leave.reason}</p>
                                            <div className="flex gap-6 text-sm text-muted-foreground">
                                                <span>📅 {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</span>
                                                <span>⏱️ {days} {days === 1 ? 'day' : 'days'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-4">
                                        Applied on: {new Date(leave.applied_at).toLocaleDateString()}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </main>
    );
}
