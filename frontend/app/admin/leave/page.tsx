"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, CheckCircle, XCircle, Filter } from "lucide-react";

interface LeaveRequest {
    id: number;
    student_id: number;
    reason: string;
    start_date: string;
    end_date: string;
    status: string;
    applied_at: string;
}

export default function AdminLeavePage() {
    const router = useRouter();
    const [requests, setRequests] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("PENDING");

    useEffect(() => {
        fetchData();
    }, [filter]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/auth/login");
                return;
            }

            let url = "http://localhost:8000/leave/";
            if (filter !== "ALL") {
                url += `?status=${filter}`;
            }

            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                setRequests(data);
            }
        } catch (error) {
            console.error("Error fetching leave requests:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: number, status: string) => {
        if (!confirm(`Are you sure you want to ${status.toLowerCase()} this request?`)) return;

        try {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("userId"); // Assuming this is the admin's ID

            const res = await fetch(`http://localhost:8000/leave/${id}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    status: status,
                    approved_by: parseInt(userId || "0"),
                }),
            });

            if (res.ok) {
                fetchData();
            }
        } catch (error) {
            console.error("Error updating status:", error);
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
                    <h1 className="text-3xl font-bold tracking-tight">Leave Management</h1>
                    <p className="text-muted-foreground">Review and manage student leave applications</p>
                </div>
            </div>

            <div className="flex gap-4 items-center mb-6 overflow-x-auto pb-2">
                <div className="flex items-center gap-2 text-muted-foreground mr-2">
                    <Filter className="h-4 w-4" /> Filter:
                </div>
                {["PENDING", "APPROVED", "REJECTED", "ALL"].map((status) => (
                    <Button
                        key={status}
                        variant={filter === status ? "default" : "outline"}
                        onClick={() => setFilter(status)}
                        className={`rounded-full ${filter === status
                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                : "border-white/10 hover:bg-white/5"
                            }`}
                    >
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                    </Button>
                ))}
            </div>

            {requests.length === 0 ? (
                <Card className="glass-dark border-primary/20">
                    <CardContent className="p-12 text-center">
                        <div className="text-6xl mb-4">✨</div>
                        <h2 className="text-2xl font-semibold mb-2">All Caught Up!</h2>
                        <p className="text-muted-foreground">No leave requests found with status: {filter}</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {requests.map((request) => {
                        const startDate = new Date(request.start_date);
                        const endDate = new Date(request.end_date);
                        const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

                        return (
                            <Card key={request.id} className="glass-dark border-primary/20 hover:border-primary/50 transition-colors">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-lg font-bold">Student ID: {request.student_id}</span>
                                                        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${request.status === 'APPROVED' ? 'bg-green-400/10 text-green-400 border-green-400/20' :
                                                                request.status === 'REJECTED' ? 'bg-red-400/10 text-red-400 border-red-400/20' :
                                                                    'bg-yellow-400/10 text-yellow-400 border-yellow-400/20'
                                                            }`}>
                                                            {request.status}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Applied: {new Date(request.applied_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-4 bg-background/40 rounded-lg border border-white/5">
                                                <p className="text-sm font-medium mb-1 text-primary">Reason:</p>
                                                <p className="text-muted-foreground">{request.reason}</p>
                                            </div>

                                            <div className="flex gap-6 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-primary">📅 Duration:</span>
                                                    <span className="text-muted-foreground">
                                                        {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-primary">⏱️ Days:</span>
                                                    <span className="font-bold">{days}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {request.status === "PENDING" && (
                                            <div className="flex md:flex-col justify-center gap-3 min-w-[140px] border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                                                <Button
                                                    onClick={() => handleStatusUpdate(request.id, "APPROVED")}
                                                    className="bg-green-500 hover:bg-green-600 text-white w-full gap-2"
                                                >
                                                    <CheckCircle className="h-4 w-4" /> Approve
                                                </Button>
                                                <Button
                                                    onClick={() => handleStatusUpdate(request.id, "REJECTED")}
                                                    variant="destructive"
                                                    className="w-full gap-2"
                                                >
                                                    <XCircle className="h-4 w-4" /> Reject
                                                </Button>
                                            </div>
                                        )}
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
