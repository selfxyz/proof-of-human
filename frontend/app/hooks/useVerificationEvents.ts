'use client';

import { useEffect } from 'react';
import { useWatchContractEvent } from 'wagmi';
import { useProofOfHumanContract } from './useProofOfHuman';

export function useVerificationEvents(onVerified?: (user: string, timestamp: number, nationality: string) => void) {
  const { address, abi } = useProofOfHumanContract();

  const unwatch = useWatchContractEvent({
    address,
    abi,
    eventName: 'HumanVerified',
    onLogs(logs) {
      logs.forEach((log) => {
        console.log('HumanVerified event:', log);
        const { user, timestamp, nationality } = log.args as any;
        if (onVerified) {
          onVerified(user, Number(timestamp), nationality);
        }
      });
    },
  });

  return unwatch;
}