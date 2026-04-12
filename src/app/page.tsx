'use client';

import { useState, useEffect } from "react"
import { useUser } from "@/firebase"
import { AuthScreen } from "@/components/auth-screen"
import { VishwaasHeader } from "@/components/vishwaas-header"
import { ShieldOverlay } from "@/components/shield-overlay"
import { ScamSignatures } from "@/components/scam-signatures"
import { ReportVulnerability } from "@/components/report-vulnerability"
import { IncomingThreatInterceptor } from "@/components/incoming-threat-interceptor"
import { Button } from "@/components/ui/button"
import { Shield, ShieldAlert, Users, CheckCircle, BarChart3, Loader2, Sparkles, ExternalLink } from "lucide-react"
import { securityAudit, SecurityAuditOutput } from "@/ai/flows/security-audit-flow"

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

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  const parallaxY = scrollY * 0.2; 

  return (
    <div className="min-h-screen relative bg-black selection:bg-primary/20 overflow-hidden">
      {/* Background Volumetric Spheres */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="bg-sphere sphere-blue -top-40 -left-40 animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="bg-sphere sphere-blue top-1/4 -right-20 animate-float" style={{ animationDelay: '-3s' }}></div>
        <div className="bg-sphere sphere-orange -bottom-60 left-1/2 -translate-x-1/2 opacity-30 animate-float" style={{ animationDelay: '-5s' }}></div>
      </div>

      <div className="relative z-10">
        <VishwaasHeader />
        <IncomingThreatInterceptor />
        
        <main className="container max-w-6xl mx-auto px-6 py-12 space-y-24">
          {/* Hero Section */}
          <section 
            className="space-y-12 transition-all duration-300"
            style={{ transform: `translateY(${-parallaxY}px)` }}
          >
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[1.05]">
                Privacy.<br />Filtered by Glass.
              </h1>
              <p className="text-[#8E8E93] text-xl md:text-2xl font-medium leading-relaxed max-w-2xl">
                Real-time deepfake analysis flowing through a high-fidelity biometric security layer.
              </p>
            </div>
            
            <div className="glass-panel overflow-hidden border-white/20 shadow-2xl relative">
              <div className="absolute top-4 right-4 h-16 w-16 metallic-ring opacity-20 z-20"></div>
              <ShieldOverlay />
            </div>
          </section>

          {/* Stats Dashboard */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Shielded", value: "1,248", icon: Shield, color: "text-primary" },
              { label: "Network", value: "5.4k+", icon: Users, color: "text-primary" },
              { label: "Uptime", value: "99.9%", icon: CheckCircle, color: "text-emerald-500" },
              { label: "Threat", value: "Low", icon: ShieldAlert, color: "text-blue-500" },
            ].map((stat, i) => (
              <div key={i} className="glass-panel p-6 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02] cursor-default">
                <div className="flex flex-col gap-4">
                  <div className={`p-2.5 rounded-xl bg-white/5 ${stat.color} w-fit border border-white/10`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-[#8E8E93] uppercase tracking-[0.2em]">{stat.label}</p>
                    <p className="text-2xl font-black text-white">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-16">
              <ScamSignatures />
              
              {auditResult && (
                <div className="glass-panel p-10 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 border-primary/20 bg-primary/5">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                      <Sparkles className="h-5 w-5" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Security Audit</span>
                    </div>
                    <h2 className="text-3xl font-black text-white">Integrity Score: {auditResult.securityScore}%</h2>
                    <p className="text-lg text-[#8E8E93] font-medium leading-relaxed">
                      {auditResult.auditSummary}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {auditResult.recommendations.map((rec, i) => (
                      <div key={i} className="bg-black/40 p-6 rounded-[24px] border border-white/10 flex flex-col gap-4 backdrop-blur-md">
                        <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-black text-xs border border-primary/20">
                          {i + 1}
                        </div>
                        <p className="text-sm font-semibold text-white leading-snug">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-4 space-y-12">
              <div className="glass-panel p-10 space-y-8 bg-primary/10 border-primary/20 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 h-32 w-32 metallic-ring opacity-10"></div>
                <h3 className="flex items-center gap-2 text-xl font-black text-white">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Health Monitor
                </h3>
                
                <div className="flex justify-center">
                  <div className="relative h-40 w-40 flex items-center justify-center rounded-full border-[8px] border-white/5">
                     <div className="absolute inset-0 rounded-full border-[8px] border-primary border-t-transparent animate-spin-slow"></div>
                     <span className="text-4xl font-black text-white">{auditResult ? auditResult.securityScore : '94'}%</span>
                  </div>
                </div>

                <Button 
                  onClick={async () => {
                    setIsAuditing(true);
                    try {
                      const result = await securityAudit({
                        recentAlerts: ["Attempted biometric mimicry intercepted.", "Encrypted stream integrity verified."],
                        systemUptime: "99.98%",
                        protectionStatus: "Liquid Shield Active",
                      });
                      setAuditResult(result);
                    } finally {
                      setIsAuditing(false);
                    }
                  }}
                  disabled={isAuditing}
                  className="w-full h-14 rounded-[20px] bg-white text-black hover:bg-white/90 font-black shadow-xl gap-2 transition-all"
                >
                  {isAuditing ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Sparkles className="h-5 w-5" /> Run AI Audit</>}
                </Button>
                
                <p className="text-[10px] text-[#8E8E93] text-center font-black uppercase tracking-[0.2em]">
                  Inference Engine: Gemini 1.5 Flash
                </p>
              </div>

              <ReportVulnerability />
            </div>
          </div>
        </main>

        <footer className="border-t border-white/10 bg-black/40 backdrop-blur-3xl pt-24 pb-12 mt-48">
          <div className="container max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3 font-black text-white">
                <Shield className="h-7 w-7 text-primary" />
                <span className="text-xl tracking-tighter uppercase">Vishwaas Guard</span>
              </div>
              <p className="text-sm text-[#8E8E93] leading-relaxed font-medium">
                The global standard for deepfake resilience and biometric communication integrity.
              </p>
            </div>
            <div>
              <h4 className="font-black text-[10px] uppercase tracking-[0.2em] mb-8 text-white">Technology</h4>
              <ul className="text-sm space-y-4 text-[#8E8E93] font-medium">
                <li>Gemini Intelligence</li>
                <li>Biometric Liveness</li>
                <li>Voice Fingerprinting</li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-[10px] uppercase tracking-[0.2em] mb-8 text-white">Resources</h4>
              <ul className="text-sm space-y-4 text-[#8E8E93] font-medium">
                <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                  Security Hub <ExternalLink className="h-3 w-3" />
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">API Documentation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-[10px] uppercase tracking-[0.2em] mb-8 text-white">Legal</h4>
              <div className="flex flex-col items-start gap-2">
                <Button 
                  variant="link" 
                  onClick={() => toast({ title: "Privacy Policy", description: "Our 256-bit encryption policy ensures zero-knowledge data handling." })} 
                  className="p-0 h-auto text-[#8E8E93] hover:text-white font-medium"
                >
                  Privacy Policy
                </Button>
                <Button 
                  variant="link" 
                  onClick={() => toast({ title: "Terms of Use", description: "By using Vishwaas Guard, you agree to secure biometric monitoring standards." })} 
                  className="p-0 h-auto text-[#8E8E93] hover:text-white font-medium"
                >
                  Terms of Use
                </Button>
              </div>
            </div>
          </div>
          <div className="container max-w-6xl mx-auto mt-24 pt-12 border-t border-white/5 text-center text-[10px] text-[#8E8E93] uppercase tracking-[0.3em] font-black">
            © {new Date().getFullYear()} Vishwaas Guard. Cyber-Physical Integrity.
          </div>
        </footer>
      </div>
    </div>
  )
}
