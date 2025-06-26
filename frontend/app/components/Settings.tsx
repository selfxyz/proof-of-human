'use client';

import React from 'react';
import { useSettings } from '../hooks/useSettings';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Settings({ isOpen, onClose }: SettingsProps) {
  const { settings, toggleMockPassport } = useSettings();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
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
          <div className="space-y-6">
            {/* Mock Passport Toggle */}
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Use Mock Passport</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Enable this for testing without a real passport
                  </p>
                </div>
                <button
                  onClick={toggleMockPassport}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.useMockPassport ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.useMockPassport ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              {/* Status indicator */}
              <div className="mt-3 p-3 rounded-lg bg-gray-50">
                <p className="text-sm text-gray-600">
                  <strong>Current mode:</strong>{' '}
                  {settings.useMockPassport ? (
                    <span className="text-blue-600">Mock Passport (Testing)</span>
                  ) : (
                    <span className="text-green-600">Real Passport (Production)</span>
                  )}
                </p>
              </div>
            </div>

            {/* Information */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">About Passport Modes</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Mock:</strong> Use for workshops and testing</li>
                <li>• <strong>Real:</strong> Requires an actual passport with NFC</li>
                <li>• Both modes create real on-chain proofs</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}