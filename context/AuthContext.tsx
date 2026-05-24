import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { Session } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_ACTIVE_KEY = '@last_active';

interface AuthContextType {
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ session: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSessionAndActivity = async () => {
      const { data } = await supabase.auth.getSession();
      let currentSession = data.session;

      if (currentSession) {
        const lastActive = await AsyncStorage.getItem(LAST_ACTIVE_KEY);
        const now = Date.now();
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;

        if (lastActive && now - parseInt(lastActive, 10) > thirtyDays) {
          await supabase.auth.signOut();
          currentSession = null;
          await AsyncStorage.removeItem(LAST_ACTIVE_KEY);
        } else {
          await AsyncStorage.setItem(LAST_ACTIVE_KEY, now.toString());
        }
      }
      setSession(currentSession);
      setLoading(false);
    };

    checkSessionAndActivity();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        await AsyncStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
      }
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ session, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);