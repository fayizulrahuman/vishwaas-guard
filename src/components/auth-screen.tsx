'use client';

import { useState, useEffect, useRef } from 'react';
import { Shield, Mail, Smartphone, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/firebase';
import { GoogleIcon } from '@/components/icons/google-icon';
import { initiateAnonymousSignIn, initiateEmailSignIn } from '@/firebase/non-blocking-login';
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
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  // Initialize and cleanup reCAPTCHA
  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (e) {
          // Ignore clearing errors on unmount
        }
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

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    initiateEmailSignIn(auth, email, password, () => setLoading(false));
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
      // Create reCAPTCHA verifier if it doesn't exist
      if (!recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA solved
          }
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
      // Don't nullify the ref here, as the element is already rendered
      // Only clear if we absolutely have to restart
      toast({ 
        title: "Failed to send OTP", 
        description: error.message, 
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
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] p-6">
      <div id="recaptcha-container"></div>
      
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
              {method === 'otp' && "Verify Your Identity"}
            </CardTitle>
            <CardDescription className="text-center">
              {method === 'otp' 
                ? `Enter the 6-digit code sent to ${countryCode}${phone}`
                : "Choose your preferred secure login method."}
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
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex gap-2">
                    <div className="w-[110px] shrink-0">
                      <Select value={countryCode} onValueChange={setCountryCode}>
                        <SelectTrigger className="h-12 rounded-xl border-border bg-slate-50/50">
                          <SelectValue placeholder="Code" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRY_CODES.map((item) => (
                            <SelectItem key={item.code} value={item.code}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="555 000 0000" 
                      className="h-12 flex-1 rounded-xl border-border bg-slate-50/50"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground px-1 leading-relaxed">
                    Select your country code and enter the remaining digits of your phone number.
                  </p>
                </div>
                <Button type="submit" className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 font-bold gap-2" disabled={loading}>
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send OTP Code"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" onClick={() => setMethod('options')} className="w-full rounded-xl text-muted-foreground" disabled={loading}>
                  Back to options
                </Button>
              </form>
            )}

            {method === 'otp' && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input 
                    id="otp" 
                    type="text" 
                    placeholder="000000" 
                    maxLength={6}
                    className="h-12 rounded-xl border-border bg-slate-50/50 text-center tracking-[1em] text-lg font-bold"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 font-bold gap-2" disabled={loading}>
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify & Continue"}
                  {!loading && <KeyRound className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setMethod('phone')} 
                  className="w-full rounded-xl text-muted-foreground" 
                  disabled={loading}
                >
                  Change phone number
                </Button>
              </form>
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
