'use client';

import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';

const STORAGE_KEY_PREFIX = 'self_registered_';

export function useRegistrationStatus() {
  const { address } = useAccount();
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!address) {
      setIsRegistered(false);
      setIsLoading(false);
      return;
    }

    // Check localStorage for registration status
    const storageKey = `${STORAGE_KEY_PREFIX}${address.toLowerCase()}`;
    const registered = localStorage.getItem(storageKey) === 'true';
    
    setIsRegistered(registered);
    setIsLoading(false);

    // TODO: In Phase 2, we'll also check on-chain status here
  }, [address]);

  const markAsRegistered = () => {
    if (!address) return;
    
    const storageKey = `${STORAGE_KEY_PREFIX}${address.toLowerCase()}`;
    localStorage.setItem(storageKey, 'true');
    setIsRegistered(true);
  };

  const clearRegistration = () => {
    if (!address) return;
    
    const storageKey = `${STORAGE_KEY_PREFIX}${address.toLowerCase()}`;
    localStorage.removeItem(storageKey);
    setIsRegistered(false);
  };

  return {
    isRegistered,
    isLoading,
    markAsRegistered,
    clearRegistration,
  };
}