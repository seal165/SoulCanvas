import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function Index() {
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (session) router.replace('/(tabs)');
      else router.replace('/(tabs)/login');
    }
  }, [loading, session]);

  return null;
}