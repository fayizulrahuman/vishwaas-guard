import { VishwaasHeader } from "@/components/vishwaas-header"
import { ShieldOverlay } from "@/components/shield-overlay"
import { ScamSignatures } from "@/components/scam-signatures"
import { ReportVulnerability } from "@/components/report-vulnerability"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ShieldAlert, Users, Zap, CheckCircle, BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <VishwaasHeader />
      
      <main className="flex-1 container py-8 space-y-12">
        {/* Hero / HUD Section */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-black font-headline text-primary tracking-tight">
                SECURE SHIELD INTERFACE
              </h1>
              <p className="text-muted-foreground text-lg">
                Real-time liveness detection and deepfake analysis activated for your protection.
              </p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-accent text-sm font-bold">
                <Zap className="h-4 w-4 fill-current" />
                AI ENGINES ONLINE
              </div>
            </div>
          </div>
          
          <ShieldOverlay />
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Deepfakes Prevented", value: "1,248", icon: Shield, color: "text-accent" },
            { label: "Community Reports", value: "5.4k+", icon: Users, color: "text-primary" },
            { label: "System Uptime", value: "99.9%", icon: CheckCircle, color: "text-green-500" },
            { label: "Global Threat Level", value: "Low", icon: ShieldAlert, color: "text-blue-400" },
          ].map((stat, i) => (
            <Card key={i} className="border-primary/5 hover:border-primary/10 transition-colors">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color} opacity-20`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ScamSignatures />
          </div>
          <div className="space-y-8">
            <ReportVulnerability />
            
            <Card className="bg-primary text-primary-foreground border-none overflow-hidden relative">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Your Security Score
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center py-4">
                  <div className="relative h-32 w-32 flex items-center justify-center rounded-full border-8 border-accent/20">
                     <div className="absolute inset-0 rounded-full border-8 border-accent border-t-transparent animate-spin-slow"></div>
                     <span className="text-3xl font-black">94%</span>
                  </div>
                </div>
                <p className="text-sm text-primary-foreground/80 text-center">
                  Your communication channels are currently highly protected against biometric fraud.
                </p>
              </CardContent>
              <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-accent/20 rounded-full blur-2xl"></div>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t bg-muted/50 py-12">
        <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-headline font-bold text-primary">
              <Shield className="h-6 w-6 text-accent" />
              <span className="text-lg">Vishwaas Guard</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Advancing human communication through trust and deepfake resilience.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Technology</h4>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>Gemini 1.5 Pro Analysis</li>
              <li>Face Liveness ML</li>
              <li>Voice Biometrics</li>
              <li>Scam Registry</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Security Whitepaper</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Community</h4>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>User Forums</li>
              <li>Security Advocates</li>
              <li>Developer API</li>
              <li>Help Center</li>
            </ul>
          </div>
        </div>
        <div className="container mt-12 pt-8 border-t text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Vishwaas Guard. All rights reserved. Built for security and trust.
        </div>
      </footer>
    </div>
  )
}