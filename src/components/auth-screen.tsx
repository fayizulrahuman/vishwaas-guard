'use client';

import { useState } from 'react';
import { Shield, Mail, ArrowRight, Loader2, Lock, Sparkles, UserPlus, Fingerprint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/firebase';
import { GoogleIcon } from '@/components/icons/google-icon';
import { initiateAnonymousSignIn, initiateEmailSignIn, initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { toast } from '@/hooks/use-toast';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export function AuthScreen() {
  const auth = useAuth();
  const [method, setMethod] = useState<'options' | 'email'>('options');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      let description = error.message;
      if (error.code === 'auth/popup-blocked') {
        description = "Authentication popup blocked. Please allow popups.";
      }
      toast({ title: "Login Failed", description, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    
    try {
      if (isSignUp) {
        await initiateEmailSignUp(auth, email, password);
        toast({ title: "Identity Created", description: "Your secure session is now active." });
      } else {
        await initiateEmailSignIn(auth, email, password);
      }
    } catch (error: any) {
      let description = "Please check your credentials and try again.";
      if (error.code === 'auth/invalid-credential') {
        description = isSignUp 
          ? "This identity may already exist. Try signing in." 
          : "Credentials not found. Check your details or Request a New Security ID.";
      } else if (error.code === 'auth/email-already-in-use') {
        description = "This identity is already registered. Try signing in.";
      } else if (error.code === 'auth/weak-password') {
        description = "Security key must be at least 6 characters.";
      }
      toast({ title: "Verification Error", description, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="bg-sphere sphere-blue -top-40 -left-40 animate-float opacity-40"></div>
        <div className="bg-sphere sphere-blue top-1/3 -right-20 animate-float opacity-20"></div>
        <div className="bg-sphere sphere-orange -bottom-60 left-1/2 -translate-x-1/2 opacity-20 animate-float"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-[460px] space-y-12">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative h-24 w-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl backdrop-blur-xl group">
              <div className="absolute inset-0 metallic-ring opacity-40 group-hover:opacity-70 transition-opacity"></div>
              <Shield className="h-12 w-12 text-primary relative z-10 drop-shadow-[0_0_15px_rgba(0,102,255,0.6)]" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Vishwaas Guard</h1>
            <p className="text-[#8E8E93] text-[10px] font-black uppercase tracking-[0.4em]">Integrity. Filtered by Glass.</p>
          </div>
        </div>

        <Card className="frosted-glass border-white/10 shadow-2xl rounded-[3rem] overflow-hidden bg-black/40 backdrop-blur-[60px]">
          <CardHeader className="pt-12 pb-8">
            <CardTitle className="text-2xl text-center text-white font-black tracking-tight flex items-center justify-center gap-2">
              {isSignUp ? <UserPlus className="h-5 w-5 text-primary" /> : <Lock className="h-5 w-5 text-primary" />}
              {method === 'options' ? "Secure Entry" : (isSignUp ? "Create Identity" : "Access Perimeter")}
            </CardTitle>
            <CardDescription className="text-center text-[#8E8E93] font-medium px-4 text-sm mt-2">
              Choose your cryptographic verification method.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pb-12">
            {method === 'options' ? (
              <div className="space-y-4">
                <Button 
                  onClick={handleGoogleLogin} 
                  variant="outline" 
                  className="w-full h-16 rounded-[24px] font-bold border-white/10 bg-white/5 hover:bg-white/10 text-white gap-4 active:scale-95 transition-all"
                  disabled={loading}
                >
                  <GoogleIcon className="h-5 w-5" />
                  Continue with Google
                </Button>
                
                <Button 
                  onClick={() => setMethod('email')}
                  variant="outline" 
                  className="w-full h-16 rounded-[24px] font-bold border-white/10 bg-white/5 hover:bg-white/10 text-white gap-4 active:scale-95 transition-all"
                  disabled={loading}
                >
                  <Mail className="h-5 w-5 text-[#8E8E93]" />
                  Continue with Email
                </Button>

                <div className="relative py-8">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/5"></span>
                  </div>
                  <div className="relative flex justify-center text-[9px] uppercase">
                    <span className="bg-black/20 backdrop-blur-xl px-4 text-[#8E8E93] font-black tracking-[0.3em] rounded-full py-1">Secure Protocol</span>
                  </div>
                </div>

                <Button 
                  onClick={async () => {
                    setLoading(true);
                    try { await initiateAnonymousSignIn(auth); } 
                    catch { toast({ title: "Error", variant: "destructive" }); } 
                    finally { setLoading(false); }
                  }}
                  variant="ghost" 
                  className="w-full h-14 rounded-[20px] font-black text-[#8E8E93] hover:text-white uppercase tracking-[0.3em] text-[10px]"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Access as Anonymous Peer"}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleEmailAuth} className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8E8E93] ml-2">Identifier</Label>
                  <Input 
                    type="email" 
                    placeholder="identity@vishwaas.guard" 
                    className="h-16 rounded-[24px] border-white/10 bg-white/5 text-white px-8 focus:ring-primary/20 backdrop-blur-md"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8E8E93] ml-2">Security Key</Label>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="h-16 rounded-[24px] border-white/10 bg-white/5 text-white px-8 focus:ring-primary/20 backdrop-blur-md"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-16 rounded-[24px] bg-primary hover:bg-primary/90 text-white font-black gap-3 shadow-lg active:scale-95" disabled={loading}>
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (isSignUp ? "Confirm Identity" : "Authenticate Session")}
                  {!loading && <ArrowRight className="h-5 w-5" />}
                </Button>
                
                <div className="flex flex-col items-center gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-[10px] text-primary font-black uppercase tracking-[0.3em] hover:opacity-80 transition-opacity"
                  >
                    {isSignUp ? "Existing Identity? Access" : "Request New Security ID"}
                  </button>
                  <Button variant="ghost" onClick={() => setMethod('options')} className="text-[#8E8E93] hover:text-white font-bold h-10 text-xs" disabled={loading}>
                    Return to Options
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center items-center gap-3 opacity-60">
          <Fingerprint className="h-4 w-4 text-primary" />
          <p className="text-[10px] text-[#8E8E93] font-black uppercase tracking-[0.4em]">
            Biometric Integrity Enabled
          </p>
        </div>
      </div>
    </div>
  );
}
