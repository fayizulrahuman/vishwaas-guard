'use client';

import { useState, useEffect, useRef } from 'react';
import { Shield, Mail, Smartphone, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/firebase';
import { GoogleIcon } from '@/components/icons/google-icon';
import { initiateAnonymousSignIn, initiateEmailSignIn, initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { toast } from '@/hooks/use-toast';
import { GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const COUNTRY_CODES = [
  { code: '+1', label: '🇺🇸 +1', country: 'USA/Canada' },
  { code: '+91', label: '🇮🇳 +91', country: 'India' },
  { code: '+44', label: '🇬🇧 +44', country: 'UK' },
  { code: '+61', label: '🇦🇺 +61', country: 'Australia' },
  { code: '+971', label: '🇦🇪 +971', country: 'UAE' },
  { code: '+65', label: '🇸🇬 +65', country: 'Singapore' },
  { code: '+49', label: '🇩🇪 +49', country: 'Germany' },
  { code: '+33', label: '🇫🇷 +33', country: 'France' },
  { code: '+81', label: '🇯🇵 +81', country: 'Japan' },
];

export function AuthScreen() {
  const auth = useAuth();
  const [method, setMethod] = useState<'options' | 'email' | 'phone' | 'otp'>('options');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (e) {}
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

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

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      toast({
        title: "Phone Required",
        description: "Please enter your phone number.",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    
    const cleanedPhone = phone.replace(/\D/g, '');
    const fullPhoneNumber = countryCode + cleanedPhone;

    try {
      if (!recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
        });
      }
      
      const result = await signInWithPhoneNumber(auth, fullPhoneNumber, recaptchaVerifierRef.current);
      setConfirmationResult(result);
      setMethod('otp');
      toast({ 
        title: "OTP Sent", 
        description: `A verification code has been sent to ${fullPhoneNumber}.` 
      });
    } catch (error: any) {
      let title = "Failed to send OTP";
      let description = error.message;

      // SPECIFIC FIX: Handle billing error for prototype environments
      if (error.code === 'auth/billing-not-enabled') {
        title = "Phone Auth Restricted";
        description = "This environment requires a billed Firebase plan for SMS. Please use Google, Email, or Guest login to continue the demo.";
      }

      toast({ 
        title, 
        description, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !confirmationResult) return;
    setLoading(true);
    
    try {
      await confirmationResult.confirm(otp);
    } catch (error: any) {
      toast({ 
        title: "Verification Failed", 
        description: "The code you entered is invalid or has expired.", 
        variant: "destructive" 
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6 relative overflow-hidden">
      {/* Volumetric Spheres */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="bg-sphere sphere-blue -top-40 -left-40 animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="bg-sphere sphere-blue top-1/4 -right-20 animate-float" style={{ animationDelay: '-3s' }}></div>
        <div className="bg-sphere sphere-orange -bottom-60 left-1/2 -translate-x-1/2 opacity-30 animate-float" style={{ animationDelay: '-5s' }}></div>
      </div>

      <div id="recaptcha-container"></div>
      
      <div className="relative z-10 w-full max-w-[440px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="relative h-24 w-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
              <div className="absolute inset-0 metallic-ring opacity-20"></div>
              <Shield className="h-12 w-12 text-primary relative z-10" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Vishwaas Guard</h1>
          <p className="text-[#8E8E93] text-[10px] font-black uppercase tracking-[0.3em]">Integrity. Filtered by Glass.</p>
        </div>

        <Card className="glass-panel border-white/10 bg-white/5 shadow-2xl backdrop-blur-3xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="pt-12 pb-8">
            <CardTitle className="text-2xl text-center text-white font-black tracking-tight">
              {method === 'options' && "Welcome"}
              {method === 'email' && (isSignUp ? "Join Guard" : "Secure Sign In")}
              {method === 'phone' && "Phone Link"}
              {method === 'otp' && "Verify ID"}
            </CardTitle>
            <CardDescription className="text-center text-[#8E8E93] font-medium px-4">
              {method === 'otp' 
                ? `Verifying session for ${countryCode}${phone}`
                : "Choose a secure biometric entry method."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pb-12">
            {method === 'options' && (
              <div className="space-y-4">
                <Button 
                  onClick={handleGoogleLogin} 
                  variant="outline" 
                  className="w-full h-14 rounded-2xl font-bold border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all gap-3 shadow-sm"
                  disabled={loading}
                >
                  <GoogleIcon className="h-5 w-5" />
                  Continue with Google
                </Button>
                
                <Button 
                  onClick={() => setMethod('phone')}
                  variant="outline" 
                  className="w-full h-14 rounded-2xl font-bold border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all gap-3 shadow-sm"
                  disabled={loading}
                >
                  <Smartphone className="h-5 w-5 text-[#8E8E93]" />
                  Continue with Phone
                </Button>

                <Button 
                  onClick={() => {
                    setMethod('email');
                    setIsSignUp(false);
                  }}
                  variant="outline" 
                  className="w-full h-14 rounded-2xl font-bold border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all gap-3 shadow-sm"
                  disabled={loading}
                >
                  <Mail className="h-5 w-5 text-[#8E8E93]" />
                  Continue with Email
                </Button>

                <div className="relative py-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/5"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black/40 px-3 text-[#8E8E93] font-black tracking-widest text-[9px]">Demo Mode</span>
                  </div>
                </div>

                <Button 
                  onClick={handleGuestLogin}
                  variant="ghost" 
                  className="w-full h-14 rounded-2xl font-black text-[#8E8E93] hover:text-white transition-all uppercase tracking-widest text-xs"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Access as Guest"}
                </Button>
              </div>
            )}

            {method === 'email' && (
              <form onSubmit={handleEmailAuth} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-[#8E8E93] ml-1">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@vishwaas.guard" 
                    className="h-14 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/20 px-6 focus:ring-primary/20"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-[#8E8E93] ml-1">Access Key</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="h-14 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/20 px-6 focus:ring-primary/20"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black gap-2 shadow-xl shadow-primary/20 mt-2" disabled={loading}>
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (isSignUp ? "Confirm Account" : "Access Perimeter")}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </Button>
                
                <div className="text-center pt-2">
                  <button 
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-[10px] text-primary font-black uppercase tracking-widest hover:underline"
                  >
                    {isSignUp ? "Back to Sign In" : "Request New Account"}
                  </button>
                </div>

                <Button variant="ghost" onClick={() => setMethod('options')} className="w-full rounded-2xl text-[#8E8E93] hover:text-white font-bold h-12" disabled={loading}>
                  Return to options
                </Button>
              </form>
            )}

            {method === 'phone' && (
              <form onSubmit={handleSendOTP} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-[#8E8E93] ml-1">Phone Number</Label>
                  <div className="flex gap-3">
                    <div className="w-[120px] shrink-0">
                      <Select value={countryCode} onValueChange={setCountryCode}>
                        <SelectTrigger className="h-14 rounded-2xl border-white/10 bg-white/5 text-white focus:ring-primary/20">
                          <SelectValue placeholder="Code" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-white/10 text-white backdrop-blur-3xl rounded-2xl">
                          {COUNTRY_CODES.map((item) => (
                            <SelectItem key={item.code} value={item.code} className="focus:bg-white/10 rounded-xl">
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="000 000 0000" 
                      className="h-14 flex-1 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/20 px-6 focus:ring-primary/20"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black gap-2 shadow-xl shadow-primary/20" disabled={loading}>
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Request OTP Code"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" onClick={() => setMethod('options')} className="w-full rounded-2xl text-[#8E8E93] hover:text-white font-bold h-12" disabled={loading}>
                  Return to options
                </Button>
              </form>
            )}

            {method === 'otp' && (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-[10px] font-black uppercase tracking-widest text-[#8E8E93] ml-1">6-Digit Pin</Label>
                  <Input 
                    id="otp" 
                    type="text" 
                    placeholder="000000" 
                    maxLength={6}
                    className="h-20 rounded-2xl border-white/10 bg-white/5 text-white text-center tracking-[0.5em] text-3xl font-black focus:ring-primary/20"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black gap-2 shadow-xl shadow-primary/20" disabled={loading}>
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify Session"}
                  {!loading && <KeyRound className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setMethod('phone')} 
                  className="w-full rounded-2xl text-[#8E8E93] hover:text-white font-bold h-12" 
                  disabled={loading}
                >
                  Change identifier
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-[9px] text-[#8E8E93] font-black uppercase tracking-[0.3em] px-12 leading-relaxed opacity-60">
          Biometric sessions are secured by <span className="underline cursor-pointer hover:text-white">Vishwaas Protocols</span> and <span className="underline cursor-pointer hover:text-white">Zero-Knowledge Standards</span>.
        </p>
      </div>
    </div>
  );
}