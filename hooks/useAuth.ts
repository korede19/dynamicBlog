"use client"

import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { useRouter } from 'next/router';
import { AuthUser } from '../types/auth';

interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
}

export function useAuth(requireSuperUser = false): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Get the ID token with claims
        const idTokenResult = await firebaseUser.getIdTokenResult();
        const isSuperUser = !!idTokenResult.claims.superUser;
        const isAdmin = !!idTokenResult.claims.admin;
        
        const authUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          isSuperUser,
          isAdmin
        };
        
        setUser(authUser);
        
        if (requireSuperUser && !isSuperUser) {
          // Only redirect if window is defined (client-side)
          if (typeof window !== 'undefined') {
            router.push('/unauthorized');
          }
        }
      } else {
        setUser(null);
        if (requireSuperUser) {
          // Only redirect if window is defined (client-side)
          if (typeof window !== 'undefined') {
            router.push('/login');
          }
        }
      }
      
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [requireSuperUser, router]);

  return { user, loading };
}