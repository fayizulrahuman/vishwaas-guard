'use client';

import { useState } from "react"
import { Shield, Bell, User, LogOut, Settings, Vault, Fingerprint, Mic, ScanFace, TrendingUp, Sparkles, FileAudio, FileVideo } from "lucide-react"
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
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  ResponsiveContainer,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts"

const MOCK_CHART_DATA = [
  { day: '1', frequency: 4 }, { day: '5', frequency: 12 },
  { day: '10', frequency: 8 }, { day: '15', frequency: 18 },
  { day: '20', frequency: 12 }, { day: '25', frequency: 22 },
  { day: '30', frequency: 6 }
];

const VAULT_ITEMS = [
  { id: 1, type: 'audio', name: 'Voice Mimicry Detected', date: 'Oct 12', size: '1.2MB' },
  { id: 2, type: 'video', name: 'Suspicious Zoom Feed', date: 'Oct 10', size: '24.8MB' },
  { id: 3, type: 'audio', name: 'Bank Fraud Attempt', date: 'Oct 08', size: '0.9MB' },
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
    toast({ title: "Secure Wipe Initiated", description: "Clearing local cache and AI inference buffers..." });
    setTimeout(() => {
      localStorage.clear();
      sessionStorage.clear();
      signOut(auth);
      toast({ title: "Session Purged", description: "Your biometric session has been decommissioned." });
    }, 1500);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-[20px]">
      <div className="container max-w-6xl mx-auto px-6 flex h-20 items-center justify-between">
        <div className="flex items-center gap-4 font-black text-white">
          <div className="relative h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
            <div className="absolute inset-0 metallic-ring opacity-20"></div>
            <Shield className="h-7 w-7 text-primary relative z-10" />
          </div>
          <span className="text-xl tracking-tighter uppercase font-black">Vishwaas Guard</span>
        </div>
        
        <div className="flex items-center gap-6">
          <Button 
            onClick={() => toast({ title: "Perimeter Check", description: "Monitoring 4 active streams. Status: Secure." })} 
            variant="ghost" 
            size="icon" 
            className="relative h-11 w-11 rounded-full hover:bg-white/5 transition-all"
          >
            <Bell className="h-5 w-5 text-[#8E8E93]" />
            <span className="absolute top-3 right-3 flex h-2 w-2 rounded-full bg-primary border-2 border-black"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-11 w-11 rounded-full border border-white/20 p-0 hover:ring-2 hover:ring-primary/40 transition-all">
                <Avatar className="h-full w-full">
                  <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/100/100`} />
                  <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72 glass-panel p-2 mt-4 animate-in fade-in slide-in-from-top-4 duration-300" align="end">
              <div className="absolute -top-4 -left-4 h-12 w-12 metallic-ring opacity-30"></div>
              
              <DropdownMenuLabel className="px-4 py-4 text-white">
                <div className="space-y-1.5">
                  <p className="text-sm font-bold leading-none">{user?.displayName || "Security Member"}</p>
                  <div className="flex items-center gap-2">
                    <div className="glow-dot"></div>
                    <p className="active-protection-glow text-[10px] uppercase tracking-[0.2em]">
                      Active Protection
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10 mx-2" />
              <div className="p-1">
                <DropdownMenuItem onClick={() => setProfileOpen(true)} className="rounded-xl px-4 py-3 cursor-pointer font-medium gap-3 text-white focus:bg-white/10 border-b border-white/5 transition-colors">
                  <Settings className="h-4 w-4 text-[#8E8E93]" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setVaultOpen(true)} className="rounded-xl px-4 py-3 cursor-pointer font-medium gap-3 text-white focus:bg-white/10 border-b border-white/5 transition-colors">
                  <Vault className="h-4 w-4 text-[#8E8E93]" />
                  Security Vault
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActivityOpen(true)} className="rounded-xl px-4 py-3 cursor-pointer font-medium gap-3 text-white focus:bg-white/10 transition-colors">
                  <TrendingUp className="h-4 w-4 text-[#8E8E93]" />
                  Activity Analysis
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator className="bg-white/10 mx-2" />
              <div className="p-1">
                <DropdownMenuItem onClick={handleSignOut} className="rounded-xl px-4 py-3 cursor-pointer font-black text-destructive focus:text-destructive focus:bg-destructive/10 gap-3">
                  <LogOut className="h-4 w-4" />
                  Sign Out Securely
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Profile Modal */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="glass-panel max-w-lg p-10 border-white/20 shadow-2xl overflow-hidden">
          <div className="absolute -bottom-20 -right-20 h-40 w-40 metallic-ring opacity-20 rotate-45"></div>
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl font-black text-white flex items-center gap-3">
              <Fingerprint className="h-6 w-6 text-primary" />
              Biometric Filter
            </DialogTitle>
            <DialogDescription className="text-[#8E8E93] font-medium">Manage your hardware-level identity protection.</DialogDescription>
          </DialogHeader>
          <div className="space-y-8 mt-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 rounded-[24px] bg-white/5 border border-white/10">
                <div className="space-y-1">
                  <Label className="text-base font-bold text-white">Voice Print Enrollment</Label>
                  <p className="text-xs text-[#8E8E93]">Unique vocal resonance monitoring.</p>
                </div>
                <Switch checked={voiceEnrollment} onCheckedChange={setVoiceEnrollment} className="data-[state=checked]:bg-[#DFFF00]" />
              </div>
              <div className="flex items-center justify-between p-6 rounded-[24px] bg-white/5 border border-white/10">
                <div className="space-y-1">
                  <Label className="text-base font-bold text-white">Face ID Secondary Check</Label>
                  <p className="text-xs text-[#8E8E93]">Continuous volumetric geometric scan.</p>
                </div>
                <Switch checked={faceIdCheck} onCheckedChange={setFaceIdCheck} className="data-[state=checked]:bg-[#DFFF00]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-14 rounded-[20px] bg-white/5 border-white/10 text-white font-bold gap-2 hover:bg-white/10">
                <Mic className="h-4 w-4" /> Retrain
              </Button>
              <Button variant="outline" className="h-14 rounded-[20px] bg-white/5 border-white/10 text-white font-bold gap-2 hover:bg-white/10">
                <ScanFace className="h-4 w-4" /> Reset
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Vault Modal */}
      <Dialog open={vaultOpen} onOpenChange={setVaultOpen}>
        <DialogContent className="glass-panel max-w-2xl p-10 border-white/20 shadow-2xl overflow-hidden">
          <div className="absolute top-10 left-10 h-64 w-64 sphere-blue opacity-10 pointer-events-none"></div>
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl font-black text-white flex items-center gap-3">
              <Vault className="h-6 w-6 text-primary" />
              Evidence Gallery
            </DialogTitle>
            <DialogDescription className="text-[#8E8E93] font-medium">Encrypted storage for detected deepfake threats.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-6 mt-8">
            {VAULT_ITEMS.map((item) => (
              <div key={item.id} className="group glass-panel p-6 aspect-square flex flex-col items-center justify-center gap-4 hover:bg-white/10 cursor-pointer transition-all">
                <div className="p-4 rounded-full bg-black/40 text-white/40 group-hover:text-primary transition-colors">
                  {item.type === 'audio' ? <FileAudio className="h-8 w-8" /> : <FileVideo className="h-8 w-8" />}
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-white line-clamp-1">{item.name}</p>
                  <p className="text-[10px] text-[#8E8E93] uppercase font-black tracking-widest">{item.size}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Activity Analysis Modal */}
      <Dialog open={activityOpen} onOpenChange={setActivityOpen}>
        <DialogContent className="glass-panel max-w-4xl p-10 border-white/20 shadow-2xl overflow-hidden">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl font-black text-white flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-primary" />
              Intelligence Analysis
            </DialogTitle>
            <DialogDescription className="text-[#8E8E93] font-medium">Deepfake Attempt Frequency over 30 days.</DialogDescription>
          </DialogHeader>
          <div className="h-[400px] w-full mt-12">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_CHART_DATA}>
                <defs>
                  <linearGradient id="colorFreq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066FF" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                <XAxis dataKey="day" stroke="#8E8E93" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#8E8E93" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '16px', 
                    color: '#fff',
                    backdropFilter: 'blur(10px)'
                  }} 
                />
                <Area type="monotone" dataKey="frequency" stroke="#0066FF" strokeWidth={4} fillOpacity={1} fill="url(#colorFreq)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}
