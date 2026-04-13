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
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-[40px] shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      <div className="container max-w-6xl mx-auto px-6 flex h-24 items-center justify-between">
        <div className="flex items-center gap-6 font-black text-white">
          <div className="relative h-14 w-14 rounded-[1.25rem] bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl backdrop-blur-3xl">
            <div className="absolute inset-0 metallic-ring opacity-20"></div>
            <Shield className="h-8 w-8 text-primary relative z-10 drop-shadow-[0_0_10px_rgba(0,102,255,0.8)]" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl tracking-tighter uppercase font-black leading-none">Vishwaas Guard</span>
            <span className="text-[9px] uppercase tracking-[0.5em] text-[#8E8E93] mt-1">Intelligence Perimeter</span>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <Button 
            onClick={() => toast({ title: "Perimeter Check", description: "Monitoring 4 active streams. Status: Secure." })} 
            variant="ghost" 
            size="icon" 
            className="relative h-12 w-12 rounded-full hover:bg-white/10 transition-all active:scale-95"
          >
            <Bell className="h-6 w-6 text-[#8E8E93]" />
            <span className="absolute top-3.5 right-3.5 flex h-2.5 w-2.5 rounded-full bg-primary border-2 border-black"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-12 w-12 rounded-full border border-white/20 p-0 hover:ring-2 hover:ring-primary/40 transition-all active:scale-95">
                <Avatar className="h-full w-full">
                  <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/100/100`} />
                  <AvatarFallback className="bg-white/5 text-white"><User className="h-6 w-6" /></AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 frosted-glass p-3 mt-6 animate-in fade-in slide-in-from-top-6 duration-500 border-white/20 shadow-[0_32px_64px_rgba(0,0,0,0.6)]" align="end">
              <div className="absolute -top-6 -left-6 h-14 w-14 metallic-ring opacity-30"></div>
              
              <DropdownMenuLabel className="px-5 py-6 text-white">
                <div className="space-y-2">
                  <p className="text-base font-bold leading-none">{user?.displayName || "Security Member"}</p>
                  <div className="flex items-center gap-3">
                    <div className="glow-dot scale-125"></div>
                    <p className="active-protection-glow text-[10px] uppercase tracking-[0.3em]">
                      Active Protection
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10 mx-2" />
              <div className="p-2 space-y-1">
                <DropdownMenuItem onClick={() => setProfileOpen(true)} className="rounded-2xl px-5 py-4 cursor-pointer font-medium gap-4 text-white focus:bg-white/10 transition-colors">
                  <Settings className="h-5 w-5 text-[#8E8E93]" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setVaultOpen(true)} className="rounded-2xl px-5 py-4 cursor-pointer font-medium gap-4 text-white focus:bg-white/10 transition-colors">
                  <Vault className="h-5 w-5 text-[#8E8E93]" />
                  Security Vault
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActivityOpen(true)} className="rounded-2xl px-5 py-4 cursor-pointer font-medium gap-4 text-white focus:bg-white/10 transition-colors">
                  <TrendingUp className="h-5 w-5 text-[#8E8E93]" />
                  Activity Analysis
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator className="bg-white/10 mx-2" />
              <div className="p-2">
                <DropdownMenuItem onClick={handleSignOut} className="rounded-2xl px-5 py-4 cursor-pointer font-black text-destructive focus:text-destructive focus:bg-destructive/10 gap-4 transition-all">
                  <LogOut className="h-5 w-5" />
                  Sign Out Securely
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Profile Modal */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="frosted-glass max-w-lg p-12 border-white/30 shadow-[0_0_100px_rgba(0,102,255,0.2)] overflow-hidden">
          <div className="absolute -bottom-24 -right-24 h-48 w-48 metallic-ring opacity-20 rotate-45 pointer-events-none"></div>
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-3xl font-black text-white flex items-center gap-4">
              <Fingerprint className="h-8 w-8 text-primary drop-shadow-[0_0_8px_rgba(0,102,255,0.8)]" />
              Biometric Filter
            </DialogTitle>
            <DialogDescription className="text-[#8E8E93] font-medium text-lg leading-relaxed">Manage your hardware-level identity protection.</DialogDescription>
          </DialogHeader>
          <div className="space-y-10 mt-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-3xl shadow-inner">
                <div className="space-y-1">
                  <Label className="text-lg font-bold text-white">Voice Print Enrollment</Label>
                  <p className="text-xs text-[#8E8E93] tracking-tight">Unique vocal resonance monitoring.</p>
                </div>
                <Switch checked={voiceEnrollment} onCheckedChange={setVoiceEnrollment} className="data-[state=checked]:bg-[#DFFF00]" />
              </div>
              <div className="flex items-center justify-between p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-3xl shadow-inner">
                <div className="space-y-1">
                  <Label className="text-lg font-bold text-white">Face ID Secondary Check</Label>
                  <p className="text-xs text-[#8E8E93] tracking-tight">Continuous volumetric geometric scan.</p>
                </div>
                <Switch checked={faceIdCheck} onCheckedChange={setFaceIdCheck} className="data-[state=checked]:bg-[#DFFF00]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Button variant="outline" className="h-16 rounded-[24px] bg-white/5 border-white/10 text-white font-black text-xs uppercase tracking-[0.2em] gap-3 hover:bg-white/10 transition-all active:scale-95">
                <Mic className="h-5 w-5" /> Retrain
              </Button>
              <Button variant="outline" className="h-16 rounded-[24px] bg-white/5 border-white/10 text-white font-black text-xs uppercase tracking-[0.2em] gap-3 hover:bg-white/10 transition-all active:scale-95">
                <ScanFace className="h-5 w-5" /> Reset
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Vault Modal */}
      <Dialog open={vaultOpen} onOpenChange={setVaultOpen}>
        <DialogContent className="frosted-glass max-w-2xl p-12 border-white/30 shadow-2xl overflow-hidden">
          <div className="absolute top-10 left-10 h-80 w-80 sphere-blue opacity-10 pointer-events-none"></div>
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-3xl font-black text-white flex items-center gap-4">
              <Vault className="h-8 w-8 text-primary" />
              Evidence Gallery
            </DialogTitle>
            <DialogDescription className="text-[#8E8E93] font-medium text-lg leading-relaxed">Encrypted storage for detected deepfake threats.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-8 mt-12">
            {VAULT_ITEMS.map((item) => (
              <div key={item.id} className="group frosted-glass p-8 aspect-square flex flex-col items-center justify-center gap-6 hover:bg-white/10 cursor-pointer transition-all active:scale-95 border-white/10 shadow-lg">
                <div className="p-5 rounded-full bg-black/40 text-white/40 group-hover:text-primary transition-colors border border-white/5 shadow-inner">
                  {item.type === 'audio' ? <FileAudio className="h-10 w-10" /> : <FileVideo className="h-10 w-10" />}
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-black text-white line-clamp-1 tracking-tight">{item.name}</p>
                  <p className="text-[10px] text-[#8E8E93] uppercase font-black tracking-[0.3em]">{item.size}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Activity Analysis Modal */}
      <Dialog open={activityOpen} onOpenChange={setActivityOpen}>
        <DialogContent className="frosted-glass max-w-4xl p-12 border-white/30 shadow-2xl overflow-hidden">
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-3xl font-black text-white flex items-center gap-4">
              <TrendingUp className="h-8 w-8 text-primary" />
              Intelligence Analysis
            </DialogTitle>
            <DialogDescription className="text-[#8E8E93] font-medium text-lg leading-relaxed">Deepfake Attempt Frequency over 30 days.</DialogDescription>
          </DialogHeader>
          <div className="h-[450px] w-full mt-16 p-8 bg-black/40 rounded-[40px] border border-white/10 shadow-inner backdrop-blur-3xl">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_CHART_DATA}>
                <defs>
                  <linearGradient id="colorFreq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066FF" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
                <XAxis dataKey="day" stroke="#8E8E93" fontSize={11} axisLine={false} tickLine={false} tickMargin={15} />
                <YAxis stroke="#8E8E93" fontSize={11} axisLine={false} tickLine={false} tickMargin={15} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(0,0,0,0.85)', 
                    border: '1px solid rgba(255,255,255,0.15)', 
                    borderRadius: '24px', 
                    color: '#fff',
                    backdropFilter: 'blur(20px)',
                    padding: '20px',
                    boxShadow: '0 24px 48px rgba(0,0,0,0.5)'
                  }} 
                />
                <Area type="monotone" dataKey="frequency" stroke="#0066FF" strokeWidth={5} fillOpacity={1} fill="url(#colorFreq)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}
