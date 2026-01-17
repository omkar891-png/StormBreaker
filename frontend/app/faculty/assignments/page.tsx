"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookCheck, Plus, Calendar, User, FileText, Download, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface Assignment {
    id: number;
    title: string;
    description: string;
    due_date: string;
    subject_id: number;
    teacher_id: number;
    class_id: number;
    created_at: string;
}

interface Submission {
    id: number;
    assignment_id: number;
    student_id: number;
    content: string;
    submitted_at: string;
    marks_awarded: number | null;
    feedback: string | null;
}

export default function FacultyAssignmentsPage() {
    const router = useRouter();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState<number | null>(null);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [gradingData, setGradingData] = useState<{ [key: number]: { marks: number; feedback: string } }>({});

    // Hardcoded for demo - in production fetch from context/auth
    const TEACHER_ID = 1;

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        due_date: "",
        subject_id: 1,
        teacher_id: TEACHER_ID,
        class_id: 1,
    });

    useEffect(() => {
        fetchAssignments();
    }, []);

    useEffect(() => {
        if (selectedAssignment) {
            fetchSubmissions(selectedAssignment);
        }
    }, [selectedAssignment]);

    const fetchAssignments = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/auth/login");
                return;
            }

            const res = await fetch(`http://localhost:8000/assignments/teacher/${TEACHER_ID}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                setAssignments(data);
            }
        } catch (error) {
            console.error("Error fetching assignments:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSubmissions = async (assignmentId: number) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:8000/submissions/assignment/${assignmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                setSubmissions(data);

                // Initialize grading data
                const initialGrading: any = {};
                data.forEach((sub: Submission) => {
                    initialGrading[sub.id] = {
                        marks: sub.marks_awarded || 0,
                        feedback: sub.feedback || ""
                    };
                });
                setGradingData(initialGrading);
            }
        } catch (error) {
            console.error("Error fetching submissions:", error);
        }
    };

    const handleCreateAssignment = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:8000/assignments/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    due_date: new Date(formData.due_date).toISOString(),
                }),
            });

            if (res.ok) {
                setShowForm(false);
                setFormData({
                    title: "",
                    description: "",
                    due_date: "",
                    subject_id: 1,
                    teacher_id: TEACHER_ID,
                    class_id: 1,
                });
                fetchAssignments();
            }
        } catch (error) {
            console.error("Error creating assignment:", error);
        }
    };

    const handleGradeSubmission = async (submissionId: number) => {
        try {
            const token = localStorage.getItem("token");
            const data = gradingData[submissionId];

            const res = await fetch(`http://localhost:8000/submissions/${submissionId}/grade`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    marks: data.marks,
                    feedback: data.feedback,
                }),
            });

            if (res.ok) {
                alert("Graded successfully!");
                fetchSubmissions(selectedAssignment!);
            }
        } catch (error) {
            console.error("Error grading submission:", error);
        }
    };

    const handleGradingChange = (id: number, field: 'marks' | 'feedback', value: any) => {
        setGradingData(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };

    if (loading) {
        return (
            <main className="p-8 flex items-center justify-center min-h-screen">
                <div className="text-xl text-muted-foreground">Loading assignments...</div>
            </main>
        );
    }

    return (
        <main className="p-8 space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Assignments Management</h1>
                    <p className="text-muted-foreground">Create assignments and grade submissions</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)} className="glow-primary-hover gap-2">
                    <Plus className="h-4 w-4" /> {showForm ? "Cancel" : "Create Data Assignment"}
                </Button>
            </div>

            {showForm && (
                <Card className="glass-dark border-primary/20">
                    <CardHeader>
                        <CardTitle>Create New Assignment</CardTitle>
                        <CardDescription>Assign work to a specific class</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateAssignment} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-2">Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-3 bg-background/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-2">Description</label>
                                    <textarea
                                        required
                                        rows={4}
                                        className="w-full p-3 bg-background/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                                    <label className="block text-sm font-medium mb-2">Class ID</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full p-3 bg-background/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        value={formData.class_id}
                                        onChange={(e) => setFormData({ ...formData, class_id: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Due Date</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        className="w-full p-3 bg-background/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        value={formData.due_date}
                                        onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button type="submit" className="glow-primary-hover w-full md:w-auto px-8">
                                    Publish Assignment
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Assignments List */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-xl font-semibold opacity-90 pl-1">Your Assignments</h2>
                    {assignments.length === 0 ? (
                        <Card className="glass-dark border-primary/20">
                            <CardContent className="p-8 text-center text-muted-foreground">
                                <BookCheck className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                <p>No assignments created yet.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {assignments.map((assignment) => (
                                <Card
                                    key={assignment.id}
                                    className={`glass-dark cursor-pointer transition-all ${selectedAssignment === assignment.id
                                            ? 'border-primary shadow-lg shadow-primary/10 ring-1 ring-primary'
                                            : 'border-primary/20 hover:border-primary/50'
                                        }`}
                                    onClick={() => setSelectedAssignment(assignment.id)}
                                >
                                    <CardContent className="p-4">
                                        <h3 className="font-semibold text-lg mb-1">{assignment.title}</h3>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">
                                                Class {assignment.class_id}
                                            </span>
                                            <span>•</span>
                                            <span>Sub: {assignment.subject_id}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            Due: {new Date(assignment.due_date).toLocaleDateString()}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submissions View */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-semibold opacity-90 pl-1">
                        {selectedAssignment
                            ? `Submissions: ${assignments.find(a => a.id === selectedAssignment)?.title}`
                            : "Select an assignment to view submissions"}
                    </h2>

                    {!selectedAssignment ? (
                        <Card className="glass-dark border-primary/20 h-[400px] flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                                <FileText className="h-16 w-16 mx-auto mb-4 opacity-20" />
                                <p className="text-lg">Select an assignment from the list</p>
                                <p className="text-sm opacity-60">View student submissions, grade work, and give feedback</p>
                            </div>
                        </Card>
                    ) : submissions.length === 0 ? (
                        <Card className="glass-dark border-primary/20 h-[400px] flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                                <AlertCircle className="h-16 w-16 mx-auto mb-4 opacity-20" />
                                <p className="text-lg">No submissions yet</p>
                                <p className="text-sm opacity-60">Students haven't submitted any work for this assignment.</p>
                            </div>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {submissions.map((submission) => (
                                <Card key={submission.id} className="glass-dark border-primary/20">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                                                    S{submission.student_id}
                                                </div>
                                                <div>
                                                    <div className="font-semibold">Student ID: {submission.student_id}</div>
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        Submitted: {new Date(submission.submitted_at).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>

                                            {submission.marks_awarded !== null && (
                                                <div className="px-3 py-1 bg-green-400/10 text-green-400 border border-green-400/20 rounded-full text-xs font-bold flex items-center gap-1">
                                                    <CheckCircle className="h-3 w-3" /> Graded
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-background/40 p-4 rounded-lg border border-white/5 mb-4 max-h-40 overflow-y-auto">
                                            <p className="text-sm font-mono whitespace-pre-wrap">{submission.content}</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-white/5 p-4 rounded-lg border border-white/5">
                                            <div className="md:col-span-1">
                                                <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Marks (0-100)</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    className="w-full p-2 bg-background border border-white/10 rounded focus:ring-1 focus:ring-primary outline-none"
                                                    value={gradingData[submission.id]?.marks || 0}
                                                    onChange={(e) => handleGradingChange(submission.id, 'marks', parseInt(e.target.value))}
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Feedback</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2 bg-background border border-white/10 rounded focus:ring-1 focus:ring-primary outline-none"
                                                    placeholder="Great work, but..."
                                                    value={gradingData[submission.id]?.feedback || ""}
                                                    onChange={(e) => handleGradingChange(submission.id, 'feedback', e.target.value)}
                                                />
                                            </div>
                                            <div className="md:col-span-1">
                                                <Button
                                                    onClick={() => handleGradeSubmission(submission.id)}
                                                    className="w-full h-[38px] glow-primary-hover text-xs"
                                                >
                                                    Save Grade
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
