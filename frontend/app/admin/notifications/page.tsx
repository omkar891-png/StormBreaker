"use client"

import * as React from "react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Bell, Check, Trash2, Plus, MessageSquare, AlertTriangle, Info, Clock, Send } from "lucide-react"

const MOCK_NOTIFICATIONS = [
    { id: 1, type: "system", title: "System Maintenance", message: "Scheduled maintenance on Sunday at 2 AM.", time: "2 hours ago", read: false },
    { id: 2, type: "alert", title: "Server Load High", message: "Main server load exceeded 80% capacity.", time: "5 hours ago", read: false },
    { id: 3, type: "message", title: "New Leave Request", message: "Prof. Smith has requested leave for tomorrow.", time: "1 day ago", read: true },
    { id: 4, type: "system", title: "Backup Successful", message: "Daily database backup completed successfully.", time: "1 day ago", read: true },
    { id: 5, type: "alert", title: "Attendance Anomaly", message: "Detected 5 unverified attendance records.", time: "2 days ago", read: true },
]

export default function NotificationsPage() {
    const [notifications, setNotifications] = React.useState(MOCK_NOTIFICATIONS)
    const [filter, setFilter] = React.useState("all")

    const filteredNotifications = notifications.filter(n => filter === "all" || n.type === filter)

    const markAsRead = (id: number) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
    }

    const deleteNotification = (id: number) => {
        setNotifications(notifications.filter(n => n.id !== id))
    }

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })))
    }

    return (
        <div className="flex flex-col gap-6 animate-fade-in max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">Notifications</h1>
                    <p className="text-muted-foreground mt-1">Manage system alerts and communications.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={markAllRead}>
                        <Check className="h-4 w-4" /> Mark all read
                    </Button>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-primary hover:bg-primary/90 gap-2">
                                <Send className="h-4 w-4" /> Send Notification
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-dark border-primary/20">
                            <DialogHeader>
                                <DialogTitle>Send New Notification</DialogTitle>
                                <DialogDescription>
                                    Broadcast a message to students or faculty.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <label htmlFor="audience" className="text-sm font-medium">Target Audience</label>
                                    <Select defaultValue="all">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select audience" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Everyone</SelectItem>
                                            <SelectItem value="students">Students Only</SelectItem>
                                            <SelectItem value="faculty">Faculty Only</SelectItem>
                                            <SelectItem value="admins">Admins</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="title" className="text-sm font-medium">Subject</label>
                                    <Input id="title" placeholder="e.g. Campus Closure" />
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                                    <Textarea id="message" placeholder="Type your message here..." />
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="type" className="text-sm font-medium">Priority</label>
                                    <Select defaultValue="normal">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low (Info)</SelectItem>
                                            <SelectItem value="normal">Normal</SelectItem>
                                            <SelectItem value="high">High (Alert)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="bg-primary">Send Message</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">

                {/* Sidebar Filter */}
                <Card className="glass-dark border-primary/10 md:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-base">Filters</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <Button variant={filter === 'all' ? 'secondary' : 'ghost'} className="justify-start" onClick={() => setFilter('all')}>
                            <Bell className="mr-2 h-4 w-4" /> All
                        </Button>
                        <Button variant={filter === 'system' ? 'secondary' : 'ghost'} className="justify-start" onClick={() => setFilter('system')}>
                            <Info className="mr-2 h-4 w-4 text-blue-400" /> System
                        </Button>
                        <Button variant={filter === 'alert' ? 'secondary' : 'ghost'} className="justify-start" onClick={() => setFilter('alert')}>
                            <AlertTriangle className="mr-2 h-4 w-4 text-yellow-400" /> Alerts
                        </Button>
                        <Button variant={filter === 'message' ? 'secondary' : 'ghost'} className="justify-start" onClick={() => setFilter('message')}>
                            <MessageSquare className="mr-2 h-4 w-4 text-green-400" /> Messages
                        </Button>
                    </CardContent>
                </Card>

                {/* Notification List */}
                <Card className="glass-dark border-primary/10 md:col-span-3">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center justify-between">
                            Recent Notifications
                            <Badge variant="outline" className="font-mono text-xs">{filteredNotifications.length} Total</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {filteredNotifications.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground">
                                No notifications found.
                            </div>
                        ) : (
                            filteredNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`flex items-start gap-4 p-4 rounded-lg border transition-all hover:bg-white/5 ${notification.read ? 'border-transparent bg-transparent opacity-70' : 'border-primary/20 bg-primary/5'}`}
                                >
                                    <div className={`p-2 rounded-full shrink-0 ${notification.type === 'alert' ? 'bg-yellow-500/10 text-yellow-500' :
                                        notification.type === 'message' ? 'bg-green-500/10 text-green-500' :
                                            'bg-blue-500/10 text-blue-500'
                                        }`}>
                                        {notification.type === 'alert' ? <AlertTriangle className="h-5 w-5" /> :
                                            notification.type === 'message' ? <MessageSquare className="h-5 w-5" /> :
                                                <Info className="h-5 w-5" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className={`font-semibold text-sm ${!notification.read && 'text-foreground'}`}>
                                                {notification.title}
                                                {!notification.read && <span className="inline-block w-2 h-2 ml-2 bg-primary rounded-full" />}
                                            </h4>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {notification.time}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                        {!notification.read && (
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-green-500" onClick={() => markAsRead(notification.id)} title="Mark as read">
                                                <Check className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500" onClick={() => deleteNotification(notification.id)} title="Delete">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
