"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

export default function StudentAssignmentsPage() {
    const router = useRouter();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [studentId, setStudentId] = useState<number | null>(null);
    const [classId, setClassId] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState<number | null>(null);
    const [submissionContent, setSubmissionContent] = useState("");

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

            const demoClassId = 1;
            setClassId(demoClassId);

            const assignmentsRes = await fetch(`http://localhost:8000/assignments/class/${demoClassId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (assignmentsRes.ok) {
                const assignmentsData = await assignmentsRes.json();
                setAssignments(assignmentsData);
            }

            const submissionsRes = await fetch(`http://localhost:8000/submissions/student/${profileData.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (submissionsRes.ok) {
                const submissionsData = await submissionsRes.json();
                setSubmissions(submissionsData);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (assignmentId: number) => {
        if (!submissionContent.trim() || !studentId) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:8000/submissions/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    assignment_id: assignmentId,
                    student_id: studentId,
                    content: submissionContent,
                }),
            });

            if (res.ok) {
                setSubmissionContent("");
                setSubmitting(null);
                fetchData();
            }
        } catch (error) {
            console.error("Error submitting assignment:", error);
        }
    };

    const getSubmissionForAssignment = (assignmentId: number) => {
        return submissions.find((s) => s.assignment_id === assignmentId);
    };

    const isOverdue = (dueDate: string) => {
        return new Date(dueDate) < new Date();
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
                    <h1 className="text-3xl font-bold tracking-tight">My Assignments</h1>
                    <p className="text-muted-foreground">View and submit your assignments</p>
                </div>
            </div>

            {assignments.length === 0 ? (
                <Card className="glass-dark border-primary/20">
                    <CardContent className="p-12 text-center">
                        <div className="text-6xl mb-4">📝</div>
                        <h2 className="text-2xl font-semibold mb-2">No Assignments</h2>
                        <p className="text-muted-foreground">You don't have any assignments at the moment.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {assignments.map((assignment) => {
                        const submission = getSubmissionForAssignment(assignment.id);
                        const overdue = isOverdue(assignment.due_date);
                        const daysUntilDue = Math.ceil(
                            (new Date(assignment.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                        );

                        return (
                            <Card key={assignment.id} className="glass-dark border-primary/20 hover:border-primary/50 transition-colors">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-semibold mb-2">{assignment.title}</h3>
                                            <p className="text-muted-foreground mb-3">{assignment.description}</p>
                                            <div className="flex gap-4 text-sm">
                                                <span className="text-muted-foreground">
                                                    📅 Due: {new Date(assignment.due_date).toLocaleDateString()}
                                                </span>
                                                {!overdue && !submission && (
                                                    <span className={`font-semibold ${daysUntilDue <= 2 ? 'text-red-400' : 'text-green-400'}`}>
                                                        {daysUntilDue > 0 ? `${daysUntilDue} days left` : 'Due today'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {submission ? (
                                            <div className="text-right">
                                                <div className="bg-green-400/10 text-green-400 px-4 py-2 rounded-lg font-semibold mb-2 border border-green-400/20">
                                                    ✓ Submitted
                                                </div>
                                                {submission.marks_awarded !== null && (
                                                    <div className="text-2xl font-bold text-primary">
                                                        {submission.marks_awarded}/100
                                                    </div>
                                                )}
                                            </div>
                                        ) : overdue ? (
                                            <div className="bg-red-400/10 text-red-400 px-4 py-2 rounded-lg font-semibold border border-red-400/20">
                                                Overdue
                                            </div>
                                        ) : (
                                            <div className="bg-yellow-400/10 text-yellow-400 px-4 py-2 rounded-lg font-semibold border border-yellow-400/20">
                                                Pending
                                            </div>
                                        )}
                                    </div>

                                    {submission && submission.feedback && (
                                        <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                                            <p className="text-sm font-semibold text-primary mb-1">Teacher's Feedback:</p>
                                            <p className="text-muted-foreground">{submission.feedback}</p>
                                        </div>
                                    )}

                                    {!submission && (
                                        <div className="mt-4">
                                            {submitting === assignment.id ? (
                                                <div className="space-y-3">
                                                    <textarea
                                                        className="w-full p-3 bg-background/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                                                        rows={4}
                                                        placeholder="Enter your submission (text or link)..."
                                                        value={submissionContent}
                                                        onChange={(e) => setSubmissionContent(e.target.value)}
                                                    />
                                                    <div className="flex gap-2">
                                                        <Button
                                                            onClick={() => handleSubmit(assignment.id)}
                                                            className="glow-primary-hover"
                                                        >
                                                            Submit
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => {
                                                                setSubmitting(null);
                                                                setSubmissionContent("");
                                                            }}
                                                            className="border-white/10"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <Button
                                                    onClick={() => setSubmitting(assignment.id)}
                                                    disabled={overdue}
                                                    className={overdue ? 'opacity-50 cursor-not-allowed' : 'glow-primary-hover'}
                                                >
                                                    Submit Assignment
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </main>
    );
}
