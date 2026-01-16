import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function HowItWorksPage() {
  const steps = [
    {
      number: "1",
      title: "Student Enters Classroom",
      description: "Student approaches the attendance terminal at classroom entrance",
    },
    {
      number: "2",
      title: "Face is Scanned",
      description: "Real-time face detection and recognition using advanced AI",
    },
    {
      number: "3",
      title: "ID Card is Scanned",
      description: "Student presents ID card for QR/barcode/ID number scanning",
    },
    {
      number: "4",
      title: "Face + ID Cross-Match",
      description: "System verifies face matches the ID card holder's data",
    },
    {
      number: "5",
      title: "Anti-Proxy Validation",
      description: "Multiple checks ensure attendance legitimacy and no proxy attempts",
    },
    {
      number: "6",
      title: "Attendance Stored Securely",
      description: "Verified attendance is recorded in tamper-resistant database",
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6">How It Works</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A seamless, secure process from face recognition to verified attendance
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {steps.map((step, idx) => (
                <div key={idx} className="relative flex gap-8">
                  {/* Timeline line */}
                  {idx < steps.length - 1 && (
                    <div className="absolute left-6 top-20 w-0.5 h-20 bg-gradient-to-b from-primary to-primary/30"></div>
                  )}

                  {/* Step circle */}
                  <div className="flex-shrink-0">
                    <div className="relative z-10 w-12 h-12 rounded-full bg-primary flex items-center justify-center border-4 border-background">
                      <span className="text-primary-foreground font-bold">{step.number}</span>
                    </div>
                  </div>

                  {/* Step content */}
                  <div className="flex-grow pt-2">
                    <div className="bg-card border border-border/50 rounded-lg p-6">
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="py-20 px-4 bg-card/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">Why This Process Works</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Fast",
                  desc: "Attendance marked in seconds with dual verification",
                },
                {
                  title: "Secure",
                  desc: "Multiple layers of security prevent unauthorized access",
                },
                {
                  title: "Reliable",
                  desc: "Works with various lighting, accessories, and conditions",
                },
              ].map((benefit, idx) => (
                <div key={idx} className="bg-background border border-border/50 rounded-lg p-8 text-center">
                  <div className="text-4xl mb-4">{idx === 0 ? "⚡" : idx === 1 ? "🔐" : "✓"}</div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.desc}</p>
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
