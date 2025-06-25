
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export function useWelcome() {
  const { user, isAuthenticated } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      const userData = user as any;
      const hasSeenWelcome = localStorage.getItem(`welcome_seen_${userData.id}`);
      
      // Show welcome if user hasn't seen it yet and account is less than 24 hours old
      if (!hasSeenWelcome && userData.createdAt) {
        const accountAge = Date.now() - new Date(userData.createdAt).getTime();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        
        if (accountAge < twentyFourHours) {
          setShowWelcome(true);
        }
      }
    }
  }, [isAuthenticated, user]);

  const markWelcomeSeen = () => {
    if (user) {
      const userData = user as any;
      localStorage.setItem(`welcome_seen_${userData.id}`, 'true');
      setShowWelcome(false);
    }
  };

  return {
    showWelcome,
    markWelcomeSeen
  };
}
