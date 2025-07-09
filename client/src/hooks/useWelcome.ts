
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export function useWelcome() {
  const [showWelcome, setShowWelcome] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Check if this is a new user by checking account creation date
      const accountCreatedAt = new Date(user.createdAt);
      const now = new Date();
      const daysSinceCreation = (now.getTime() - accountCreatedAt.getTime()) / (1000 * 60 * 60 * 24);
      
      // Show welcome for users created within the last 7 days
      const hasSeenWelcome = localStorage.getItem(`welcome_seen_${user.id}`);
      const isNewUser = daysSinceCreation <= 7;
      
      if (isNewUser && !hasSeenWelcome) {
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
