'use client';

import { useState, useEffect } from 'react';
import { Shield, ShieldAlert, X, Check, Loader2, MessageSquare, Phone, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { analyzeCommunicationThreat } from '@/ai/flows/communication-threat-analyzer';

export function IncomingThreatInterceptor() {
  const [incomingEvent, setIncomingEvent] = useState<{
    type: 'call' | 'sms';
    source: string;
    content: string;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIncomingEvent({
        type: 'call',
        source: '+1 (888) 555-0123',
        content: 'Unknown voice signature detected. The caller is requesting urgent account verification.',
      });
      setOpen(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const handleAuthorizeScan = async () => {
    if (!incomingEvent) return;
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeCommunicationThreat({
        content: incomingEvent.content,
        mediaType: incomingEvent.type === 'call' ? 'voice' : 'social',
      });
      setAnalysisResult(result);
      
      if (result.riskLevel === 'critical' || result.riskLevel === 'high') {
        toast({
          title: "THREAT DETECTED",
          description: "Vishwaas Guard recommends terminating this interaction immediately.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not reach the security intelligence engine.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDismiss = () => {
    setOpen(false);
    setIncomingEvent(null);
    setAnalysisResult(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="frosted-glass border-white/10 rounded-[2.5rem] max-w-md backdrop-blur-3xl p-0 overflow-hidden shadow-[0_0_80px_rgba(0,102,255,0.2)] bg-black/40">
        <div className="p-8 space-y-8 relative">
          <div className="absolute -top-20 -right-20 h-40 w-40 metallic-ring opacity-10 rotate-45 pointer-events-none"></div>
          
          <DialogHeader className="items-center text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
              <div className="relative p-5 rounded-[2rem] bg-white/5 border border-white/10 shadow-2xl">
                <ShieldAlert className="h-10 w-10 text-primary" />
              </div>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mb-3 font-black tracking-widest uppercase text-[10px] px-4 py-1.5 rounded-full">
              Unknown Source Detected
            </Badge>
            <DialogTitle className="text-3xl font-black text-white tracking-tight leading-tight">
              Authorize<br />Security Scan?
            </DialogTitle>
            <DialogDescription className="text-[#8E8E93] font-medium text-base leading-relaxed mt-4">
              Vishwaas Guard has intercepted an unknown {incomingEvent?.type}. Unlock the security layer to analyze deepfake signatures.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 flex items-center gap-5 backdrop-blur-md">
            <div className="h-12 w-12 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center text-white/60 shadow-inner">
              {incomingEvent?.type === 'call' ? <Phone className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-[#8E8E93] uppercase tracking-[0.2em] mb-0.5">Source ID</p>
              <p className="text-lg font-bold text-white tracking-tight">{incomingEvent?.source}</p>
            </div>
          </div>

          {!analysisResult ? (
            <div className="flex flex-col gap-4">
              <Button 
                onClick={handleAuthorizeScan} 
                disabled={isAnalyzing}
                className="w-full h-16 rounded-[24px] bg-white text-black hover:bg-white/90 font-black shadow-2xl gap-3 text-lg transition-all active:scale-95"
              >
                {isAnalyzing ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <Check className="h-6 w-6" />
                    Authorize Scan
                  </>
                )}
              </Button>
              <Button 
                onClick={handleDismiss}
                variant="ghost" 
                className="w-full h-12 rounded-2xl text-[#8E8E93] hover:text-white hover:bg-white/5 font-black uppercase tracking-widest text-xs transition-colors"
              >
                Skip Protection
              </Button>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className={`p-6 rounded-[32px] border ${analysisResult.riskLevel === 'critical' ? 'bg-destructive/10 border-destructive/30' : 'bg-emerald-500/10 border-emerald-500/30'} backdrop-blur-xl relative overflow-hidden group`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className={`h-6 w-6 ${analysisResult.riskLevel === 'critical' ? 'text-destructive' : 'text-emerald-500'}`} />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Risk Integrity</span>
                    </div>
                    <Badge className={`font-black tracking-widest px-3 py-1 rounded-lg ${analysisResult.riskLevel === 'critical' ? 'bg-destructive text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'}`}>
                      {analysisResult.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-2xl font-black text-white mb-3 tracking-tighter">{analysisResult.riskScore}% Scam Probability</p>
                  <p className="text-sm text-[#8E8E93] leading-relaxed font-medium mb-6">
                    {analysisResult.analysis}
                  </p>
                  <div className="p-5 bg-black/40 rounded-[20px] border border-white/10 shadow-inner">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Security Directive</p>
                    <p className="text-sm font-bold text-white leading-snug">{analysisResult.immediateAction}</p>
                  </div>
                </div>
              </div>
              <Button onClick={handleDismiss} className="w-full h-14 rounded-[24px] bg-white text-black font-black hover:bg-white/90 shadow-2xl transition-all">
                Acknowledge & Close
              </Button>
            </div>
          )}
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      </DialogContent>
    </Dialog>
  );
}
