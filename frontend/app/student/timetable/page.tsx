"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface TimetableEntry {
    id: number;
    class_id: number;
    subject_id: number;
    teacher_id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    room_number: string;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function StudentTimetablePage() {
    const router = useRouter();
    const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [classId, setClassId] = useState<number | null>(null);

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

            const demoClassId = 1;
            setClassId(demoClassId);

            const res = await fetch(`http://localhost:8000/timetable/class/${demoClassId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                setTimetable(data);
            }
        } catch (error) {
            console.error("Error fetching timetable:", error);
        } finally {
            setLoading(false);
        }
    };

    const getEntriesForDay = (day: string) => {
        return timetable
            .filter((entry) => entry.day_of_week === day)
            .sort((a, b) => a.start_time.localeCompare(b.start_time));
    };

    const getCurrentDay = () => {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return days[new Date().getDay()];
    };

    if (loading) {
        return (
            <main className="p-8 flex items-center justify-center min-h-screen">
                <div className="text-xl text-muted-foreground">Loading timetable...</div>
            </main>
        );
    }

    return (
        <main className="p-8 space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Timetable</h1>
                    <p className="text-muted-foreground">View your weekly class schedule</p>
                </div>
            </div>

            {timetable.length === 0 ? (
                <Card className="glass-dark border-primary/20">
                    <CardContent className="p-12 text-center">
                        <div className="text-6xl mb-4">📅</div>
                        <h2 className="text-2xl font-semibold mb-2">No Timetable</h2>
                        <p className="text-muted-foreground">Your class timetable will appear here once it's published.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {DAYS.map((day) => {
                        const entries = getEntriesForDay(day);
                        const isToday = day === getCurrentDay();

                        return (
                            <Card
                                key={day}
                                className={`glass-dark ${isToday ? "border-primary/50 ring-2 ring-primary/20" : "border-primary/20"
                                    } hover:border-primary/50 transition-colors`}
                            >
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <CardTitle className="text-2xl">{day}</CardTitle>
                                        {isToday && (
                                            <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-semibold border border-primary/30">
                                                Today
                                            </span>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {entries.length === 0 ? (
                                        <p className="text-muted-foreground text-center py-6">No classes scheduled</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {entries.map((entry) => (
                                                <div
                                                    key={entry.id}
                                                    className="flex items-center justify-between p-4 bg-background/40 rounded-lg border border-white/10 hover:border-primary/20 transition-colors"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold text-center min-w-[100px] border border-primary/20">
                                                            <div className="text-sm">{entry.start_time}</div>
                                                            <div className="text-xs opacity-70">to</div>
                                                            <div className="text-sm">{entry.end_time}</div>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-semibold">
                                                                Subject ID: {entry.subject_id}
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                Teacher ID: {entry.teacher_id} • Room: {entry.room_number}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
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
