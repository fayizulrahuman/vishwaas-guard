"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Shield, ShieldAlert, ShieldCheck, Eye, EyeOff, Camera, Mic, PhoneOff, AlertTriangle, Fingerprint, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { realtimeDeepfakeAlertTriggering } from '@/ai/flows/realtime-deepfake-alert-triggering'
import { toast } from '@/hooks/use-toast'

const MOCK_AUDIO_B64 = "data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YRAAAAAAAAAAAAAAAAAAAAAAAAAA"
const MOCK_VIDEO_B64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="

export function ShieldOverlay() {
  const [isActive, setIsActive] = useState(false)
  const [privacyConsent, setPrivacyConsent] = useState(false)
  const [probability, setProbability] = useState(0)
  const [status, setStatus] = useState<'idle' | 'secure' | 'warning' | 'critical'>('idle')
  const [analysisText, setAnalysisText] = useState('Standby for biometric scan...')
  const [isCameraOff, setIsCameraOff] = useState(false)
  const [isActivating, setIsActivating] = useState(false)
  
  const scanInterval = useRef<NodeJS.Timeout | null>(null)

  const toggleShield = () => {
    if (!privacyConsent) {
      toast({ title: "Consent Required", description: "Grant biometric access first.", variant: "destructive" });
      return;
    }
    
    setIsActive(!isActive)
    if (!isActive) {
      startScanning()
      toast({ title: "Shield Activated", description: "Live liveness filter is now active." });
    } else {
      stopScanning()
    }
  }

  const startScanning = () => {
    setStatus('secure')
    scanInterval.current = setInterval(async () => {
      try {
        const result = await realtimeDeepfakeAlertTriggering({
          audioSegmentDataUri: MOCK_AUDIO_B64,
          videoFrameDataUri: MOCK_VIDEO_B64,
        })
        const newProb = result.deepfakeProbability
        setProbability(newProb * 100)
        setAnalysisText(result.explanation)
        if (newProb > 0.8) setStatus('critical');
        else if (newProb > 0.4) setStatus('warning');
        else setStatus('secure');
      } catch (e) {}
    }, 5000)
  }

  const stopScanning = () => {
    if (scanInterval.current) clearInterval(scanInterval.current)
    setStatus('idle')
    setProbability(0)
    setAnalysisText('Standby for biometric scan...')
  }

  useEffect(() => {
    return () => { if (scanInterval.current) clearInterval(scanInterval.current) }
  }, [])

  return (
    <div className="relative w-full overflow-hidden rounded-[32px] bg-black aspect-video group/shield border border-white/5">
      {/* Background Feed (Visible under glass) */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {isCameraOff ? (
          <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center gap-4 text-zinc-800">
             <Camera className="h-20 w-20 opacity-10" />
             <p className="text-[10px] font-black tracking-[0.5em] uppercase">Private Stream</p>
          </div>
        ) : (
          <>
            <img 
              src="https://picsum.photos/seed/vishwaas-call/1920/1080" 
              alt="Call Feed" 
              className="object-cover w-full h-full opacity-30 grayscale-[0.2]"
            />
            {isActive && <div className="scanline"></div>}
          </>
        )}
      </div>

      {!privacyConsent && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[30px] p-6 text-center animate-in fade-in duration-1000">
          <div className="max-w-md w-full space-y-10 animate-in fade-in zoom-in-95 duration-700">
            <div className="relative h-28 w-28 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 metallic-ring animate-spin-slow opacity-60"></div>
              <div className="h-20 w-20 rounded-full glass-panel flex items-center justify-center border-white/20 shadow-2xl">
                <Fingerprint className="h-10 w-10 text-primary" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-4xl font-black text-white tracking-tighter uppercase">Biometric Entry</h3>
              <p className="text-[#8E8E93] text-lg font-medium leading-relaxed max-w-sm mx-auto">
                Unlock the security layer by granting real-time biometric access. Data remains strictly on-device.
              </p>
            </div>

            <Button 
              onClick={() => {
                setIsActivating(true);
                setTimeout(() => {
                  setPrivacyConsent(true);
                  setIsActivating(false);
                }, 1000);
              }} 
              disabled={isActivating}
              className="w-full h-16 rounded-[24px] bg-white text-black hover:bg-white/90 font-black text-xl shadow-2xl transition-all active:scale-95"
            >
              {isActivating ? <Loader2 className="h-6 w-6 animate-spin" /> : "Unlock Glass Filter"}
            </Button>
            
            <p className="text-[10px] text-[#8E8E93] font-black uppercase tracking-[0.3em]">Hardware-level encryption enabled</p>
          </div>
        </div>
      )}

      <div className="absolute inset-0 p-10 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between items-start">
          <Badge variant={isActive ? "default" : "outline"} className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-full ${isActive ? 'bg-primary text-white border-none' : 'bg-black/40 text-white/60 border-white/10 backdrop-blur-md'}`}>
            {isActive ? <Eye className="h-3 w-3 mr-2" /> : <EyeOff className="h-3 w-3 mr-2" />}
            {isActive ? "Filter On" : "Filter Ready"}
          </Badge>
          
          <div className="bg-black/40 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-md flex items-center gap-3">
            <div className="flex gap-1 h-3 items-center">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className={`w-1 rounded-full bg-primary transition-all duration-300 ${isActive ? 'animate-pulse' : 'h-1 opacity-20'}`} style={{ height: isActive ? `${50 + Math.random() * 50}%` : '4px' }}></div>
               ))}
            </div>
            <Mic className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-zinc-600'}`} />
          </div>
        </div>

        {isActive ? (
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 animate-in slide-in-from-bottom-8 duration-700">
            <div className="glass-panel p-8 max-w-sm pointer-events-auto border-white/20">
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-xl ${status === 'critical' ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'}`}>
                  {status === 'secure' ? <ShieldCheck className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8E8E93]">Risk Integrity</p>
                  <span className="font-black text-2xl text-white">
                    {probability.toFixed(0)}% Accurate
                  </span>
                </div>
              </div>
              <Progress value={probability} className="h-1.5 mb-4 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${status === 'critical' ? 'bg-destructive' : 'bg-primary'}`} style={{ width: `${probability}%` }}></div>
              </Progress>
              <p className="text-xs text-[#8E8E93] leading-relaxed font-bold italic">
                {analysisText}
              </p>
            </div>

            <div className="flex gap-4 pointer-events-auto">
               <Button onClick={() => { setIsActive(false); stopScanning(); }} size="icon" variant="destructive" className="h-16 w-16 rounded-full shadow-2xl bg-destructive hover:bg-destructive/90 transition-transform hover:scale-110">
                 <PhoneOff className="h-7 w-7" />
               </Button>
               <Button onClick={() => setIsCameraOff(!isCameraOff)} size="icon" variant="outline" className={`h-16 w-16 rounded-full glass-panel border-none ${isCameraOff ? 'bg-white text-black' : 'text-white'} transition-all`}>
                 <Camera className="h-7 w-7" />
               </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1">
             <Button 
              onClick={toggleShield}
              className="relative h-32 w-32 rounded-full glass-panel border-white/20 text-white font-black text-xs flex flex-col items-center justify-center gap-3 shadow-[0_0_80px_rgba(0,102,204,0.4)] transition-all hover:scale-110 pointer-events-auto border-2 group/activate"
            >
              <Shield className="h-12 w-12 transition-transform group-hover/activate:scale-110 text-primary" />
              ACTIVATE
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
