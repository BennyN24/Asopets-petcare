
import React, { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export function useWelcome() {
  const [showWelcome, setShowWelcome] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Check if this is a new user (you can customize this logic)
      const hasSeenWelcome = localStorage.getItem(`welcome_seen_${user.id}`);
      
      if (!hasSeenWelcome) {
        setShowWelcome(true);
      }
    }
  }, [isAuthenticated, user]);

  const markWelcomeSeen = () => {
    setShowWelcome(false);
    if (user) {
      localStorage.setItem(`welcome_seen_${user.id}`, 'true');
    }
  };

  return {
    showWelcome,
    markWelcomeSeen
  };
}
