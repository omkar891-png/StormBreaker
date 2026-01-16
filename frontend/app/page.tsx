import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30">
      <Navbar />
      <main className="flex-1 relative overflow-hidden flex items-center justify-center">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Hero Section */}
        <section className="relative px-4 flex items-center justify-center w-full">
          <div className="max-w-5xl mx-auto text-center z-10 w-full">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary mb-8 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              v2.0 Now Live for Universities
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
              The Future of Campus <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-accent">
                Attendance is Here.
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-10 font-medium max-w-2xl mx-auto">
              AI-driven tracking for forward-thinking universities. Experience the precision of next-generation academic biometric tools.
            </p>

            <div className="flex justify-center">
              <Button size="lg" className="rounded-full text-lg h-14 px-10 shadow-lg shadow-primary/25 glow-primary-hover animate-fade-in" asChild>
                <Link href="/auth/login">Login to Portal</Link>
              </Button>
            </div>

            {/* Features Section - Simplified for visual balance but strictly removed signup */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 opacity-80">
              {[
                { title: "Face-ID", icon: "👤", desc: "Biometric Integration" },
                { title: "Real-time", icon: "⚡", desc: "Instant Analytics" },
                { title: "Secure", icon: "🔒", desc: "Enterprise Grade" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <span className="text-3xl">{item.icon}</span>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
