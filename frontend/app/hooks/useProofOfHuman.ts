'use client';

import { useReadContract, useAccount } from 'wagmi';
import ProofOfHumanABI from '../contracts/ProofOfHuman.abi.json';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PROOF_OF_HUMAN_CONTRACT as `0x${string}`;

export function useIsVerifiedHuman(address?: `0x${string}`) {
  const { address: connectedAddress } = useAccount();
  const checkAddress = address || connectedAddress;

  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ProofOfHumanABI,
    functionName: 'isVerifiedHuman',
    args: checkAddress ? [checkAddress] : undefined,
  });
}

export function useVerificationDetails(address?: `0x${string}`) {
  const { address: connectedAddress } = useAccount();
  const checkAddress = address || connectedAddress;

  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ProofOfHumanABI,
    functionName: 'getVerificationDetails',
    args: checkAddress ? [checkAddress] : undefined,
  });
}

export function useProofOfHumanContract() {
  return {
    address: CONTRACT_ADDRESS,
    abi: ProofOfHumanABI,
  };
}