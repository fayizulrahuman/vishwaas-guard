"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Shield, ShieldAlert, ShieldCheck, Eye, EyeOff, Camera, Mic, PhoneOff, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { realtimeDeepfakeAlertTriggering } from '@/ai/flows/realtime-deepfake-alert-triggering'
import { toast } from '@/hooks/use-toast'

// Robust minimal Base64 headers for testing
const MOCK_AUDIO_B64 = "data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YRAAAAAAAAAAAAAAAAAAAAAAAAAA"
const MOCK_VIDEO_B64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="

export function ShieldOverlay() {
  const [isActive, setIsActive] = useState(false)
  const [privacyConsent, setPrivacyConsent] = useState(false)
  const [probability, setProbability] = useState(0)
  const [isScanning, setIsScanning] = useState(false)
  const [status, setStatus] = useState<'idle' | 'secure' | 'warning' | 'critical'>('idle')
  const [analysisText, setAnalysisText] = useState('Standby for biometric scan...')
  const [isCameraOff, setIsCameraOff] = useState(false)
  
  const scanInterval = useRef<NodeJS.Timeout | null>(null)

  const toggleShield = () => {
    if (!privacyConsent) {
      toast({
        title: "Consent Required",
        description: "Please confirm privacy consent before activating the shield.",
        variant: "destructive"
      })
      return
    }
    
    setIsActive(!isActive)
    if (!isActive) {
      startScanning()
      toast({
        title: "Guard Activated",
        description: "Monitoring communication for deepfake signatures.",
      })
    } else {
      stopScanning()
      toast({
        title: "Guard Deactivated",
        description: "Scanning has been paused.",
      })
    }
  }

  const startScanning = () => {
    setIsScanning(true)
    setStatus('secure')
    setAnalysisText('Analyzing voice biometric markers...')
    
    scanInterval.current = setInterval(async () => {
      try {
        const result = await realtimeDeepfakeAlertTriggering({
          audioSegmentDataUri: MOCK_AUDIO_B64,
          videoFrameDataUri: MOCK_VIDEO_B64,
          contextualInfo: "User is in a high-risk financial video call."
        })
        
        const newProb = result.deepfakeProbability
        setProbability(newProb * 100)
        setAnalysisText(result.explanation)
        
        if (newProb > 0.8) {
          setStatus('critical')
          toast({
            title: "CRITICAL ALERT",
            description: "High deepfake probability detected! End call immediately.",
            variant: "destructive"
          })
        } else if (newProb > 0.4) {
          setStatus('warning')
        } else {
          setStatus('secure')
        }
      } catch (e) {
        // Errors are handled by the global listener but we log for local awareness
        console.warn("Analysis cycle skip due to network or logic error.")
      }
    }, 5000)
  }

  const stopScanning = () => {
    if (scanInterval.current) clearInterval(scanInterval.current)
    setIsScanning(false)
    setStatus('idle')
    setProbability(0)
    setAnalysisText('Standby for biometric scan...')
  }

  const handleEndCall = () => {
    toast({
      title: "Call Terminated",
      description: "Connection closed safely by Vishwaas Guard.",
      variant: "destructive"
    })
    stopScanning()
    setIsActive(false)
  }

  const toggleCamera = () => {
    setIsCameraOff(!isCameraOff)
    toast({
      title: isCameraOff ? "Camera On" : "Privacy Mode Active",
      description: isCameraOff ? "Video feed restored." : "Video feed masked for privacy.",
    })
  }

  useEffect(() => {
    return () => { if (scanInterval.current) clearInterval(scanInterval.current) }
  }, [])

  return (
    <div className="relative w-full overflow-hidden rounded-[1.5rem] md:rounded-[2.2rem] bg-slate-950 aspect-[16/10] md:aspect-video shadow-2xl group/shield">
      {!privacyConsent && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-6 text-center">
          <div className="max-w-sm space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-primary/20 p-4 rounded-3xl w-fit mx-auto">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white tracking-tight">Biometric Consent</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                To detect deepfakes, Vishwaas Guard analyzes camera and audio markers in real-time. 
                Data is processed locally and never stored.
              </p>
            </div>
            <Button onClick={() => setPrivacyConsent(true)} className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20">
              Grant Secure Access
            </Button>
          </div>
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {isCameraOff ? (
          <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center gap-4 text-slate-700">
             <Camera className="h-16 w-16 opacity-10" />
             <p className="text-[10px] font-black tracking-[0.3em] uppercase">Private Feed</p>
          </div>
        ) : (
          <>
            <img 
              src="https://picsum.photos/seed/vishwaas-call/1280/720" 
              alt="Call Feed" 
              className="object-cover w-full h-full opacity-40 grayscale-[0.2] transition-opacity duration-700"
              data-ai-hint="video call"
            />
            {isActive && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="scanline"></div>
                <div className="absolute inset-0 border-[20px] border-primary/5"></div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <Badge variant={isActive ? "default" : "secondary"} className={`flex gap-1.5 items-center px-3 py-1 text-[10px] font-black uppercase tracking-widest ${isActive ? 'bg-primary text-white border-none shadow-lg shadow-primary/20' : 'bg-black/40 text-white/60 border-white/10 backdrop-blur-md'}`}>
              {isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              {isActive ? "Shield Active" : "Shield Standby"}
            </Badge>
            {isActive && !isCameraOff && (
              <Badge variant="outline" className="bg-black/20 text-white/80 border-white/10 text-[9px] font-bold tracking-widest uppercase animate-pulse w-fit">
                Liveness Scan: ON
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3 bg-black/40 p-2.5 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="flex gap-1 h-4 items-center">
               {[1,2,3,4,5,6].map(i => (
                 <div key={i} className={`w-1 rounded-full bg-primary transition-all duration-300 ${isActive ? 'animate-pulse' : 'h-1.5 opacity-20'}`} style={{ height: isActive ? `${40 + Math.random() * 60}%` : '6px', opacity: 0.5 + (i * 0.1) }}></div>
               ))}
            </div>
            <Mic className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-slate-600'}`} />
          </div>
        </div>

        {isActive ? (
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 animate-in slide-in-from-bottom-4 duration-500">
            <Card className="p-5 md:p-6 bg-black/60 border-white/20 backdrop-blur-xl text-white max-w-sm pointer-events-auto rounded-3xl shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-xl ${status === 'critical' ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'}`}>
                  {status === 'secure' && <ShieldCheck className="h-5 w-5" />}
                  {status === 'warning' && <AlertTriangle className="h-5 w-5" />}
                  {status === 'critical' && <ShieldAlert className="h-5 w-5" />}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Risk Assessment</p>
                  <span className="font-bold text-lg md:text-xl">
                    {probability.toFixed(0)}% Probability
                  </span>
                </div>
              </div>
              <Progress value={probability} className="h-1.5 mb-4 bg-white/10 overflow-hidden rounded-full">
                <div className={`h-full transition-all duration-500 ${status === 'critical' ? 'bg-destructive' : 'bg-primary'}`} style={{ width: `${probability}%` }}></div>
              </Progress>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {analysisText}
              </p>
            </Card>

            <div className="flex gap-3 pointer-events-auto">
               <Button onClick={handleEndCall} size="icon" variant="destructive" className="h-14 w-14 rounded-full shadow-2xl hover:scale-110 transition-transform bg-destructive hover:bg-destructive/90">
                 <PhoneOff className="h-6 w-6" />
               </Button>
               <Button onClick={toggleCamera} size="icon" variant="secondary" className={`h-14 w-14 rounded-full backdrop-blur-xl border-none ${isCameraOff ? 'bg-white text-slate-900' : 'bg-white/10 text-white'} hover:bg-white/20 transition-all`}>
                 <Camera className="h-6 w-6" />
               </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1">
             <Button 
              onClick={toggleShield}
              className="group/btn relative h-28 w-28 md:h-32 md:w-32 rounded-full bg-primary/10 hover:bg-primary/20 backdrop-blur-2xl border-4 border-primary/40 text-primary font-black text-xs md:text-sm flex flex-col items-center justify-center gap-2 shadow-[0_0_50px_rgba(0,102,204,0.3)] transition-all hover:scale-105 pointer-events-auto"
            >
              <Shield className="h-10 w-10 md:h-12 md:w-12 transition-transform group-hover/btn:scale-110" />
              ACTIVATE
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
