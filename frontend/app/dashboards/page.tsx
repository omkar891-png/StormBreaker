import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function DashboardsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[400px] flex items-center justify-center py-16 px-4">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-background"></div>

          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Powerful Dashboards</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive views for faculty and administrators
            </p>
          </div>
        </section>

        {/* Faculty Dashboard */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12">Faculty Dashboard</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
              <div className="bg-gradient-to-br from-primary/10 to-background border border-primary/30 rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-4">Key Features</h3>
                <ul className="space-y-3">
                  {[
                    "Mark and verify student attendance",
                    "View real-time class attendance list",
                    "Filter by date, subject, and session",
                    "Export attendance records",
                    "Monitor individual student progress",
                    "Generate class reports",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-card border border-border/50 rounded-lg p-8">
                <div className="bg-background rounded p-6 text-center text-muted-foreground">
                  <div className="text-6xl mb-4">📊</div>
                  <p>Live attendance statistics and class overview</p>
                </div>
              </div>
            </div>

            <div className="border-t border-border/50 my-20"></div>

            {/* Admin Dashboard */}
            <h2 className="text-3xl font-bold mb-12">Admin Dashboard</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-card border border-border/50 rounded-lg p-8">
                <div className="bg-background rounded p-6 text-center text-muted-foreground">
                  <div className="text-6xl mb-4">👥</div>
                  <p>Institution-wide analytics and monitoring</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-secondary/10 to-background border border-secondary/30 rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-4">Key Features</h3>
                <ul className="space-y-3">
                  {[
                    "Student management and enrollment",
                    "Department and class-wise summary",
                    "College-wide attendance monitoring",
                    "System user management",
                    "Security audit logs",
                    "Institution reports and analytics",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-secondary"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 px-4 bg-card/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">Dashboard Capabilities</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: "Real-time Updates", value: "24/7" },
                { label: "Data Export", value: "PDF/Excel" },
                { label: "Custom Reports", value: "Unlimited" },
                { label: "User Accounts", value: "Scalable" },
              ].map((stat, idx) => (
                <div key={idx} className="bg-background border border-border/50 rounded-lg p-6 text-center">
                  <div className="text-2xl font-bold text-primary mb-2">{stat.value}</div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
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
