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

  // Simulate an incoming unknown source event for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIncomingEvent({
        type: 'call',
        source: '+1 (888) 555-0123',
        content: 'Unknown voice signature detected. The caller is requesting urgent account verification.',
      });
      setOpen(true);
    }, 8000); // Trigger after 8 seconds of browsing

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
      <DialogContent className="bg-black/95 border-white/10 rounded-[2.5rem] max-w-md backdrop-blur-3xl p-0 overflow-hidden shadow-[0_0_50px_rgba(0,102,204,0.2)]">
        <div className="p-8 space-y-6">
          <DialogHeader className="items-center text-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
              <div className="relative p-4 rounded-3xl bg-white/5 border border-white/10">
                <ShieldAlert className="h-10 w-10 text-primary" />
              </div>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mb-2 font-black tracking-widest uppercase text-[10px]">
              Unknown Source Detected
            </Badge>
            <DialogTitle className="text-2xl font-black text-white tracking-tight">
              Authorize Security Scan?
            </DialogTitle>
            <DialogDescription className="text-[#8E8E93] font-medium text-sm leading-relaxed">
              Vishwaas Guard has intercepted an unknown {incomingEvent?.type}. Would you like to analyze this interaction for deepfake signatures?
            </DialogDescription>
          </DialogHeader>

          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-black/40 flex items-center justify-center text-white/40">
              {incomingEvent?.type === 'call' ? <Phone className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
            </div>
            <div className="flex-1">
              <p className="text-xs font-black text-[#8E8E93] uppercase tracking-widest">Source ID</p>
              <p className="text-sm font-bold text-white">{incomingEvent?.source}</p>
            </div>
          </div>

          {!analysisResult ? (
            <div className="flex flex-col gap-3 pt-2">
              <Button 
                onClick={handleAuthorizeScan} 
                disabled={isAnalyzing}
                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black shadow-lg shadow-primary/20 gap-2 text-lg"
              >
                {isAnalyzing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Check className="h-5 w-5" />
                    Authorize Gemini Scan
                  </>
                )}
              </Button>
              <Button 
                onClick={handleDismiss}
                variant="ghost" 
                className="w-full h-12 rounded-2xl text-[#8E8E93] hover:text-white hover:bg-white/5 font-bold gap-2"
              >
                <X className="h-4 w-4" />
                Skip Protection
              </Button>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-2">
              <div className={`p-6 rounded-3xl border ${analysisResult.riskLevel === 'critical' ? 'bg-destructive/10 border-destructive/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`h-5 w-5 ${analysisResult.riskLevel === 'critical' ? 'text-destructive' : 'text-emerald-500'}`} />
                    <span className="text-xs font-black uppercase tracking-widest text-white/60">Risk Assessment</span>
                  </div>
                  <Badge className={`font-black tracking-widest ${analysisResult.riskLevel === 'critical' ? 'bg-destructive text-white' : 'bg-emerald-500 text-white'}`}>
                    {analysisResult.riskLevel.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-lg font-bold text-white mb-2">{analysisResult.riskScore}% Scam Probability</p>
                <p className="text-sm text-[#8E8E93] leading-relaxed font-medium mb-4">
                  {analysisResult.analysis}
                </p>
                <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Recommended Action</p>
                  <p className="text-sm font-bold text-white">{analysisResult.immediateAction}</p>
                </div>
              </div>
              <Button onClick={handleDismiss} className="w-full h-12 rounded-2xl bg-white text-black font-black hover:bg-white/90">
                Acknowledge & Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
