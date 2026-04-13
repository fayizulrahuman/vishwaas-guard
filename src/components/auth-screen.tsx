'use client';

import { useState } from 'react';
import { Shield, Mail, ArrowRight, Loader2, Lock, Sparkles, AlertCircle } from 'lucide-react';
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
        description = "Your browser blocked the login popup. Please allow popups for this site or try Email login.";
      }
      toast({
        title: "Login Failed",
        description,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    
    if (isSignUp) {
      initiateEmailSignUp(auth, email, password, () => setLoading(false));
    } else {
      initiateEmailSignIn(auth, email, password, () => setLoading(false));
    }
  };

  const handleGuestLogin = () => {
    setLoading(true);
    initiateAnonymousSignIn(auth, () => setLoading(false));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6 relative overflow-hidden">
      {/* Volumetric Background Spheres - High Fidelity */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="bg-sphere sphere-blue -top-40 -left-40 animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="bg-sphere sphere-blue top-1/3 -right-20 animate-float opacity-30" style={{ animationDelay: '-3s' }}></div>
        <div className="bg-sphere sphere-orange -bottom-60 left-1/2 -translate-x-1/2 opacity-20 animate-float" style={{ animationDelay: '-5s' }}></div>
      </div>
      
      <div className="relative z-10 w-full max-w-[440px] space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative h-24 w-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl backdrop-blur-xl group">
              <div className="absolute inset-0 metallic-ring opacity-30 group-hover:opacity-60 transition-opacity"></div>
              <Shield className="h-12 w-12 text-primary relative z-10 drop-shadow-[0_0_15px_rgba(0,102,255,0.5)]" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Vishwaas Guard</h1>
            <p className="text-[#8E8E93] text-[10px] font-black uppercase tracking-[0.4em]">Integrity. Filtered by Glass.</p>
          </div>
        </div>

        <Card className="frosted-glass border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.6)] rounded-[3rem] overflow-hidden">
          <CardHeader className="pt-12 pb-8">
            <CardTitle className="text-2xl text-center text-white font-black tracking-tight flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {method === 'options' ? "Secure Entry" : (isSignUp ? "Create Identity" : "Access Perimeter")}
            </CardTitle>
            <CardDescription className="text-center text-[#8E8E93] font-medium px-4">
              Choose your preferred biometric or cryptographic verification method.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pb-12">
            {method === 'options' && (
              <div className="space-y-4">
                <Button 
                  onClick={handleGoogleLogin} 
                  variant="outline" 
                  className="w-full h-16 rounded-[24px] font-bold border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all gap-4 shadow-sm backdrop-blur-md active:scale-95"
                  disabled={loading}
                >
                  <GoogleIcon className="h-5 w-5" />
                  Continue with Google
                </Button>
                
                <Button 
                  onClick={() => {
                    setMethod('email');
                    setIsSignUp(false);
                  }}
                  variant="outline" 
                  className="w-full h-16 rounded-[24px] font-bold border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all gap-4 shadow-sm backdrop-blur-md active:scale-95"
                  disabled={loading}
                >
                  <Mail className="h-5 w-5 text-[#8E8E93]" />
                  Continue with Email
                </Button>

                <div className="relative py-8">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/5"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black/20 backdrop-blur-xl px-4 text-[#8E8E93] font-black tracking-[0.3em] text-[9px] rounded-full py-1">Secure Protocol</span>
                  </div>
                </div>

                <Button 
                  onClick={handleGuestLogin}
                  variant="ghost" 
                  className="w-full h-14 rounded-[20px] font-black text-[#8E8E93] hover:text-white transition-all uppercase tracking-[0.3em] text-[10px]"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Access as Anonymous Peer"}
                </Button>
              </div>
            )}

            {method === 'email' && (
              <form onSubmit={handleEmailAuth} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8E8E93] ml-2">Vishwaas Identifier</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="identity@vishwaas.guard" 
                    className="h-16 rounded-[24px] border-white/10 bg-white/5 text-white placeholder:text-white/20 px-8 focus:ring-primary/20 backdrop-blur-md"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8E8E93] ml-2">Security Key</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="h-16 rounded-[24px] border-white/10 bg-white/5 text-white placeholder:text-white/20 px-8 focus:ring-primary/20 backdrop-blur-md"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-16 rounded-[24px] bg-primary hover:bg-primary/90 text-white font-black gap-3 shadow-[0_12px_24px_rgba(0,102,255,0.4)] mt-4 active:scale-95" disabled={loading}>
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (isSignUp ? "Confirm Identity" : "Authenticate Session")}
                  {!loading && <ArrowRight className="h-5 w-5" />}
                </Button>
                
                <div className="text-center pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-[10px] text-primary font-black uppercase tracking-[0.3em] hover:opacity-80 transition-opacity"
                  >
                    {isSignUp ? "Existing Identity? Access Perimeter" : "Request New Security ID"}
                  </button>
                </div>

                <Button variant="ghost" onClick={() => setMethod('options')} className="w-full rounded-2xl text-[#8E8E93] hover:text-white font-bold h-12" disabled={loading}>
                  Return to options
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center items-center gap-3 opacity-60">
          <Lock className="h-4 w-4 text-primary" />
          <p className="text-center text-[10px] text-[#8E8E93] font-black uppercase tracking-[0.4em]">
            Zero-Knowledge Sessions Active
          </p>
        </div>
      </div>
    </div>
  );
}
