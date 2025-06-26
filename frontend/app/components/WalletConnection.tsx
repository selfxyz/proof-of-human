'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance } from 'wagmi';
import { celoAlfajores } from 'wagmi/chains';

export function WalletConnection() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address,
    chainId: celoAlfajores.id,
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <ConnectButton />
      
      {isConnected && balance && (
        <div className="text-sm text-gray-600">
          Balance: {parseFloat(balance.formatted).toFixed(4)} CELO
          {balance.value === 0n && (
            <a
              href="https://faucet.celo.org/alfajores"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-blue-600 hover:text-blue-800 underline"
            >
              Get testnet CELO
            </a>
          )}
        </div>
      )}
    </div>
  );
}