"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

interface Result {
    id: number;
    subject_id: number;
    marks_obtained: number;
    total_marks: number;
    exam_type: string;
    semester: string;
    academic_year: string;
    date_declared: string;
}

export default function StudentResultsPage() {
    const router = useRouter();
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(true);
    const [studentId, setStudentId] = useState<number | null>(null);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("userId");

            if (!token || !userId) {
                router.push("/auth");
                return;
            }

            // Get student profile
            const profileRes = await fetch(`http://localhost:8000/students/profile/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!profileRes.ok) throw new Error("Failed to fetch profile");
            const profileData = await profileRes.json();
            setStudentId(profileData.id);

            // Get results
            const resultsRes = await fetch(`http://localhost:8000/results/student/${profileData.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!resultsRes.ok) throw new Error("Failed to fetch results");
            const resultsData = await resultsRes.json();
            setResults(resultsData);
        } catch (error) {
            console.error("Error fetching results:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculatePercentage = (obtained: number, total: number) => {
        return ((obtained / total) * 100).toFixed(2);
    };

    const getGrade = (percentage: number) => {
        if (percentage >= 90) return "A+";
        if (percentage >= 80) return "A";
        if (percentage >= 70) return "B+";
        if (percentage >= 60) return "B";
        if (percentage >= 50) return "C";
        if (percentage >= 40) return "D";
        return "F";
    };

    if (loading) {
        return (
            <main className="p-8 flex items-center justify-center min-h-screen">
                <div className="text-xl text-muted-foreground">Loading results...</div>
            </main>
        );
    }

    return (
        <main className="p-8 space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Results</h1>
                    <p className="text-muted-foreground">View your academic performance</p>
                </div>
            </div>

            {results.length === 0 ? (
                <Card className="glass-dark border-primary/20">
                    <CardContent className="p-12 text-center">
                        <div className="text-6xl mb-4">📊</div>
                        <h2 className="text-2xl font-semibold mb-2">No Results Yet</h2>
                        <p className="text-muted-foreground">Your exam results will appear here once they are published.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {results.map((result) => {
                        const percentage = parseFloat(calculatePercentage(result.marks_obtained, result.total_marks));
                        const grade = getGrade(percentage);

                        return (
                            <Card key={result.id} className="glass-dark border-primary/20 hover:border-primary/50 transition-colors">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold">Subject ID: {result.subject_id}</h3>
                                            <p className="text-sm text-muted-foreground">{result.exam_type} - {result.semester}</p>
                                            <p className="text-xs text-muted-foreground">{result.academic_year}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-3xl font-bold ${percentage >= 60 ? 'text-green-400' : percentage >= 40 ? 'text-yellow-400' : 'text-red-400'
                                                }`}>
                                                {grade}
                                            </div>
                                            <p className="text-sm text-muted-foreground">{percentage}%</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <div className="w-full bg-background/40 rounded-full h-3 border border-white/10">
                                                <div
                                                    className={`h-full rounded-full transition-all ${percentage >= 60 ? 'bg-green-400' : percentage >= 40 ? 'bg-yellow-400' : 'bg-red-400'
                                                        }`}
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="text-lg font-semibold">
                                            {result.marks_obtained} / {result.total_marks}
                                        </div>
                                    </div>

                                    <div className="mt-4 text-xs text-muted-foreground">
                                        Declared on: {new Date(result.date_declared).toLocaleDateString()}
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
