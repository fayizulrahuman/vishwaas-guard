'use client';

import { useUser } from "@/firebase"
import { AuthScreen } from "@/components/auth-screen"
import { VishwaasHeader } from "@/components/vishwaas-header"
import { ShieldOverlay } from "@/components/shield-overlay"
import { ScamSignatures } from "@/components/scam-signatures"
import { ReportVulnerability } from "@/components/report-vulnerability"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ShieldAlert, Users, CheckCircle, BarChart3, Loader2 } from "lucide-react"

export default function Home() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <VishwaasHeader />
      
      <main className="flex-1 container max-w-6xl mx-auto py-12 space-y-16">
        {/* Hero Section */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
              Privacy. Secured.
            </h1>
            <p className="text-muted-foreground text-xl max-w-2xl">
              Real-time liveness detection and deepfake analysis activated for your communication channels.
            </p>
          </div>
          
          <div className="rounded-[2.5rem] overflow-hidden border border-border bg-white shadow-sm">
            <ShieldOverlay />
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Deepfakes Prevented", value: "1,248", icon: Shield, color: "text-primary" },
            { label: "Community Reports", value: "5.4k+", icon: Users, color: "text-primary" },
            { label: "System Uptime", value: "99.9%", icon: CheckCircle, color: "text-green-500" },
            { label: "Threat Level", value: "Low", icon: ShieldAlert, color: "text-blue-500" },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-[0_4px_24px_rgba(0,0,0,0.02)] bg-white rounded-3xl">
              <CardContent className="pt-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-2xl bg-muted ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <ScamSignatures />
          </div>
          <div className="space-y-10">
            <ReportVulnerability />
            
            <Card className="bg-primary text-primary-foreground border-none rounded-[2rem] overflow-hidden relative shadow-xl shadow-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                  <BarChart3 className="h-5 w-5" />
                  Security Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center py-6">
                  <div className="relative h-40 w-40 flex items-center justify-center rounded-full border-[10px] border-white/10">
                     <div className="absolute inset-0 rounded-full border-[10px] border-white border-t-transparent animate-spin-slow"></div>
                     <span className="text-4xl font-black">94%</span>
                  </div>
                </div>
                <p className="text-sm text-primary-foreground/90 text-center px-4 leading-relaxed">
                  Your communication channels are currently highly protected against biometric fraud.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-white py-20 mt-20">
        <div className="container max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg tracking-tight">Vishwaas Guard</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Advancing human communication through trust and deepfake resilience.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-6 text-foreground">Technology</h4>
            <ul className="text-sm space-y-3 text-muted-foreground">
              <li>Gemini 1.5 Pro Analysis</li>
              <li>Face Liveness ML</li>
              <li>Voice Biometrics</li>
              <li>Scam Registry</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-6 text-foreground">Company</h4>
            <ul className="text-sm space-y-3 text-muted-foreground">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Security Whitepaper</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-6 text-foreground">Community</h4>
            <ul className="text-sm space-y-3 text-muted-foreground">
              <li>User Forums</li>
              <li>Security Advocates</li>
              <li>Developer API</li>
              <li>Help Center</li>
            </ul>
          </div>
        </div>
        <div className="container max-w-6xl mx-auto mt-20 pt-8 border-t border-border/50 text-center text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
          © {new Date().getFullYear()} Vishwaas Guard. All rights reserved.
        </div>
      </footer>
    </div>
  )
}