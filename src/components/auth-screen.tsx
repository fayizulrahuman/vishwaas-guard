'use client';

import { useState } from 'react';
import { Shield, Mail, Smartphone, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/firebase';
import { GoogleIcon } from '@/components/icons/google-icon';
import { initiateAnonymousSignIn, initiateEmailSignIn } from '@/firebase/non-blocking-login';
import { toast } from '@/hooks/use-toast';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export function AuthScreen() {
  const auth = useAuth();
  const [method, setMethod] = useState<'options' | 'email' | 'phone'>('options');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    initiateEmailSignIn(auth, email, password);
    // Note: Success is handled by the useUser hook in the parent
  };

  const handleGuestLogin = () => {
    setLoading(true);
    initiateAnonymousSignIn(auth);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] p-6">
      <div className="w-full max-w-[440px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-[2rem] bg-white shadow-xl flex items-center justify-center border border-white/20">
              <Shield className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Vishwaas Guard</h1>
          <p className="text-muted-foreground font-medium">Secure your communication, build trust.</p>
        </div>

        <Card className="border-none shadow-[0_4px_24px_rgba(0,0,0,0.04)] bg-white/80 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="pt-10 pb-6">
            <CardTitle className="text-xl text-center">
              {method === 'options' && "Welcome Back"}
              {method === 'email' && "Sign in with Email"}
              {method === 'phone' && "Sign in with Phone"}
            </CardTitle>
            <CardDescription className="text-center">
              Choose your preferred secure login method.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pb-10">
            {method === 'options' && (
              <div className="space-y-3">
                <Button 
                  onClick={handleGoogleLogin} 
                  variant="outline" 
                  className="w-full h-12 rounded-2xl font-semibold border-border hover:bg-slate-50 transition-all gap-3"
                  disabled={loading}
                >
                  <GoogleIcon className="h-5 w-5" />
                  Continue with Google
                </Button>
                
                <Button 
                  onClick={() => setMethod('phone')}
                  variant="outline" 
                  className="w-full h-12 rounded-2xl font-semibold border-border hover:bg-slate-50 transition-all gap-3"
                  disabled={loading}
                >
                  <Smartphone className="h-5 w-5 text-slate-600" />
                  Continue with Phone
                </Button>

                <Button 
                  onClick={() => setMethod('email')}
                  variant="outline" 
                  className="w-full h-12 rounded-2xl font-semibold border-border hover:bg-slate-50 transition-all gap-3"
                  disabled={loading}
                >
                  <Mail className="h-5 w-5 text-slate-600" />
                  Continue with Email
                </Button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground font-bold tracking-widest">Or</span>
                  </div>
                </div>

                <Button 
                  onClick={handleGuestLogin}
                  variant="ghost" 
                  className="w-full h-12 rounded-2xl font-semibold text-muted-foreground hover:text-foreground transition-all"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Continue as Guest"}
                </Button>
              </div>
            )}

            {method === 'email' && (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="h-12 rounded-xl border-border bg-slate-50/50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="h-12 rounded-xl border-border bg-slate-50/50"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 font-bold gap-2" disabled={loading}>
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" onClick={() => setMethod('options')} className="w-full rounded-xl text-muted-foreground" disabled={loading}>
                  Back to options
                </Button>
              </form>
            )}

            {method === 'phone' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="+1 (555) 000-0000" 
                    className="h-12 rounded-xl border-border bg-slate-50/50"
                  />
                </div>
                <Button onClick={() => toast({ title: "OTP Sent", description: "Verification code sent to your phone." })} className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 font-bold gap-2">
                  Send OTP Code
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" onClick={() => setMethod('options')} className="w-full rounded-xl text-muted-foreground">
                  Back to options
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground font-medium px-8 leading-relaxed">
          By continuing, you agree to Vishwaas Guard's <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}