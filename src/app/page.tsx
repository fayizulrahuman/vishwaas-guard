'use client';

import { useState, useEffect } from "react"
import { useUser } from "@/firebase"
import { AuthScreen } from "@/components/auth-screen"
import { VishwaasHeader } from "@/components/vishwaas-header"
import { ShieldOverlay } from "@/components/shield-overlay"
import { ScamSignatures } from "@/components/scam-signatures"
import { ReportVulnerability } from "@/components/report-vulnerability"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, ShieldAlert, Users, CheckCircle, BarChart3, Loader2, Sparkles, ArrowRight } from "lucide-react"
import { securityAudit, SecurityAuditOutput } from "@/ai/flows/security-audit-flow"
import { toast } from "@/hooks/use-toast"

export default function Home() {
  const { user, isUserLoading } = useUser();
  const [scrollY, setScrollY] = useState(0);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<SecurityAuditOutput | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const runSecurityAudit = async () => {
    setIsAuditing(true);
    try {
      const result = await securityAudit({
        recentAlerts: [
          "Attempted voice mimicry detected 2 days ago.",
          "Unusual geometric patterns detected in incoming video call.",
          "System integrity check passed."
        ],
        systemUptime: "99.98%",
        protectionStatus: "Active Shield",
      });
      setAuditResult(result);
      toast({
        title: "Audit Complete",
        description: "Gemini has finished analyzing your security posture.",
      });
    } catch (error) {
      console.error("Audit failed", error);
      toast({
        title: "Audit Failed",
        description: "Could not connect to the security intelligence server.",
        variant: "destructive",
      });
    } finally {
      setIsAuditing(false);
    }
  };

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

  const parallaxY = scrollY * 0.5;
  const opacity = Math.max(0, 1 - scrollY / 600);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <VishwaasHeader />
      
      <main className="flex-1 container max-w-6xl mx-auto py-12 space-y-16">
        {/* Hero Section */}
        <section 
          className="space-y-8 will-change-transform transition-opacity duration-75"
          style={{ 
            transform: `translateY(${-parallaxY}px)`,
            opacity: opacity
          }}
        >
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
              Privacy. Secured.
            </h1>
            <p className="text-muted-foreground text-xl max-w-2xl font-medium">
              Real-time liveness detection and deepfake analysis activated for your communication channels.
            </p>
          </div>
          
          <div className="rounded-[2.5rem] overflow-hidden border border-border bg-white shadow-sm ring-1 ring-black/5">
            <ShieldOverlay />
          </div>
        </section>

        {/* Dashboard Content */}
        <div className="relative z-10 bg-background/80 backdrop-blur-sm -mt-8 pt-8 rounded-t-[3rem]">
          {/* Stats Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { label: "Deepfakes Prevented", value: "1,248", icon: Shield, color: "text-primary" },
              { label: "Community Reports", value: "5.4k+", icon: Users, color: "text-primary" },
              { label: "System Uptime", value: "99.9%", icon: CheckCircle, color: "text-green-500" },
              { label: "Threat Level", value: "Low", icon: ShieldAlert, color: "text-blue-500" },
            ].map((stat, i) => (
              <Card key={i} className="border-none shadow-[0_4px_24px_rgba(0,0,0,0.02)] bg-white rounded-3xl transition-transform hover:scale-[1.02] duration-300">
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
              
              {auditResult && (
                <Card className="border-none bg-slate-50 rounded-[2.5rem] overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <CardHeader className="pt-10">
                    <div className="flex items-center gap-2 text-primary mb-2">
                      <Sparkles className="h-5 w-5" />
                      <span className="text-xs font-black uppercase tracking-widest">AI Audit Result</span>
                    </div>
                    <CardTitle className="text-3xl font-black">Your Security Score: {auditResult.securityScore}%</CardTitle>
                    <CardDescription className="text-lg text-slate-700 font-medium leading-relaxed">
                      {auditResult.auditSummary}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8 pb-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {auditResult.recommendations.map((rec, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                            {i + 1}
                          </div>
                          <p className="text-sm font-semibold text-slate-800 leading-tight">{rec}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                      <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4 text-primary" />
                        Global Threat Intelligence
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed italic">
                        {auditResult.threatAnalysis}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="space-y-10">
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
                       <span className="text-4xl font-black">{auditResult ? auditResult.securityScore : '94'}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-primary-foreground/90 text-center px-4 leading-relaxed font-medium">
                    Your communication channels are currently highly protected against biometric fraud.
                  </p>
                  <Button 
                    onClick={runSecurityAudit}
                    disabled={isAuditing}
                    className="w-full h-14 rounded-2xl bg-white text-primary hover:bg-slate-50 font-black shadow-lg shadow-black/10 flex items-center justify-center gap-2 group transition-all"
                  >
                    {isAuditing ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        Run AI Audit
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <ReportVulnerability />
            </div>
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
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              Advancing human communication through trust and deepfake resilience.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-6 text-foreground">Technology</h4>
            <ul className="text-sm space-y-3 text-muted-foreground font-medium">
              <li className="hover:text-primary transition-colors cursor-pointer">Gemini 2.5 Analysis</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Face Liveness ML</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Voice Biometrics</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Scam Registry</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-6 text-foreground">Company</h4>
            <ul className="text-sm space-y-3 text-muted-foreground font-medium">
              <li className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Terms of Service</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Security Whitepaper</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Contact Us</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-6 text-foreground">Community</h4>
            <ul className="text-sm space-y-3 text-muted-foreground font-medium">
              <li className="hover:text-primary transition-colors cursor-pointer">User Forums</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Security Advocates</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Developer API</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Help Center</li>
            </ul>
          </div>
        </div>
        <div className="container max-w-6xl mx-auto mt-20 pt-8 border-t border-border/50 text-center text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
          © {new Date().getFullYear()} Vishwaas Guard. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
