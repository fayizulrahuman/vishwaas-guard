
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
    toast({ title: "Secure Wipe Initiated", description: "Clearing local cache and buffers..." });
    setTimeout(() => {
      localStorage.clear();
      sessionStorage.clear();
      signOut(auth);
      toast({ title: "Session Purged", description: "Your biometric session has been decommissioned." });
    }, 1000);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-[40px] shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      <div className="container max-w-6xl mx-auto px-4 md:px-6 flex h-20 md:h-24 items-center justify-between">
        <div className="flex items-center gap-3 md:gap-6 font-black text-white">
          <div className="relative h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-[1.25rem] bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl backdrop-blur-3xl">
            <div className="absolute inset-0 metallic-ring opacity-20"></div>
            <Shield className="h-5 w-5 md:h-8 md:w-8 text-primary relative z-10 drop-shadow-[0_0_10px_rgba(0,102,255,0.8)]" />
          </div>
          <div className="flex flex-col">
            <span className="text-base md:text-2xl tracking-tighter uppercase font-black leading-none">Vishwaas Guard</span>
            <span className="hidden sm:inline text-[7px] md:text-[9px] uppercase tracking-[0.5em] text-[#8E8E93] mt-1">Intelligence Perimeter</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 md:gap-8">
          <Button 
            onClick={() => toast({ title: "Perimeter Check", description: "Monitoring active streams. Status: Secure." })} 
            variant="ghost" 
            size="icon" 
            className="relative h-10 w-10 md:h-12 md:w-12 rounded-full hover:bg-white/10 transition-all active:scale-95"
          >
            <Bell className="h-5 w-5 md:h-6 md:w-6 text-[#8E8E93]" />
            <span className="absolute top-2.5 right-2.5 md:top-3.5 md:right-3.5 flex h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-primary border-2 border-black"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 md:h-12 md:w-12 rounded-full border border-white/20 p-0 hover:ring-2 hover:ring-primary/40 transition-all active:scale-95">
                <Avatar className="h-full w-full">
                  <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/100/100`} />
                  <AvatarFallback className="bg-white/5 text-white"><User className="h-5 w-5 md:h-6 md:w-6" /></AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72 md:w-80 frosted-glass p-3 mt-4 md:mt-6 animate-in fade-in slide-in-from-top-6 duration-500 border-white/20 shadow-[0_32px_64px_rgba(0,0,0,0.6)]" align="end">
              <DropdownMenuLabel className="px-5 py-6 text-white">
                <div className="space-y-2">
                  <p className="text-base font-bold leading-none truncate">{user?.displayName || "Security Member"}</p>
                  <div className="flex items-center gap-3">
                    <div className="glow-dot scale-125"></div>
                    <p className="active-protection-glow text-[9px] md:text-[10px] uppercase tracking-[0.3em]">
                      Active Protection
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10 mx-2" />
              <div className="p-2 space-y-1">
                <DropdownMenuItem onClick={() => setProfileOpen(true)} className="rounded-2xl px-5 py-3 md:py-4 cursor-pointer font-medium gap-4 text-white focus:bg-white/10 transition-colors">
                  <Settings className="h-5 w-5 text-[#8E8E93]" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setVaultOpen(true)} className="rounded-2xl px-5 py-3 md:py-4 cursor-pointer font-medium gap-4 text-white focus:bg-white/10 transition-colors">
                  <Vault className="h-5 w-5 text-[#8E8E93]" />
                  Security Vault
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActivityOpen(true)} className="rounded-2xl px-5 py-3 md:py-4 cursor-pointer font-medium gap-4 text-white focus:bg-white/10 transition-colors">
                  <TrendingUp className="h-5 w-5 text-[#8E8E93]" />
                  Activity Analysis
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator className="bg-white/10 mx-2" />
              <div className="p-2">
                <DropdownMenuItem onClick={handleSignOut} className="rounded-2xl px-5 py-3 md:py-4 cursor-pointer font-black text-destructive focus:text-destructive focus:bg-destructive/10 gap-4 transition-all">
                  <LogOut className="h-5 w-5" />
                  Sign Out Securely
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="frosted-glass w-[92vw] sm:max-w-lg p-6 md:p-12 border-white/30 shadow-[0_0_100px_rgba(0,102,255,0.2)]">
          <DialogHeader className="space-y-3 text-left">
            <DialogTitle className="text-xl md:text-3xl font-black text-white flex items-center gap-4">
              <Fingerprint className="h-8 w-8 text-primary" />
              Biometric Filter
            </DialogTitle>
            <DialogDescription className="text-[#8E8E93] font-medium text-sm md:text-lg">Manage identity protection.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-10">
            <div className="flex items-center justify-between p-8 rounded-[32px] bg-white/5 border border-white/10">
              <Label className="text-lg font-bold text-white">Voice Print</Label>
              <Switch checked={voiceEnrollment} onCheckedChange={setVoiceEnrollment} />
            </div>
            <div className="flex items-center justify-between p-8 rounded-[32px] bg-white/5 border border-white/10">
              <Label className="text-lg font-bold text-white">Face ID Scan</Label>
              <Switch checked={faceIdCheck} onCheckedChange={setFaceIdCheck} />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={vaultOpen} onOpenChange={setVaultOpen}>
        <DialogContent className="frosted-glass w-[92vw] sm:max-w-2xl p-6 md:p-12 border-white/30">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl md:text-3xl font-black text-white flex items-center gap-4">
              <Vault className="h-8 w-8 text-primary" />
              Evidence Gallery
            </DialogTitle>
            <DialogDescription className="text-[#8E8E93]">Encrypted deepfake evidence.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mt-12">
            {VAULT_ITEMS.map((item) => (
              <div key={item.id} className="frosted-glass p-8 flex flex-col items-center justify-center gap-6 border-white/10 hover:bg-white/10 transition-all">
                {item.type === 'audio' ? <FileAudio className="h-10 w-10 text-primary" /> : <FileVideo className="h-10 w-10 text-primary" />}
                <p className="text-sm font-black text-white text-center">{item.name}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activityOpen} onOpenChange={setActivityOpen}>
        <DialogContent className="frosted-glass w-[92vw] sm:max-w-4xl p-6 md:p-12 border-white/30">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl md:text-3xl font-black text-white flex items-center gap-4">
              <TrendingUp className="h-8 w-8 text-primary" />
              Intelligence Analysis
            </DialogTitle>
          </DialogHeader>
          <div className="h-[300px] md:h-[450px] w-full mt-16 p-8 bg-black/40 rounded-[40px] border border-white/10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_CHART_DATA}>
                <defs>
                  <linearGradient id="colorFreq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066FF" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
                <XAxis dataKey="day" stroke="#8E8E93" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#8E8E93" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '16px', color: '#fff' }} />
                <Area type="monotone" dataKey="frequency" stroke="#0066FF" strokeWidth={3} fillOpacity={1} fill="url(#colorFreq)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}
