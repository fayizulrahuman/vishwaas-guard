'use client';

import { useState } from "react"
import { Shield, Bell, User, LogOut, Settings, Vault, Activity, Fingerprint, Key, ShieldCheck, History, Smartphone, Globe } from "lucide-react"
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
import { Progress } from "@/components/ui/progress"

export function VishwaasHeader() {
  const auth = useAuth();
  const { user } = useUser();
  
  const [profileOpen, setProfileOpen] = useState(false);
  const [vaultOpen, setVaultOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);

  const handleSignOut = () => {
    signOut(auth);
    toast({
      title: "Signed Out",
      description: "You have been securely logged out of your session.",
    })
  };

  const handleNotifications = () => {
    toast({
      title: "Security Notifications",
      description: "No new security alerts detected. Your perimeter is secure.",
    })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-xl">
      <div className="container max-w-6xl mx-auto px-4 flex h-16 md:h-20 items-center justify-between">
        <div className="flex items-center gap-2.5 font-black text-foreground">
          <div className="bg-primary p-1.5 rounded-lg shadow-lg shadow-primary/20">
            <Shield className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </div>
          <span className="text-base md:text-xl tracking-tight uppercase">Vishwaas Guard</span>
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
            <DropdownMenuContent className="w-64 rounded-2xl p-2 shadow-2xl bg-card border-border" align="end" forceMount>
              <DropdownMenuLabel className="font-normal px-4 py-3 text-foreground">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold leading-none">{user?.displayName || (user?.isAnonymous ? "Guest User" : "Security Member")}</p>
                  <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mt-1">
                    {user?.isAnonymous ? "Temporary Session" : "Active Protection"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5 mx-2" />
              <div className="p-1">
                <DropdownMenuItem 
                  onClick={() => setProfileOpen(true)}
                  className="rounded-xl px-4 py-2.5 cursor-pointer font-medium gap-3 focus:bg-primary/10 text-foreground"
                >
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setVaultOpen(true)}
                  className="rounded-xl px-4 py-2.5 cursor-pointer font-medium gap-3 focus:bg-primary/10 text-foreground"
                >
                  <Vault className="h-4 w-4 text-muted-foreground" />
                  Security Vault
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setActivityOpen(true)}
                  className="rounded-xl px-4 py-2.5 cursor-pointer font-medium gap-3 focus:bg-primary/10 text-foreground"
                >
                  <Activity className="h-4 w-4 text-muted-foreground" />
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

      {/* --- Dialogs --- */}

      {/* Profile Settings Dialog */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="bg-card border-white/10 rounded-[2rem] max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Settings className="h-5 w-5" />
              </div>
              Identity Settings
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Manage your biometric profile and secure credentials.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
              <Avatar className="h-16 w-16 rounded-2xl border-2 border-primary/20">
                <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/100/100`} />
              </Avatar>
              <div className="flex-1">
                <h4 className="font-bold text-foreground">{user?.displayName || "Security Member"}</h4>
                <p className="text-xs text-muted-foreground truncate max-w-[200px]">{user?.email || "Biometric-only ID"}</p>
                <Badge variant="secondary" className="mt-1 text-[8px] font-black uppercase tracking-widest bg-primary/20 text-primary border-none">Verified Tier</Badge>
              </div>
              <Button size="sm" variant="outline" className="rounded-xl border-white/10 bg-white/5">Edit</Button>
            </div>
            
            <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Device Security</h5>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                  <Smartphone className="h-4 w-4 text-primary" />
                  <p className="text-xs font-bold text-foreground">Trusted Phone</p>
                  <p className="text-[10px] text-muted-foreground">iPhone 15 Pro Max</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <p className="text-xs font-bold text-foreground">Location Guard</p>
                  <p className="text-[10px] text-muted-foreground">San Francisco, CA</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Security Vault Dialog */}
      <Dialog open={vaultOpen} onOpenChange={setVaultOpen}>
        <DialogContent className="bg-card border-white/10 rounded-[2rem] max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <Vault className="h-5 w-5" />
              </div>
              Encrypted Vault
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Your cryptographic keys and liveness logs are stored here.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="p-6 bg-gradient-to-br from-amber-500/10 to-transparent rounded-[2rem] border border-amber-500/20 text-center space-y-4">
               <Key className="h-10 w-10 text-amber-500 mx-auto animate-pulse" />
               <div className="space-y-1">
                 <p className="text-lg font-black text-foreground">Hardware Key Active</p>
                 <p className="text-xs text-muted-foreground">Secure Enclave integration is healthy.</p>
               </div>
               <div className="pt-2">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">
                   <span>Storage Capacity</span>
                   <span>12% Used</span>
                 </div>
                 <Progress value={12} className="h-1.5 bg-white/10" />
               </div>
            </div>
            
            <div className="space-y-2">
               {[
                 { label: "Master Recovery Phrase", status: "Verified", icon: ShieldCheck },
                 { label: "Biometric Root Key", status: "Encrypted", icon: Fingerprint },
                 { label: "Session Rotation", status: "Every 24h", icon: History },
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                   <div className="flex items-center gap-3">
                     <item.icon className="h-4 w-4 text-muted-foreground" />
                     <span className="text-xs font-medium text-foreground">{item.label}</span>
                   </div>
                   <span className="text-[10px] font-black uppercase text-amber-500">{item.status}</span>
                 </div>
               ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Activity Analysis Dialog */}
      <Dialog open={activityOpen} onOpenChange={setActivityOpen}>
        <DialogContent className="bg-card border-white/10 rounded-[2rem] max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <Activity className="h-5 w-5" />
              </div>
              Biometric Activity
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Recent liveness detection events and communication integrity logs.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {[
              { time: "12:45 PM", event: "Voice Liveness Check", result: "PASSED", detail: "Deepfake Prob: 0.02", color: "text-emerald-500" },
              { time: "11:30 AM", event: "Face Geometry Scan", result: "SECURE", detail: "No anomalies detected", color: "text-emerald-500" },
              { time: "Yesterday", event: "Unknown Login Attempt", result: "BLOCKED", detail: "Location: North Korea (VPN)", color: "text-destructive" },
              { time: "2 Days Ago", event: "Shield Activation", result: "ACTIVE", detail: "System integrity validated", color: "text-primary" },
              { time: "3 Days Ago", event: "Biometric Data Rotation", result: "COMPLETE", detail: "Local cache purged", color: "text-muted-foreground" },
            ].map((log, i) => (
              <div key={i} className="relative pl-6 border-l border-white/10 pb-6 last:pb-0">
                <div className={`absolute left-[-5px] top-0 h-2.5 w-2.5 rounded-full ${log.color.replace('text', 'bg')} shadow-sm`}></div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-black text-foreground">{log.event}</p>
                    <span className="text-[10px] text-muted-foreground font-medium">{log.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-[9px] font-black ${log.color} border-none bg-white/5`}>{log.result}</Badge>
                    <p className="text-[10px] text-muted-foreground">{log.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}
