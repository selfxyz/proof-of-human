'use client';

import { useAccount } from 'wagmi';
import { useEffect } from 'react';
import { useIsVerifiedHuman } from './useProofOfHuman';

const STORAGE_KEY_PREFIX = 'self_registered_';

export function useRegistrationStatus() {
  const { address } = useAccount();
  const { data: isVerifiedOnChain, isLoading: isCheckingOnChain } = useIsVerifiedHuman();

  // Check localStorage as fallback for UI state
  const getLocalStatus = () => {
    if (!address) return false;
    const storageKey = `${STORAGE_KEY_PREFIX}${address.toLowerCase()}`;
    return localStorage.getItem(storageKey) === 'true';
  };

  const markAsRegistered = () => {
    if (!address) return;
    
    const storageKey = `${STORAGE_KEY_PREFIX}${address.toLowerCase()}`;
    localStorage.setItem(storageKey, 'true');
  };

  const clearRegistration = () => {
    if (!address) return;
    
    const storageKey = `${STORAGE_KEY_PREFIX}${address.toLowerCase()}`;
    localStorage.removeItem(storageKey);
  };

  // Sync on-chain status with localStorage
  useEffect(() => {
    if (isVerifiedOnChain && address) {
      markAsRegistered();
    }
  }, [isVerifiedOnChain, address]);

  return {
    isRegistered: isVerifiedOnChain || getLocalStatus(),
    isLoading: isCheckingOnChain,
    markAsRegistered,
    clearRegistration,
  };
}