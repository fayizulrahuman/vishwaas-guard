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
import { Shield, ShieldAlert, Users, CheckCircle, BarChart3, Loader2, Sparkles, ArrowRight, ExternalLink } from "lucide-react"
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
        description: "Could not reach the security intelligence server. Ensure your Gemini API Key is configured.",
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

  const parallaxY = scrollY * 0.5; // Optimized speed for the sinking effect
  const opacity = Math.max(0, 1 - scrollY / 600);

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/10">
      <VishwaasHeader />
      
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-12 md:space-y-16">
        {/* Hero Section - Optimized for visibility */}
        <section 
          className="space-y-6 md:space-y-8 will-change-transform transition-opacity duration-150"
          style={{ 
            transform: `translateY(${-parallaxY}px)`,
            opacity: opacity
          }}
        >
          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.1]">
              Privacy. Secured.
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-medium leading-relaxed">
              Real-time liveness detection and deepfake analysis activated for your communication channels.
            </p>
          </div>
          
          <div className="rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-border bg-white shadow-2xl ring-1 ring-black/5">
            <ShieldOverlay />
          </div>
        </section>

        {/* Dashboard Content */}
        <div className="relative z-10 bg-background/95 backdrop-blur-md -mt-16 md:-mt-24 pt-16 md:pt-24 rounded-t-[2.5rem] md:rounded-t-[3.5rem]">
          {/* Stats Grid - High visibility metrics */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
            {[
              { label: "Prevented", value: "1,248", icon: Shield, color: "text-primary" },
              { label: "Community", value: "5.4k+", icon: Users, color: "text-primary" },
              { label: "Uptime", value: "99.9%", icon: CheckCircle, color: "text-emerald-500" },
              { label: "Threat", value: "Low", icon: ShieldAlert, color: "text-blue-500" },
            ].map((stat, i) => (
              <Card key={i} className="border-none shadow-[0_2px_12px_rgba(0,0,0,0.02)] bg-white rounded-2xl md:rounded-3xl transition-all hover:shadow-lg hover:scale-[1.02] duration-300">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col gap-3">
                    <div className={`p-2 rounded-xl bg-muted/50 ${stat.color} w-fit`}>
                      <stat.icon className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                      <p className="text-lg md:text-2xl font-black text-foreground">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            <div className="lg:col-span-8 space-y-12 md:space-y-16">
              <ScamSignatures />
              
              {auditResult && (
                <Card id="audit-result" className="border-none bg-slate-50 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <CardHeader className="p-8 md:p-10 pb-4">
                    <div className="flex items-center gap-2 text-primary mb-3">
                      <Sparkles className="h-5 w-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">AI Audit Result</span>
                    </div>
                    <CardTitle className="text-2xl md:text-3xl font-black">Your Security Score: {auditResult.securityScore}%</CardTitle>
                    <CardDescription className="text-base md:text-lg text-slate-700 font-medium leading-relaxed mt-2">
                      {auditResult.auditSummary}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8 p-8 md:p-10 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                      {auditResult.recommendations.map((rec, i) => (
                        <div key={i} className="bg-white p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-3">
                          <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xs md:text-sm">
                            {i + 1}
                          </div>
                          <p className="text-xs md:text-sm font-semibold text-slate-800 leading-tight">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="lg:col-span-4 space-y-8 md:space-y-12">
              <Card className="bg-primary text-primary-foreground border-none rounded-[2rem] overflow-hidden relative shadow-2xl shadow-primary/30">
                <CardHeader className="p-8 md:p-10 pb-0">
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl font-bold">
                    <BarChart3 className="h-5 w-5" />
                    Security Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-8 md:p-10">
                  <div className="flex justify-center py-4">
                    <div className="relative h-28 w-28 md:h-32 md:w-32 flex items-center justify-center rounded-full border-[8px] border-white/10">
                       <div className="absolute inset-0 rounded-full border-[8px] border-white border-t-transparent animate-spin-slow"></div>
                       <span className="text-2xl md:text-3xl font-black">{auditResult ? auditResult.securityScore : '94'}%</span>
                    </div>
                  </div>
                  <Button 
                    onClick={runSecurityAudit}
                    disabled={isAuditing}
                    className="w-full h-12 rounded-2xl bg-white text-primary hover:bg-slate-50 font-black shadow-lg shadow-black/10 flex items-center justify-center gap-2 group transition-all"
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
                  <p className="text-[10px] text-primary-foreground/60 text-center font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                    Powered by Gemini AI
                  </p>
                </CardContent>
              </Card>

              <ReportVulnerability />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-white pt-16 pb-12 mt-24">
        <div className="container max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2 font-black text-foreground">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg tracking-tight uppercase">Vishwaas Guard</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              Advancing human communication through trust and deepfake resilience using cutting-edge biometric protection.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-6 text-foreground">Technology</h4>
            <ul className="text-sm space-y-3 text-muted-foreground font-medium">
              <li>Gemini 1.5 Analysis</li>
              <li>Face Liveness ML</li>
              <li>Voice Biometrics</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-6 text-foreground">API Resources</h4>
            <ul className="text-sm space-y-3 text-muted-foreground font-medium">
              <li className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                Google AI Studio <ExternalLink className="h-3 w-3" />
              </li>
              <li className="hover:text-primary transition-colors cursor-pointer">Security Whitepaper</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-6 text-foreground">Company</h4>
            <div className="flex flex-col items-start gap-1">
              <Button 
                variant="link" 
                className="h-auto p-0 text-sm text-muted-foreground hover:text-primary font-medium transition-colors"
                onClick={() => toast({ title: "Privacy Policy", description: "Your biometric data never leaves your device." })}
              >
                Privacy Policy
              </Button>
              <Button 
                variant="link" 
                className="h-auto p-0 text-sm text-muted-foreground hover:text-primary font-medium transition-colors"
                onClick={() => toast({ title: "Terms of Service", description: "Vishwaas Guard is for personal communication protection only." })}
              >
                Terms of Service
              </Button>
            </div>
          </div>
        </div>
        <div className="container max-w-6xl mx-auto mt-16 pt-8 border-t border-border/50 text-center text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black">
          © {new Date().getFullYear()} Vishwaas Guard. Secure Communication Integrity.
        </div>
      </footer>
    </div>
  )
}
