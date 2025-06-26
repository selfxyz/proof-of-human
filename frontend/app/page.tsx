'use client';

import React, { useState, useEffect } from 'react';
import SelfQRcodeWrapper, { SelfAppBuilder } from '@selfxyz/qrcode';
import { v4 as uuidv4 } from 'uuid';
import { useAccount } from 'wagmi';
import { WalletConnection } from './components/WalletConnection';
import { useRegistrationStatus } from './hooks/useRegistrationStatus';
import { RegistrationFlow } from './components/RegistrationFlow';
import { useVerificationEvents } from './hooks/useVerificationEvents';
import { useVerificationDetails } from './hooks/useProofOfHuman';

export default function ProveHuman() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationData, setVerificationData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [isWaitingForVerification, setIsWaitingForVerification] = useState(false);
  const { address, isConnected } = useAccount();
  const { isRegistered, isLoading: isCheckingRegistration } = useRegistrationStatus();
  const { data: verificationDetails } = useVerificationDetails();

  useEffect(() => {
    // Generate a unique user ID when component mounts
    setUserId(uuidv4());
  }, []);

  // Check if already verified on-chain
  useEffect(() => {
    if (verificationDetails && verificationDetails.isVerified) {
      setIsVerified(true);
      setVerificationData({
        nationality: verificationDetails.nationality,
        timestamp: verificationDetails.timestamp,
      });
    }
  }, [verificationDetails]);

  // Monitor for verification events
  useVerificationEvents((user, timestamp, nationality) => {
    if (user.toLowerCase() === address?.toLowerCase()) {
      setIsVerified(true);
      setIsWaitingForVerification(false);
      setVerificationData({
        nationality,
        timestamp,
      });
    }
  });

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Create the SelfApp configuration for verification
  const selfApp = isConnected && isRegistered && address ? new SelfAppBuilder({
    appName: "Prove You're Human - Verification",
    scope: "proof-of-human-verification",
    endpoint: process.env.NEXT_PUBLIC_PROOF_OF_HUMAN_CONTRACT!,
    endpointType: "staging_celo", // For Alfajores testnet
    userId: address,
    userIdType: "hex",
    version: 2,
    userDefinedData: "0x" + Buffer.from("verification").toString('hex').padEnd(128, '0'),
    disclosures: {
      issuing_state: true,
      name: true,
      nationality: true,
      minimumAge: 18,
      ofac: true,
    },
    devMode: true,
  }).build() : null;

  const handleSuccess = async (data?: any) => {
    console.log('Verification initiated!', data);
    // For on-chain verification, we don't get immediate results
    // We need to wait for the on-chain transaction
    setIsWaitingForVerification(true);
    setError(null);
  };

  const handleError = (error: any) => {
    console.error('Verification failed:', error);
    setError(error?.message || 'Verification failed');
    setIsVerified(false);
    setIsWaitingForVerification(false);
  };

  const resetVerification = () => {
    setIsVerified(false);
    setVerificationData(null);
    setError(null);
    setUserId(uuidv4()); // Generate new user ID for fresh verification
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Prove You're Human</h1>
              <p className="text-gray-600 mt-1">Verify your identity with Self protocol</p>
            </div>
            <div className="flex items-center space-x-4">
              <WalletConnection />
              <a
                href="https://self.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Learn about Self →
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Wallet Connection Required */}
        {!isConnected && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Please connect your wallet to use on-chain verification
              </p>
              <div className="flex justify-center">
                <WalletConnection />
              </div>
            </div>
          </div>
        )}

        {/* Registration Required */}
        {isConnected && !isRegistered && !isCheckingRegistration && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Register Your Identity
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                You need to register your identity on-chain before verification
              </p>
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                onClick={() => setShowRegistration(true)}
              >
                Register Identity
              </button>
              <p className="text-sm text-gray-500 mt-4">
                This is a one-time process that stores your identity commitment on-chain
              </p>
            </div>
          </div>
        )}

        {/* Waiting for Verification */}
        {isWaitingForVerification && !isVerified && !error && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Verifying On-Chain...
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Your proof is being verified on the blockchain. This may take a few moments.
              </p>
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Waiting for transaction confirmation on Celo Alfajores
                </p>
              </div>
            </div>
          </div>
        )}

        {!isVerified && !error && !isWaitingForVerification && isConnected && isRegistered && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Verify Your Humanity
              </h2>
              <p className="text-lg text-gray-600 mb-2">
                Scan the QR code below with the Self mobile app to prove you're a real person
              </p>
              <p className="text-sm text-gray-500">
                This will verify your passport without revealing sensitive information
              </p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center mb-8">
              <div className="p-6 bg-gray-50 rounded-xl">
                {selfApp ? (
                  <SelfQRcodeWrapper
                    selfApp={selfApp}
                    onSuccess={handleSuccess}
                    onError={handleError}
                    size={280}
                  />
                ) : (
                  <div className="w-[280px] h-[280px] flex items-center justify-center">
                    <p className="text-gray-500">Loading...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">How to verify:</h3>
              <ol className="text-left text-blue-800 space-y-2">
                <li className="flex items-start">
                  <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                  <a href="https://apps.apple.com/app/self/id6448697253" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Download</a>&nbsp;the Self app on your mobile device                </li>
                <li className="flex items-start">
                  <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                  Scan your passport with the Self app
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                  Scan this QR code to prove your humanity
                </li>
              </ol>
            </div>

            <div className="mt-6 text-xs text-gray-400">
              User ID: {userId.substring(0, 8)}...
            </div>
          </div>
        )}

        {/* Success State */}
        {isVerified && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-green-900 mb-4">
                ✅ Verified Human!
              </h2>
              <p className="text-lg text-green-700 mb-6">
                Your passport has been successfully verified. You are confirmed to be a real person!
              </p>
            </div>

            {/* Verification Details */}
            {verificationData && (
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-green-900 mb-3">On-Chain Verification Details:</h3>
                <div className="text-left text-green-800 space-y-2">
                  <p><strong>Status:</strong> Verified On-Chain ✓</p>
                  <p><strong>Verified At:</strong> {verificationData.timestamp ? new Date(Number(verificationData.timestamp) * 1000).toLocaleString() : 'Just now'}</p>
                  <p><strong>Wallet:</strong> {address?.substring(0, 6)}...{address?.substring(address.length - 4)}</p>
                  {verificationData.nationality && (
                    <p><strong>Nationality:</strong> {verificationData.nationality}</p>
                  )}
                  <p><strong>Contract:</strong> 
                    <a 
                      href={`https://alfajores.celoscan.io/address/${process.env.NEXT_PUBLIC_PROOF_OF_HUMAN_CONTRACT}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-green-600 hover:text-green-800 underline"
                    >
                      View on Celoscan
                    </a>
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={resetVerification}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Verify Another Person
            </button>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-red-900 mb-4">
                Verification Failed
              </h2>
              <p className="text-lg text-red-700 mb-6">
                Unable to verify your humanity. Please try again.
              </p>
              <div className="bg-red-50 rounded-lg p-4 mb-6">
                <p className="text-red-800 text-sm">
                  <strong>Error:</strong> {error}
                </p>
              </div>
            </div>

            <button
              onClick={resetVerification}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-gray-500">
          <p>Powered by <a href="https://self.xyz" className="text-blue-600 hover:underline">Self Protocol</a></p>
          <p className="text-sm mt-2">Secure, private, decentralized identity verification</p>
        </div>
      </footer>

      {/* Registration Modal */}
      {showRegistration && (
        <RegistrationFlow
          onClose={() => setShowRegistration(false)}
          onSuccess={() => {
            setShowRegistration(false);
            // Refresh the page to show verification QR
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}