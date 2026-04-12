'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { toast } from '@/hooks/use-toast';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth, onComplete?: () => void): void {
  signInAnonymously(authInstance)
    .catch((error) => {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive"
      });
    })
    .finally(() => {
      onComplete?.();
    });
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string, onComplete?: () => void): void {
  createUserWithEmailAndPassword(authInstance, email, password)
    .catch((error) => {
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive"
      });
    })
    .finally(() => {
      onComplete?.();
    });
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string, onComplete?: () => void): void {
  signInWithEmailAndPassword(authInstance, email, password)
    .catch((error) => {
      // Standardize the invalid-credential error message for users
      const message = error.code === 'auth/invalid-credential' 
        ? "Invalid email or password. Please check your credentials." 
        : error.message;
        
      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive"
      });
    })
    .finally(() => {
      onComplete?.();
    });
}
