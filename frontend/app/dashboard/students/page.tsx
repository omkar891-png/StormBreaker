"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function StudentsPage() {
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Student Management</h1>
          <p className="text-muted-foreground">Manage and verify student records</p>
        </div>
        <Button className="glow-primary-hover">+ Add Student</Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input placeholder="Search by name, roll number, or email..." className="bg-card border-primary/20 px-4" />
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: "Rahul Kumar", roll: "CS101", email: "rahul@college.edu", attendance: "92%" },
          { name: "Priya Singh", roll: "CS102", email: "priya@college.edu", attendance: "88%" },
          { name: "Amit Patel", roll: "CS103", email: "amit@college.edu", attendance: "75%" },
          { name: "Neha Sharma", roll: "CS104", email: "neha@college.edu", attendance: "95%" },
          { name: "Vikram Joshi", roll: "CS105", email: "vikram@college.edu", attendance: "85%" },
          { name: "Anjali Verma", roll: "CS106", email: "anjali@college.edu", attendance: "90%" },
        ].map((student) => (
          <Card key={student.roll} className="glass-dark border-primary/20 hover:border-primary/50 transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">{student.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{student.name}</p>
                  <p className="text-xs text-muted-foreground">{student.roll}</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-xs text-muted-foreground">{student.email}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs">Attendance</span>
                  <span className="text-sm font-semibold text-primary">{student.attendance}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full text-xs bg-transparent">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
