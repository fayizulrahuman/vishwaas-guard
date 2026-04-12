'use client';

import { Shield, Bell, User, LogOut, Settings, Vault, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth, useUser } from "@/firebase"
import { signOut } from "firebase/auth"
import { toast } from "@/hooks/use-toast"

export function VishwaasHeader() {
  const auth = useAuth();
  const { user } = useUser();

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

  const handleProfileSettings = () => {
    toast({
      title: "Profile Settings",
      description: "Accessing your biometric identity and preference management.",
    })
  }

  const handleSecurityVault = () => {
    toast({
      title: "Security Vault",
      description: "Your encrypted keys and verification history are protected.",
    })
  }

  const handleActivityAnalysis = () => {
    toast({
      title: "Activity Analysis",
      description: "Reviewing recent liveness detection logs and communication patterns.",
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
                  onClick={handleProfileSettings}
                  className="rounded-xl px-4 py-2.5 cursor-pointer font-medium gap-3 focus:bg-primary/10 text-foreground"
                >
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleSecurityVault}
                  className="rounded-xl px-4 py-2.5 cursor-pointer font-medium gap-3 focus:bg-primary/10 text-foreground"
                >
                  <Vault className="h-4 w-4 text-muted-foreground" />
                  Security Vault
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleActivityAnalysis}
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
    </header>
  )
}