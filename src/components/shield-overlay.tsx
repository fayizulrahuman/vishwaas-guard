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
    <div className="relative w-full overflow-hidden rounded-[24px] md:rounded-[40px] bg-black aspect-square md:aspect-video group/shield border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
      {/* Background Feed (Visible under glass) */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {isCameraOff ? (
          <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center gap-4 md:gap-6 text-zinc-800">
             <Camera className="h-16 w-16 md:h-24 md:w-24 opacity-10" />
             <p className="text-[8px] md:text-[10px] font-black tracking-[0.4em] md:tracking-[0.6em] uppercase text-zinc-700">Private Stream Encrypted</p>
          </div>
        ) : (
          <>
            <img 
              src="https://picsum.photos/seed/vishwaas-call/1920/1080" 
              alt="Call Feed" 
              className="object-cover w-full h-full opacity-40 grayscale-[0.3]"
            />
            {isActive && <div className="scanline"></div>}
          </>
        )}
      </div>

      {!privacyConsent && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[40px] md:backdrop-blur-[60px] p-6 md:p-8 text-center animate-in fade-in duration-1000">
          <div className="max-w-md w-full space-y-8 md:space-y-12 animate-in fade-in zoom-in-95 duration-1000 frosted-glass p-8 md:p-12 rounded-[40px]">
            <div className="relative h-24 w-24 md:h-32 md:w-32 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 metallic-ring animate-spin-slow opacity-60"></div>
              <div className="h-16 w-16 md:h-24 md:w-24 rounded-full bg-white/5 flex items-center justify-center border-white/30 shadow-[0_0_40px_rgba(0,102,255,0.3)]">
                <Fingerprint className="h-8 w-8 md:h-12 md:w-12 text-primary drop-shadow-[0_0_8px_rgba(0,102,255,0.8)]" />
              </div>
            </div>
            
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase leading-tight">Biometric Entry</h3>
              <p className="text-sm md:text-lg text-[#8E8E93] font-medium leading-relaxed max-w-sm mx-auto">
                Unlock the security layer by granting real-time biometric access. Data remains strictly on-device.
              </p>
            </div>

            <Button 
              onClick={() => {
                setIsActivating(true);
                setTimeout(() => {
                  setPrivacyConsent(true);
                  setIsActivating(false);
                }, 1200);
              }} 
              disabled={isActivating}
              className="w-full h-14 md:h-16 rounded-[20px] md:rounded-[28px] bg-white text-black hover:bg-white/90 font-black text-lg md:text-xl shadow-[0_24px_48px_rgba(255,255,255,0.2)] transition-all active:scale-95"
            >
              {isActivating ? <Loader2 className="h-6 w-6 animate-spin" /> : "Unlock Glass Filter"}
            </Button>
            
            <p className="text-[8px] md:text-[10px] text-[#8E8E93] font-black uppercase tracking-[0.4em]">Hardware-level encryption enabled</p>
          </div>
        </div>
      )}

      <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between items-start">
          <Badge variant={isActive ? "default" : "outline"} className={`px-4 md:px-5 py-2 md:py-2.5 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] rounded-full backdrop-blur-3xl shadow-2xl ${isActive ? 'bg-primary text-white border-none' : 'bg-black/40 text-white/60 border-white/20'}`}>
            {isActive ? <Eye className="h-3 w-3 mr-2 md:mr-3" /> : <EyeOff className="h-3 w-3 mr-2 md:mr-3" />}
            {isActive ? "Active" : "Standby"}
          </Badge>
          
          <div className="bg-black/40 px-4 md:px-5 py-2 md:py-2.5 rounded-[16px] md:rounded-[20px] border border-white/20 backdrop-blur-3xl flex items-center gap-3 md:gap-4 shadow-xl">
            <div className="flex gap-1 h-3 md:h-4 items-center">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className={`w-1 md:w-1.5 rounded-full bg-primary transition-all duration-300 ${isActive ? 'animate-pulse' : 'h-1 opacity-20'}`} style={{ height: isActive ? `${60 + Math.random() * 40}%` : '4px' }}></div>
               ))}
            </div>
            <Mic className={`h-4 w-4 md:h-5 md:h-5 ${isActive ? 'text-primary' : 'text-zinc-600'}`} />
          </div>
        </div>

        {isActive ? (
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 md:gap-10 animate-in slide-in-from-bottom-12 duration-1000">
            <div className="frosted-glass p-5 md:p-8 w-full md:max-w-sm pointer-events-auto border-white/30 shadow-[0_32px_64px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-4 md:gap-5 mb-4 md:mb-6">
                <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl ${status === 'critical' ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'} border border-white/10`}>
                  {status === 'secure' ? <ShieldCheck className="h-6 w-6 md:h-7 md:w-7" /> : <AlertTriangle className="h-6 w-6 md:h-7 md:w-7" />}
                </div>
                <div className="space-y-0.5">
                  <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-[#8E8E93]">Risk Integrity</p>
                  <span className="font-black text-2xl md:text-3xl text-white tracking-tighter">
                    {probability.toFixed(0)}% Precise
                  </span>
                </div>
              </div>
              <Progress value={probability} className="h-2 mb-4 md:mb-6 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div className={`h-full transition-all duration-1000 ${status === 'critical' ? 'bg-destructive shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-primary shadow-[0_0_15px_rgba(0,102,255,0.5)]'}`} style={{ width: `${probability}%` }}></div>
              </Progress>
              <p className="text-[10px] md:text-xs text-white/80 leading-relaxed font-bold italic tracking-tight">
                {analysisText}
              </p>
            </div>

            <div className="flex gap-4 md:gap-5 pointer-events-auto">
               <Button onClick={() => { setIsActive(false); stopScanning(); }} size="icon" variant="destructive" className="h-16 w-16 md:h-20 md:w-20 rounded-full shadow-[0_20px_40px_rgba(239,68,68,0.3)] bg-destructive hover:bg-destructive/90 transition-all hover:scale-110 active:scale-95">
                 <PhoneOff className="h-6 w-6 md:h-8 md:w-8" />
               </Button>
               <Button onClick={() => setIsCameraOff(!isCameraOff)} size="icon" variant="outline" className={`h-16 w-16 md:h-20 md:w-20 rounded-full frosted-glass border-white/20 ${isCameraOff ? 'bg-white text-black' : 'text-white'} transition-all hover:scale-110 active:scale-95`}>
                 <Camera className="h-6 w-6 md:h-8 md:w-8" />
               </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1">
             <Button 
              onClick={toggleShield}
              className="relative h-28 w-28 md:h-40 md:w-40 rounded-full frosted-glass border-white/30 text-white font-black text-[8px] md:text-[10px] flex flex-col items-center justify-center gap-3 md:gap-4 shadow-[0_0_100px_rgba(0,102,255,0.5)] transition-all hover:scale-110 active:scale-90 pointer-events-auto group/activate"
            >
              <div className="absolute inset-0 metallic-ring opacity-20 group-hover/activate:opacity-50 animate-spin-slow"></div>
              <Shield className="h-10 w-10 md:h-16 md:w-16 transition-transform group-hover/activate:scale-110 text-primary drop-shadow-[0_0_12px_rgba(0,102,255,0.8)]" />
              <span className="tracking-[0.3em] md:tracking-[0.5em] uppercase">Activate</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
