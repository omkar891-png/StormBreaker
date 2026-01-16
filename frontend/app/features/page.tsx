import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function FeaturesPage() {
  const features = [
    {
      title: "Face Recognition System",
      description: "Advanced AI-powered face detection and recognition",
      items: ["Face Detection + Recognition", "Real-world condition handling", "Mask / beard / specs support"],
    },
    {
      title: "ID Card Verification",
      description: "Multi-format card scanning and verification",
      items: ["QR / Barcode / ID number scan", "Card data matched with profile", "Fake / swapped card prevention"],
    },
    {
      title: "Anti-Proxy System",
      description: "Multi-layered proxy detection technology",
      items: ["Anti-proxy face check", "Proxy detection logic", "Multiple failed attempt handling"],
    },
    {
      title: "Smart Attendance Logic",
      description: "Flexible attendance marking system",
      items: ["Session based attendance", "Classroom / Lab attendance", "Subject-wise attendance tracking"],
    },
    {
      title: "Data Security",
      description: "Enterprise-grade security infrastructure",
      items: ["Secure database storage", "Tamper-resistant records", "Audit logs for compliance"],
    },
    {
      title: "Analytics & Insights",
      description: "Real-time analytics and reporting",
      items: ["Attendance analytics", "Low attendance warnings", "Anomaly detection system"],
    },
  ]

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[400px] flex items-center justify-center py-16 px-4">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-background"></div>

          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Comprehensive Features</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Packed with enterprise-grade security and analytics for modern educational institutions
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-card border border-border/50 rounded-lg p-8 hover:border-primary/50 transition"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                    <span className="text-2xl">
                      {idx === 0 ? "👁️" : idx === 1 ? "🆔" : idx === 2 ? "🔒" : idx === 3 ? "✓" : idx === 4 ? "🛡️" : "📊"}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.items.map((item, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Features */}
        <section className="py-20 px-4 bg-card/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">Additional Capabilities</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-4">Advanced Detection</h3>
                <ul className="space-y-3">
                  {[
                    "Liveness detection to prevent spoofing",
                    "Real-time anomaly detection",
                    "Location-based restrictions",
                    "Time window control",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4">Reporting & Compliance</h3>
                <ul className="space-y-3">
                  {[
                    "Department-wide attendance reports",
                    "PDF & Excel export capabilities",
                    "Compliance logging",
                    "Performance analytics",
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

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Experience Full Features Today</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get a personalized demo of all SmartAttend features for your institution.
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/contact">Schedule Demo</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
