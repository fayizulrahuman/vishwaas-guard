"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Shield, ShieldAlert, ShieldCheck, Eye, EyeOff, Camera, Mic, PhoneOff, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { realtimeDeepfakeAlertTriggering } from '@/ai/flows/realtime-deepfake-alert-triggering'
import { toast } from '@/hooks/use-toast'

export function ShieldOverlay() {
  const [isActive, setIsActive] = useState(false)
  const [privacyConsent, setPrivacyConsent] = useState(false)
  const [probability, setProbability] = useState(0)
  const [isScanning, setIsScanning] = useState(false)
  const [status, setStatus] = useState<'idle' | 'secure' | 'warning' | 'critical'>('idle')
  const [analysisText, setAnalysisText] = useState('Standby for scan...')
  
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
    } else {
      stopScanning()
    }
  }

  const startScanning = () => {
    setIsScanning(true)
    setStatus('secure')
    setAnalysisText('Analyzing voice biometric markers...')
    
    // Simulate real-time GenAI analysis cycles
    scanInterval.current = setInterval(async () => {
      // In a real app, we would capture actual media data URIs here
      const mockAudio = "data:audio/wav;base64,UklGRi..."
      const mockVideo = "data:image/jpeg;base64,/9j/4AAQ..."
      
      try {
        const result = await realtimeDeepfakeAlertTriggering({
          audioSegmentDataUri: mockAudio,
          videoFrameDataUri: mockVideo,
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
        console.error("Analysis failed", e)
      }
    }, 4000)
  }

  const stopScanning = () => {
    if (scanInterval.current) clearInterval(scanInterval.current)
    setIsScanning(false)
    setStatus('idle')
    setProbability(0)
    setAnalysisText('Standby for scan...')
  }

  useEffect(() => {
    return () => { if (scanInterval.current) clearInterval(scanInterval.current) }
  }, [])

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-2xl border-4 bg-slate-900 aspect-video shadow-2xl">
      {/* Privacy Consent Layer */}
      {!privacyConsent && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 p-6 text-center">
          <div className="max-w-md space-y-4">
            <Shield className="mx-auto h-12 w-12 text-accent" />
            <h3 className="text-xl font-bold text-white">Privacy Consent Required</h3>
            <p className="text-slate-300 text-sm">
              To detect deepfakes, Vishwaas Guard needs to analyze segments of your camera and audio feed. 
              Data is processed securely and is not stored permanently.
            </p>
            <Button onClick={() => setPrivacyConsent(true)} className="w-full bg-primary hover:bg-primary/90">
              I Grant Permission
            </Button>
          </div>
        </div>
      )}

      {/* Camera Feed Simulator */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <img 
          src="https://picsum.photos/seed/vishwaas-call/1280/720" 
          alt="Call Feed" 
          className="object-cover w-full h-full opacity-50 grayscale-[0.3]"
          data-ai-hint="video call"
        />
        {isActive && <div className="scanline"></div>}
      </div>

      {/* HUD Overlay */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <Badge variant={isActive ? "default" : "secondary"} className={`flex gap-1 items-center ${isActive ? 'bg-accent text-accent-foreground' : ''}`}>
              {isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              {isActive ? "Shield Active" : "Shield Standby"}
            </Badge>
            {isActive && (
              <Badge variant="outline" className="bg-black/40 text-white border-white/20 animate-pulse">
                REC • Liveness Scan: ON
              </Badge>
            )}
          </div>
          
          <div className="flex flex-col items-end gap-2">
             <div className="flex items-center gap-2 bg-black/40 p-2 rounded-lg border border-white/10 backdrop-blur-sm">
                <Mic className={`h-4 w-4 ${isActive ? 'text-accent' : 'text-slate-400'}`} />
                <div className="flex gap-1 h-3 items-end">
                   {[1,2,3,4,5].map(i => (
                     <div key={i} className={`w-1 rounded-full bg-accent transition-all duration-150 ${isActive ? 'animate-bounce' : 'h-1 opacity-20'}`} style={{ height: isActive ? `${Math.random() * 100}%` : '4px', animationDelay: `${i * 0.1}s` }}></div>
                   ))}
                </div>
             </div>
          </div>
        </div>

        {isActive && (
          <div className="flex justify-between items-end gap-4">
            <Card className="p-4 bg-black/60 border-white/20 backdrop-blur-md text-white max-w-sm pointer-events-auto">
              <div className="flex items-center gap-2 mb-2">
                {status === 'secure' && <ShieldCheck className="text-accent h-5 w-5" />}
                {status === 'warning' && <AlertTriangle className="text-yellow-400 h-5 w-5" />}
                {status === 'critical' && <ShieldAlert className="text-destructive h-5 w-5" />}
                <span className="font-bold text-sm uppercase tracking-wider">
                  Deepfake Risk: {probability.toFixed(0)}%
                </span>
              </div>
              <Progress value={probability} className="h-2 mb-3 bg-white/10" />
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{analysisText}"
              </p>
            </Card>

            <div className="flex gap-2 pointer-events-auto">
               <Button size="icon" variant="destructive" className="h-12 w-12 rounded-full shadow-lg">
                 <PhoneOff className="h-6 w-6" />
               </Button>
               <Button size="icon" variant="secondary" className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur border-none text-white">
                 <Camera className="h-6 w-6" />
               </Button>
            </div>
          </div>
        )}
      </div>

      {/* Control Bar Overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
        {!isActive && privacyConsent && (
          <Button 
            onClick={toggleShield}
            size="lg" 
            className="rounded-full h-24 w-24 bg-primary/20 hover:bg-primary/40 backdrop-blur-xl border-4 border-accent text-accent font-bold text-lg flex flex-col items-center justify-center gap-1 shadow-[0_0_30px_rgba(79,216,242,0.4)]"
          >
            <Shield className="h-8 w-8" />
            GUARD
          </Button>
        )}
      </div>

      {isActive && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2">
           <Button 
            onClick={toggleShield}
            variant="ghost" 
            className="text-white bg-black/40 hover:bg-black/60 rounded-full px-4 h-8 border border-white/10 text-xs"
           >
             Deactivate Shield
           </Button>
        </div>
      )}
    </div>
  )
}