'use client';

import { useState } from "react"
import { Shield, Bell, User, LogOut, Settings, Vault, Activity, Fingerprint, Mic, ScanFace, Lock, FileAudio, FileVideo, TrendingUp, History, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAuth, useUser } from "@/firebase"
import { signOut } from "firebase/auth"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart,
  Defs,
  LinearGradient,
  Stop
} from "recharts"

const MOCK_CHART_DATA = [
  { day: '1', frequency: 4 }, { day: '5', frequency: 2 }, { day: '10', frequency: 8 },
  { day: '15', frequency: 5 }, { day: '20', frequency: 12 }, { day: '25', frequency: 7 },
  { day: '30', frequency: 3 }
];

const VAULT_ITEMS = [
  { id: 1, type: 'audio', name: 'Scam Call 09-04', date: 'Apr 9', size: '1.2MB' },
  { id: 2, type: 'video', name: 'Deepfake Meeting', date: 'Apr 8', size: '14.5MB' },
  { id: 3, type: 'audio', name: 'Voice Phishing', date: 'Apr 5', size: '0.8MB' },
  { id: 4, type: 'audio', name: 'Unknown AI Bank', date: 'Apr 2', size: '2.1MB' },
  { id: 5, type: 'video', name: 'Glitched Video ID', date: 'Mar 28', size: '8.4MB' },
  { id: 6, type: 'audio', name: 'Crisis Mimicry', date: 'Mar 25', size: '1.5MB' },
];

export function VishwaasHeader() {
  const auth = useAuth();
  const { user } = useUser();
  
  const [profileOpen, setProfileOpen] = useState(false);
  const [vaultOpen, setVaultOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);

  const [voiceEnrollment, setVoiceEnrollment] = useState(true);
  const [faceIdCheck, setFaceIdCheck] = useState(false);

  const handleSignOut = () => {
    toast({
      title: "Secure Wipe Initiated",
      description: "Clearing local cache and AI inference buffers...",
    });

    setTimeout(() => {
      // Secure Wipe logic
      localStorage.clear();
      sessionStorage.clear();
      signOut(auth);
      toast({
        title: "Session Purged",
        description: "Your biometric session has been fully decommissioned.",
      });
    }, 1500);
  };

  const handleNotifications = () => {
    toast({
      title: "Security Perimeter",
      description: "Monitoring 4 active communication streams. Status: Secure.",
    });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-xl">
      <div className="container max-w-6xl mx-auto px-4 flex h-16 md:h-20 items-center justify-between">
        <div className="flex items-center gap-2.5 font-black text-foreground">
          <div className="bg-primary p-1.5 rounded-lg shadow-lg shadow-primary/20">
            <Shield className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </div>
          <span className="text-base md:text-xl tracking-tight uppercase font-semibold">Vishwaas Guard</span>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <Button 
            onClick={handleNotifications} 
            variant="ghost" 
            size="icon" 
            className="relative h-10 w-10 md:h-11 md:w-11 rounded-full hover:bg-white/5 transition-colors"
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-2.5 right-2.5 flex h-2 w-2 rounded-full bg-primary border-2 border-black shadow-sm"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 md:h-11 md:w-11 rounded-full border border-white/10 overflow-hidden p-0 ring-offset-background transition-all hover:ring-2 hover:ring-primary/20">
                <Avatar className="h-full w-full">
                  <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/100/100`} alt="User" />
                  <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 rounded-[1.5rem] p-2 shadow-2xl bg-card border-border backdrop-blur-xl" align="end" forceMount>
              <DropdownMenuLabel className="font-normal px-4 py-3 text-foreground">
                <div className="flex flex-col space-y-1.5">
                  <p className="text-sm font-semibold leading-none">{user?.displayName || (user?.isAnonymous ? "Guest User" : "Security Member")}</p>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-green"></div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-[#8E8E93]">
                      Active Protection
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5 mx-2" />
              <div className="p-1">
                <DropdownMenuItem 
                  onClick={() => setProfileOpen(true)}
                  className="rounded-xl px-4 py-2.5 cursor-pointer font-medium gap-3 focus:bg-primary/10 text-foreground"
                >
                  <Settings className="h-4 w-4 text-[#8E8E93]" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setVaultOpen(true)}
                  className="rounded-xl px-4 py-2.5 cursor-pointer font-medium gap-3 focus:bg-primary/10 text-foreground"
                >
                  <Vault className="h-4 w-4 text-[#8E8E93]" />
                  Security Vault
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setActivityOpen(true)}
                  className="rounded-xl px-4 py-2.5 cursor-pointer font-medium gap-3 focus:bg-primary/10 text-foreground"
                >
                  <TrendingUp className="h-4 w-4 text-[#8E8E93]" />
                  Activity Analysis
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator className="bg-white/5 mx-2" />
              <div className="p-1">
                <DropdownMenuItem 
                  onClick={handleSignOut} 
                  className="rounded-xl px-4 py-2.5 cursor-pointer font-bold text-destructive focus:text-destructive focus:bg-destructive/10 gap-3"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out Securely
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* --- Profile Settings: Biometric Management --- */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="bg-card/90 border-white/10 rounded-[2rem] max-w-md sm:max-w-lg backdrop-blur-xl p-0 overflow-hidden shadow-2xl">
          <div className="p-8 space-y-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold flex items-center gap-3 text-white">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Fingerprint className="h-6 w-6" />
                </div>
                Biometric Settings
              </DialogTitle>
              <DialogDescription className="text-[#8E8E93] text-sm font-medium">
                Manage your hardware-level identity protection.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <Card className="bg-white/5 border-white/5 rounded-2xl overflow-hidden backdrop-blur-md">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-semibold text-white">Voice Print Enrollment</Label>
                      <p className="text-xs text-[#8E8E93]">Analyzes unique vocal resonance patterns.</p>
                    </div>
                    <Switch checked={voiceEnrollment} onCheckedChange={setVoiceEnrollment} />
                  </div>
                  <DropdownMenuSeparator className="bg-white/5" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-semibold text-white">Face ID Secondary Check</Label>
                      <p className="text-xs text-[#8E8E93]">Enforces a liveness check during active calls.</p>
                    </div>
                    <Switch checked={faceIdCheck} onCheckedChange={setFaceIdCheck} />
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="outline" className="h-12 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 text-white font-semibold gap-2">
                  <Mic className="h-4 w-4 text-primary" />
                  Retrain Voice
                </Button>
                <Button variant="outline" className="h-12 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 text-white font-semibold gap-2">
                  <ScanFace className="h-4 w-4 text-primary" />
                  Reset Face Map
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- Security Vault: Evidence Gallery --- */}
      <Dialog open={vaultOpen} onOpenChange={setVaultOpen}>
        <DialogContent className="bg-card/90 border-white/10 rounded-[2rem] max-w-2xl backdrop-blur-xl p-0 overflow-hidden shadow-2xl">
          <div className="p-8 space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold flex items-center gap-3 text-white">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                  <Vault className="h-6 w-6" />
                </div>
                Evidence Vault
              </DialogTitle>
              <DialogDescription className="text-[#8E8E93] text-sm font-medium">
                Encrypted storage for suspicious biometric events.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {VAULT_ITEMS.map((item) => (
                <div key={item.id} className="group relative aspect-square bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-3 p-4 transition-all hover:bg-white/10 hover:border-primary/40 cursor-pointer">
                  <div className="p-3 rounded-full bg-black/40 text-white/40 group-hover:text-primary transition-colors">
                    {item.type === 'audio' ? <FileAudio className="h-6 w-6" /> : <FileVideo className="h-6 w-6" />}
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-white line-clamp-1">{item.name}</p>
                    <p className="text-[9px] text-[#8E8E93] uppercase font-bold tracking-widest">{item.date} • {item.size}</p>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Lock className="h-3 w-3 text-[#8E8E93]" />
                  </div>
                </div>
              ))}
            </div>
            
            <Button className="w-full h-12 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black shadow-lg shadow-amber-500/20">
              Export Evidence Package
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- Activity Analysis: Data Visualization --- */}
      <Dialog open={activityOpen} onOpenChange={setActivityOpen}>
        <DialogContent className="bg-card/90 border-white/10 rounded-[2rem] max-w-3xl backdrop-blur-xl p-0 overflow-hidden shadow-2xl">
          <div className="p-8 space-y-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold flex items-center gap-3 text-white">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                  <TrendingUp className="h-6 w-6" />
                </div>
                Deepfake Metrics
              </DialogTitle>
              <DialogDescription className="text-[#8E8E93] text-sm font-medium">
                Deepfake Attempt Frequency over the last 30 days.
              </DialogDescription>
            </DialogHeader>

            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_CHART_DATA}>
                  <defs>
                    <linearGradient id="colorFreq" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#8E8E93" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    label={{ value: 'Last 30 Days', position: 'insideBottom', offset: -5, fill: '#8E8E93', fontSize: 10 }}
                  />
                  <YAxis stroke="#8E8E93" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1A1A1E', border: '1px solid #ffffff10', borderRadius: '12px' }}
                    itemStyle={{ color: '#F5F5F7', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="frequency" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorFreq)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Total Attempts", value: "34", change: "+12%" },
                { label: "Prevented", value: "33", change: "97%" },
                { label: "Avg. Risk Score", value: "8%", change: "-2%" },
              ].map((stat, i) => (
                <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/5 text-center">
                  <p className="text-[10px] uppercase font-black tracking-widest text-[#8E8E93] mb-1">{stat.label}</p>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                  <p className="text-[10px] text-emerald-500 font-bold mt-1">{stat.change}</p>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}