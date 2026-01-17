"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Trash2, Plus, Clock, MapPin, User, BookOpen } from "lucide-react";

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

export default function AdminTimetablePage() {
    const router = useRouter();
    const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedClass, setSelectedClass] = useState(1);
    const [formData, setFormData] = useState({
        class_id: 1,
        subject_id: 1,
        teacher_id: 1,
        day_of_week: "Monday",
        start_time: "09:00",
        end_time: "10:00",
        room_number: "101",
    });

    useEffect(() => {
        fetchData();
    }, [selectedClass]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/auth/login");
                return;
            }

            const res = await fetch(`http://localhost:8000/timetable/class/${selectedClass}`, {
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

    const handleCreateEntry = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:8000/timetable/", {
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
            console.error("Error creating timetable entry:", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this entry?")) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:8000/timetable/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                fetchData();
            }
        } catch (error) {
            console.error("Error deleting timetable entry:", error);
        }
    };

    const getEntriesForDay = (day: string) => {
        return timetable
            .filter((entry) => entry.day_of_week === day)
            .sort((a, b) => a.start_time.localeCompare(b.start_time));
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
                    <h1 className="text-3xl font-bold tracking-tight">Timetable Management</h1>
                    <p className="text-muted-foreground">Create and manage class schedules</p>
                </div>
                <Button
                    onClick={() => setShowForm(!showForm)}
                    className="glow-primary-hover gap-2"
                >
                    <Plus className="h-4 w-4" /> {showForm ? "Cancel" : "Add Entry"}
                </Button>
            </div>

            <div className="flex gap-4 items-center mb-6">
                <label className="font-semibold text-muted-foreground">Select Class:</label>
                <select
                    className="px-4 py-2 bg-background/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(parseInt(e.target.value))}
                >
                    {[1, 2, 3, 4, 5].map((id) => (
                        <option key={id} value={id}>
                            Class {id}
                        </option>
                    ))}
                </select>
            </div>

            {showForm && (
                <Card className="glass-dark border-primary/20 mb-8">
                    <CardHeader>
                        <CardTitle>Add Timetable Entry</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateEntry} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                    <label className="block text-sm font-medium mb-2">Teacher ID</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full p-3 bg-background/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        value={formData.teacher_id}
                                        onChange={(e) => setFormData({ ...formData, teacher_id: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Day</label>
                                    <select
                                        required
                                        className="w-full p-3 bg-background/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        value={formData.day_of_week}
                                        onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value })}
                                    >
                                        {DAYS.map((day) => (
                                            <option key={day} value={day}>
                                                {day}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Start Time</label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full p-3 bg-background/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        value={formData.start_time}
                                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">End Time</label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full p-3 bg-background/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        value={formData.end_time}
                                        onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Room</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-3 bg-background/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        value={formData.room_number}
                                        onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button type="submit" className="glow-primary-hover w-full md:w-auto px-8">
                                    Add to Schedule
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {timetable.length === 0 ? (
                <Card className="glass-dark border-primary/20">
                    <CardContent className="p-12 text-center">
                        <div className="text-6xl mb-4">📅</div>
                        <h2 className="text-2xl font-semibold mb-2">No Timetable</h2>
                        <p className="text-muted-foreground">Add entries to create a timetable for this class.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {DAYS.map((day) => {
                        const entries = getEntriesForDay(day);

                        return (
                            <Card key={day} className="glass-dark border-primary/20 hover:border-primary/50 transition-colors">
                                <CardHeader>
                                    <CardTitle className="text-2xl">{day}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {entries.length === 0 ? (
                                        <p className="text-muted-foreground text-center py-6 border border-dashed border-white/10 rounded-lg">No classes scheduled</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {entries.map((entry) => (
                                                <div
                                                    key={entry.id}
                                                    className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-background/40 rounded-lg border border-white/10 hover:border-primary/20 transition-colors gap-4"
                                                >
                                                    <div className="flex items-center gap-4 w-full">
                                                        <div className="bg-primary/10 text-primary px-4 py-3 rounded-lg font-bold text-center min-w-[120px] border border-primary/20 flex flex-col justify-center">
                                                            <span className="text-16px leading-tight">{entry.start_time}</span>
                                                            <span className="text-[10px] opacity-70 uppercase tracking-widest my-0.5">to</span>
                                                            <span className="text-16px leading-tight">{entry.end_time}</span>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-1 w-full">
                                                            <div className="flex items-center gap-2">
                                                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                                                <span className="font-semibold">Subject: {entry.subject_id}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <User className="h-4 w-4 text-muted-foreground" />
                                                                <span className="text-muted-foreground">Teacher: {entry.teacher_id}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                                <span className="text-muted-foreground">Room: {entry.room_number}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <Button
                                                        onClick={() => handleDelete(entry.id)}
                                                        variant="destructive"
                                                        size="icon"
                                                        className="shrink-0 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
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
