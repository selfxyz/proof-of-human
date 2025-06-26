'use client';

import React, { useState } from 'react';
import SelfQRcodeWrapper, { SelfAppBuilder } from '@selfxyz/qrcode';
import { useAccount } from 'wagmi';
import { useRegistrationStatus } from '../hooks/useRegistrationStatus';
import { useSettings } from '../hooks/useSettings';

interface RegistrationFlowProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function RegistrationFlow({ onClose, onSuccess }: RegistrationFlowProps) {
  const { address } = useAccount();
  const { markAsRegistered } = useRegistrationStatus();
  const { settings } = useSettings();
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  if (!address) {
    return null;
  }

  // Create registration QR code configuration
  const registrationApp = new SelfAppBuilder({
    appName: "Prove You're Human - Registration",
    scope: "proof-of-human-registration",
    endpoint: process.env.NEXT_PUBLIC_PROOF_OF_HUMAN_CONTRACT!,
    endpointType: "staging_celo", // For Alfajores testnet
    userId: address,
    userIdType: "hex",
    version: 2,
    userDefinedData: "0x" + Buffer.from("registration").toString('hex').padEnd(128, '0'),
    disclosures: {
      // For registration, we only need minimal disclosure
      issuing_state: true,
    },
    mockPassport: settings.useMockPassport,
    devMode: true,
  }).build();

  const handleRegistrationSuccess = async (data?: any) => {
    console.log('Registration successful!', data);
    setIsRegistering(false);
    markAsRegistered();
    onSuccess();
  };

  const handleRegistrationError = (error: any) => {
    console.error('Registration failed:', error);
    setRegistrationError(error?.message || 'Registration failed');
    setIsRegistering(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Register Your Identity</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!registrationError ? (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  One-Time Registration
                </h3>
                <p className="text-gray-600 mb-6">
                  This process creates your on-chain identity commitment. You only need to do this once.
                </p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-6">
                <div className="p-6 bg-gray-50 rounded-xl">
                  <SelfQRcodeWrapper
                    selfApp={registrationApp}
                    onSuccess={handleRegistrationSuccess}
                    onError={handleRegistrationError}
                    size={280}
                  />
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-purple-50 rounded-lg p-6">
                <h4 className="font-semibold text-purple-900 mb-3">How to register:</h4>
                <ol className="text-left text-purple-800 space-y-2">
                  <li className="flex items-start">
                    <span className="bg-purple-200 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                    Open the Self app on your mobile device
                  </li>
                  <li className="flex items-start">
                    <span className="bg-purple-200 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                    Scan this QR code
                  </li>
                  <li className="flex items-start">
                    <span className="bg-purple-200 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                    Approve the registration (no gas fees required)
                  </li>
                </ol>
              </div>

              {isRegistering && (
                <div className="mt-4 text-center text-sm text-gray-600">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600 mx-auto mb-2"></div>
                  Processing registration...
                </div>
              )}
            </>
          ) : (
            /* Error State */
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-red-900 mb-2">
                Registration Failed
              </h3>
              <p className="text-red-700 mb-6">
                {registrationError}
              </p>
              <button
                onClick={() => setRegistrationError(null)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}