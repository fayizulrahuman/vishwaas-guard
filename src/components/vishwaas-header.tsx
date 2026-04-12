"use client"

import { Shield, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth, useUser } from "@/firebase"
import { signOut } from "firebase/auth"

export function VishwaasHeader() {
  const auth = useAuth();
  const { user } = useUser();

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/70 backdrop-blur-xl">
      <div className="container max-w-6xl mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-foreground">
          <Shield className="h-7 w-7 text-primary" />
          <span className="text-lg tracking-tight">Vishwaas Guard</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full hover:bg-slate-100">
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-primary shadow-sm"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-border overflow-hidden">
                <Avatar className="h-full w-full">
                  <AvatarImage src={user?.photoURL || "https://picsum.photos/seed/vishwaas-user/100/100"} alt="User" />
                  <AvatarFallback><User /></AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 rounded-2xl p-2 shadow-2xl border-none" align="end" forceMount>
              <DropdownMenuLabel className="font-normal px-4 py-3">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold leading-none">{user?.displayName || (user?.isAnonymous ? "Guest User" : "Security Member")}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || (user?.isAnonymous ? "Temporary Session" : "Active Protection")}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-100" />
              <DropdownMenuItem className="rounded-xl px-4 py-2 cursor-pointer font-medium">Profile Settings</DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl px-4 py-2 cursor-pointer font-medium">Security Vault</DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl px-4 py-2 cursor-pointer font-medium">Activity Analysis</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-100" />
              <DropdownMenuItem onClick={handleSignOut} className="rounded-xl px-4 py-2 cursor-pointer font-bold text-destructive focus:text-destructive">
                Sign Out Securely
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}