import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function SecurityPage() {
  const securityFeatures = [
    {
      title: "Dual Verification",
      description: "Face + ID verification ensures genuine attendance",
      items: ["Face recognition matching", "ID card verification", "Cross-validation"],
    },
    {
      title: "Anti-Proxy Face Detection",
      description: "Advanced algorithms prevent proxy attendance",
      items: ["Liveness detection", "Spoofing prevention", "Real-time validation"],
    },
    {
      title: "Failed Attempt Lock System",
      description: "Protect accounts from unauthorized access attempts",
      items: ["Multiple attempt tracking", "Automatic lockout", "Admin notifications"],
    },
    {
      title: "Tamper-Proof Records",
      description: "Immutable attendance logs for compliance",
      items: ["Audit trails", "Timestamp verification", "Data integrity"],
    },
    {
      title: "Secure Data Storage",
      description: "Enterprise-grade encryption and storage",
      items: ["End-to-end encryption", "Secure servers", "Regular backups"],
    },
    {
      title: "Anomaly Detection",
      description: "AI-powered detection of suspicious patterns",
      items: ["Pattern analysis", "Unusual activity alerts", "Behavioral tracking"],
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Security & Anti-Proxy Architecture</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Multiple layers of security to ensure legitimate attendance
            </p>
          </div>
        </section>

        {/* Security Features */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {securityFeatures.map((feature, idx) => (
                <div key={idx} className="bg-card border border-border/50 rounded-lg p-8">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.items.map((item, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Architecture Overview */}
        <section className="py-20 px-4 bg-card/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Security Architecture</h2>

            <div className="space-y-6">
              <div className="bg-background border border-border/50 rounded-lg p-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-primary text-2xl">1</span> Data Collection
                </h3>
                <p className="text-muted-foreground">
                  Face and ID data collected securely through dedicated terminals with encrypted connections
                </p>
              </div>

              <div className="bg-background border border-border/50 rounded-lg p-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-primary text-2xl">2</span> Real-time Verification
                </h3>
                <p className="text-muted-foreground">
                  Multi-layer verification checks including liveness detection, face matching, and ID validation
                </p>
              </div>

              <div className="bg-background border border-border/50 rounded-lg p-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-primary text-2xl">3</span> Secure Storage
                </h3>
                <p className="text-muted-foreground">
                  Encrypted storage with audit logs, timestamp verification, and tamper detection
                </p>
              </div>

              <div className="bg-background border border-border/50 rounded-lg p-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-primary text-2xl">4</span> Access Control
                </h3>
                <p className="text-muted-foreground">
                  Role-based access control with admin oversight and security monitoring
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-12">Compliance & Standards</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Data Privacy", desc: "GDPR compliant data handling" },
                { title: "Security Standards", desc: "Industry-standard encryption" },
                { title: "Audit Trails", desc: "Complete logging for compliance" },
              ].map((item, idx) => (
                <div key={idx} className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
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
