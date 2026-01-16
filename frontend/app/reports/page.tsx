import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function ReportsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[400px] flex items-center justify-center py-16 px-4">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-background"></div>

          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Reports & Analytics</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive insights into attendance patterns and trends
            </p>
          </div>
        </section>

        {/* Report Types */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12">Available Reports</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Daily Reports",
                  desc: "Real-time daily attendance summaries",
                  icon: "📅",
                },
                {
                  title: "Weekly Reports",
                  desc: "Weekly attendance trends and patterns",
                  icon: "📊",
                },
                {
                  title: "Monthly Reports",
                  desc: "Comprehensive monthly analytics",
                  icon: "📈",
                },
                {
                  title: "Subject-wise Tracking",
                  desc: "Attendance by subject and session",
                  icon: "📚",
                },
                {
                  title: "Low Attendance Alerts",
                  desc: "Identify students below threshold",
                  icon: "⚠️",
                },
                {
                  title: "Anomaly Detection",
                  desc: "Suspicious attendance patterns",
                  icon: "🔍",
                },
              ].map((report, idx) => (
                <div key={idx} className="bg-card border border-border/50 rounded-lg p-8">
                  <div className="text-4xl mb-4">{report.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{report.title}</h3>
                  <p className="text-muted-foreground">{report.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Analytics Features */}
        <section className="py-20 px-4 bg-card/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12">Analytics Capabilities</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-6">Student Analytics</h3>
                <ul className="space-y-4">
                  {[
                    "Individual attendance percentage",
                    "Attendance trends over time",
                    "Class-wise attendance breakdown",
                    "Performance correlation analysis",
                    "Dropout risk identification",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-6">Institution Analytics</h3>
                <ul className="space-y-4">
                  {[
                    "Department-wide statistics",
                    "Class capacity optimization",
                    "Faculty performance metrics",
                    "System usage analytics",
                    "Compliance reporting",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-secondary"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Export Options */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Export & Sharing</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { format: "PDF", desc: "Professional formatted reports" },
                { format: "Excel", desc: "Data sheets for further analysis" },
                { format: "CSV", desc: "Raw data for integration" },
              ].map((option, idx) => (
                <div key={idx} className="bg-card border border-border/50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{option.format}</div>
                  <p className="text-muted-foreground text-sm">{option.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
