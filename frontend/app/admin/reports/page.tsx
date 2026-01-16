"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Filter, FileText, TrendingUp, TrendingDown, Users } from "lucide-react"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend,
    PieChart,
    Pie,
    Cell
} from 'recharts';

// Mock Data
const dataAttendance = [
    { name: 'Mon', present: 85, absent: 15 },
    { name: 'Tue', present: 88, absent: 12 },
    { name: 'Wed', present: 92, absent: 8 },
    { name: 'Thu', present: 82, absent: 18 },
    { name: 'Fri', present: 78, absent: 22 },
    { name: 'Sat', present: 95, absent: 5 },
];

const dataDept = [
    { name: 'CS', attendance: 90 },
    { name: 'IT', attendance: 85 },
    { name: 'Mech', attendance: 75 },
    { name: 'Civil', attendance: 80 },
    { name: 'ENTC', attendance: 88 },
];

const dataPie = [
    { name: 'Present', value: 850, color: '#22c55e' },
    { name: 'Absent', value: 120, color: '#ef4444' },
    { name: 'Late', value: 30, color: '#eab308' },
];

export default function ReportsPage() {
    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">Reports & Analytics</h1>
                    <p className="text-muted-foreground mt-1">Deep insights into attendance, performance, and trends.</p>
                </div>
                <div className="flex gap-2">
                    <Select defaultValue="this-week">
                        <SelectTrigger className="w-[140px] bg-secondary/50 border-white/10">
                            <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="this-week">This Week</SelectItem>
                            <SelectItem value="this-month">This Month</SelectItem>
                            <SelectItem value="this-year">This Year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" /> Filter
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90 gap-2">
                        <Download className="h-4 w-4" /> Export Report
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-dark border-primary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Average Attendance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-primary">87.5%</div>
                        <p className="text-xs text-muted-foreground mt-1 text-green-500 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" /> +2.1% from last week
                        </p>
                    </CardContent>
                </Card>
                <Card className="glass-dark border-primary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Absentees</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-500">142</div>
                        <p className="text-xs text-muted-foreground mt-1 text-red-400 flex items-center gap-1">
                            <TrendingDown className="h-3 w-3" /> +12 from yesterday
                        </p>
                    </CardContent>
                </Card>
                <Card className="glass-dark border-primary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Top Performing Dept</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-indigo-400">Computer Sci</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Users className="h-3 w-3" /> 90% Avg. Attendance
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Attendance Trend Chart */}
                <Card className="glass-dark border-primary/10">
                    <CardHeader>
                        <CardTitle>Attendance Trend</CardTitle>
                        <CardDescription>Weekly attendance performance</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dataAttendance}>
                                <defs>
                                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="present" stroke="#8884d8" fillOpacity={1} fill="url(#colorPresent)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Department Comparison Chart */}
                <Card className="glass-dark border-primary/10">
                    <CardHeader>
                        <CardTitle>Department Comparison</CardTitle>
                        <CardDescription>Average attendance by department</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dataDept}>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #333', borderRadius: '8px' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar dataKey="attendance" fill="#8884d8" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Table & Pie Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pie Chart Distribution */}
                <Card className="glass-dark border-primary/10 lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Daily Distribution</CardTitle>
                        <CardDescription>Today's overall stats</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={dataPie}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {dataPie.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #333', borderRadius: '8px' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Detailed Report List */}
                <Card className="glass-dark border-primary/10 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Generated Reports</CardTitle>
                        <CardDescription>Recently generated documents</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Monthly Attendance Report - March 2024</p>
                                            <p className="text-xs text-muted-foreground">Generated on March 31, 2024</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
