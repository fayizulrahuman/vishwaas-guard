'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, X, Check, Loader2, MessageSquare, Phone, AlertTriangle } from 'lucide-react';
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
    }, 12000); 

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
      <DialogContent className="frosted-glass border-white/20 rounded-[2.5rem] md:rounded-[3rem] w-[92vw] sm:max-w-md backdrop-blur-[60px] md:backdrop-blur-[80px] p-0 overflow-hidden shadow-[0_0_120px_rgba(0,102,255,0.3)] bg-black/40">
        <div className="p-6 md:p-10 space-y-8 md:space-y-10 relative overflow-y-auto max-h-[85vh] custom-scrollbar">
          <div className="absolute -top-24 -right-24 h-48 w-48 metallic-ring opacity-20 rotate-45 pointer-events-none"></div>
          
          <DialogHeader className="items-center text-center">
            <div className="relative mb-6 md:mb-8">
              <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full scale-150"></div>
              <div className="relative p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] bg-white/5 border border-white/20 shadow-2xl backdrop-blur-3xl">
                <ShieldAlert className="h-8 w-8 md:h-12 md:w-12 text-primary drop-shadow-[0_0_10px_rgba(0,102,255,0.8)]" />
              </div>
            </div>
            <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 mb-3 md:mb-4 font-black tracking-[0.2em] md:tracking-[0.4em] uppercase text-[8px] md:text-[10px] px-4 md:px-5 py-1.5 md:py-2 rounded-full">
              Unknown Source detected
            </Badge>
            <DialogTitle className="text-2xl md:text-4xl font-black text-white tracking-tighter leading-tight">
              Authorize<br />Security Scan?
            </DialogTitle>
            <DialogDescription className="text-[#8E8E93] font-medium text-base md:text-lg leading-relaxed mt-4 md:mt-6">
              Vishwaas Guard intercepted an unknown {incomingEvent?.type}. Unlock the security layer to analyze deepfake signatures.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-white/5 border border-white/10 rounded-[24px] md:rounded-[32px] p-5 md:p-8 flex items-center gap-4 md:gap-6 backdrop-blur-3xl shadow-inner">
            <div className="h-12 w-12 md:h-16 md:w-16 rounded-[16px] md:rounded-[24px] bg-black/40 border border-white/10 flex items-center justify-center text-white/80 shadow-2xl">
              {incomingEvent?.type === 'call' ? <Phone className="h-6 w-6 md:h-8 md:w-8" /> : <MessageSquare className="h-6 w-6 md:h-8 md:w-8" />}
            </div>
            <div className="flex-1">
              <p className="text-[8px] md:text-[10px] font-black text-[#8E8E93] uppercase tracking-[0.3em] mb-0.5 md:mb-1">Source ID</p>
              <p className="text-base md:text-xl font-bold text-white tracking-tight truncate">{incomingEvent?.source}</p>
            </div>
          </div>

          {!analysisResult ? (
            <div className="flex flex-col gap-3 md:gap-5">
              <Button 
                onClick={handleAuthorizeScan} 
                disabled={isAnalyzing}
                className="w-full h-16 md:h-20 rounded-[24px] md:rounded-[32px] bg-white text-black hover:bg-white/90 font-black shadow-2xl gap-3 md:gap-4 text-lg md:text-xl transition-all active:scale-95"
              >
                {isAnalyzing ? (
                  <Loader2 className="h-6 w-6 md:h-7 md:w-7 animate-spin" />
                ) : (
                  <>
                    <Check className="h-6 w-6 md:h-7 md:w-7" />
                    Authorize Scan
                  </>
                )}
              </Button>
              <Button 
                onClick={handleDismiss}
                variant="ghost" 
                className="w-full h-12 md:h-14 rounded-[16px] md:rounded-[20px] text-[#8E8E93] hover:text-white hover:bg-white/5 font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[8px] md:text-[10px] transition-colors"
              >
                Skip Protection
              </Button>
            </div>
          ) : (
            <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <div className={`p-6 md:p-8 rounded-[24px] md:rounded-[40px] border ${analysisResult.riskLevel === 'critical' ? 'bg-destructive/10 border-destructive/40 shadow-[0_0_40px_rgba(239,68,68,0.2)]' : 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.2)]'} backdrop-blur-3xl relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <div className="flex items-center gap-3 md:gap-4">
                      <AlertTriangle className={`h-6 w-6 md:h-8 md:w-8 ${analysisResult.riskLevel === 'critical' ? 'text-destructive' : 'text-emerald-500'}`} />
                      <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/70">Risk Integrity</span>
                    </div>
                    <Badge className={`font-black tracking-[0.1em] md:tracking-[0.2em] px-3 md:px-4 py-1 md:py-1.5 rounded-lg md:rounded-xl text-[8px] md:text-[10px] ${analysisResult.riskLevel === 'critical' ? 'bg-destructive text-white shadow-2xl' : 'bg-emerald-500 text-white shadow-2xl'}`}>
                      {analysisResult.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xl md:text-3xl font-black text-white mb-3 md:mb-4 tracking-tighter">{analysisResult.riskScore}% Scam Probability</p>
                  <p className="text-sm md:text-base text-[#8E8E93] leading-relaxed font-medium mb-6 md:mb-8">
                    {analysisResult.analysis}
                  </p>
                  <div className="p-4 md:p-6 bg-black/40 rounded-[16px] md:rounded-[24px] border border-white/10 shadow-inner">
                    <p className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-[0.3em] md:tracking-[0.4em] mb-2 md:mb-3">Security Directive</p>
                    <p className="text-sm md:text-base font-bold text-white leading-snug">{analysisResult.immediateAction}</p>
                  </div>
                </div>
              </div>
              <Button onClick={handleDismiss} className="w-full h-14 md:h-16 rounded-[20px] md:rounded-[28px] bg-white text-black font-black hover:bg-white/90 shadow-2xl transition-all active:scale-95 text-base md:text-lg">
                Acknowledge & Close
              </Button>
            </div>
          )}
        </div>
        <div className="h-1.5 md:h-2 w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      </DialogContent>
    </Dialog>
  );
}
