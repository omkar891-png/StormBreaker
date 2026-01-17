"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Plus, Search } from "lucide-react";

interface Result {
    id: number;
    student_id: number;
    subject_id: number;
    marks_obtained: number;
    total_marks: number;
    exam_type: string;
    semester: string;
    academic_year: string;
    date_declared: string;
    student_name?: string; // Ideally fetched
}

export default function AdminResultsPage() {
    const router = useRouter();
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        student_id: 1, // Demo default
        subject_id: 1,
        marks_obtained: 0,
        total_marks: 100,
        exam_type: "Mid Term",
        semester: "Semester 1",
        academic_year: "2025-2026",
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/auth/login");
                return;
            }

            // Fetching results for a demo class/subject or all results
            // ideally paginated. For now fetching for student 1 as demo or implementing a comprehensive fetch
            // Let's implement fetching by class if API supports, or just last 50 results
            // Using the student fetch for demo purposes as established in previous step
            const res = await fetch(`http://localhost:8000/results/student/1`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                setResults(data);
            }
        } catch (error) {
            console.error("Error fetching results:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateResult = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:8000/results/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setShowForm(false);
                fetchData();
            }
        } catch (error) {
            console.error("Error creating result:", error);
        }
    };

    const calculatePercentage = (obtained: number, total: number) => {
        return ((obtained / total) * 100).toFixed(1);
    };

    const getGrade = (percentage: number) => {
        if (percentage >= 90) return "A+";
        if (percentage >= 80) return "A";
        if (percentage >= 70) return "B";
        if (percentage >= 60) return "C";
        if (percentage >= 50) return "D";
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
                    <h1 className="text-3xl font-bold tracking-tight">Results Management</h1>
                    <p className="text-muted-foreground">Manage student exam scores and grades</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)} className="glow-primary-hover gap-2">
                    <Plus className="h-4 w-4" /> Add New Result
                </Button>
            </div>

            {showForm && (
                <Card className="glass-dark border-primary/20">
                    <CardHeader>
                        <CardTitle>Enter Student Result</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateResult} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Student ID</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full p-3 bg-background/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        value={formData.student_id}
                                        onChange={(e) => setFormData({ ...formData, student_id: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Subject ID</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full p-3 bg-background/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        value={formData.subject_id}
                                        onChange={(e) => setFormData({ ...formData, subject_id: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Exam Type</label>
                                    <select
                                        className="w-full p-3 bg-background/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        value={formData.exam_type}
                                        onChange={(e) => setFormData({ ...formData, exam_type: e.target.value })}
                                    >
                                        <option value="Mid Term">Mid Term</option>
                                        <option value="Final Term">Final Term</option>
                                        <option value="Quiz">Quiz</option>
                                        <option value="Assignment">Assignment</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Marks Obtained</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full p-3 bg-background/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        value={formData.marks_obtained}
                                        onChange={(e) => setFormData({ ...formData, marks_obtained: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Total Marks</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full p-3 bg-background/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        value={formData.total_marks}
                                        onChange={(e) => setFormData({ ...formData, total_marks: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Academic Year</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-3 bg-background/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        value={formData.academic_year}
                                        onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="border-white/10">
                                    Cancel
                                </Button>
                                <Button type="submit" className="glow-primary-hover">
                                    Save Result
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Search/Filter Bar could go here */}

            <Card className="glass-dark border-primary/20">
                <CardHeader>
                    <CardTitle>Recent Results</CardTitle>
                </CardHeader>
                <CardContent>
                    {results.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No results records found.</p>
                        </div>
                    ) : (
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-white/5 text-muted-foreground">
                                    <tr>
                                        <th className="px-6 py-3">Student ID</th>
                                        <th className="px-6 py-3">Subject ID</th>
                                        <th className="px-6 py-3">Exam</th>
                                        <th className="px-6 py-3">Score</th>
                                        <th className="px-6 py-3">Grade</th>
                                        <th className="px-6 py-3">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((result) => {
                                        const percentage = parseFloat(calculatePercentage(result.marks_obtained, result.total_marks));
                                        const grade = getGrade(percentage);

                                        return (
                                            <tr key={result.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 font-medium">{result.student_id}</td>
                                                <td className="px-6 py-4">{result.subject_id}</td>
                                                <td className="px-6 py-4">
                                                    <div>{result.exam_type}</div>
                                                    <div className="text-xs text-muted-foreground">{result.semester}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-bold">{result.marks_obtained}</span>
                                                    <span className="text-muted-foreground"> / {result.total_marks}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${percentage >= 60 ? 'bg-green-400/10 text-green-400' :
                                                            percentage >= 40 ? 'bg-yellow-400/10 text-yellow-400' :
                                                                'bg-red-400/10 text-red-400'
                                                        }`}>
                                                        {grade} ({percentage}%)
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">
                                                    {new Date(result.date_declared).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}
