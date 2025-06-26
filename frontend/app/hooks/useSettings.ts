'use client';

import { useState, useEffect } from 'react';

const SETTINGS_KEY = 'proof-of-human-settings';

export interface Settings {
  useMockPassport: boolean;
}

const defaultSettings: Settings = {
  useMockPassport: true, // Default to mock for workshops
};

export function useSettings() {
  const [settings, setSettingsState] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettingsState({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
    setIsLoading(false);
  }, []);

  // Save settings to localStorage
  const updateSettings = (updates: Partial<Settings>) => {
    const newSettings = { ...settings, ...updates };
    setSettingsState(newSettings);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const toggleMockPassport = () => {
    updateSettings({ useMockPassport: !settings.useMockPassport });
  };

  return {
    settings,
    isLoading,
    updateSettings,
    toggleMockPassport,
  };
}