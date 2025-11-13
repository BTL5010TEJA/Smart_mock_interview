/**
 * Advanced Settings Component
 * Customization panel for theme, preferences, and accessibility
 */

import React, { useState } from 'react';
import { AVATAR_CONFIGS } from '../constants';
import type { UserSettings, ThemeConfig } from '../types';

interface AdvancedSettingsProps {
  currentSettings: UserSettings;
  onSaveSettings: (settings: UserSettings) => void;
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({ currentSettings, onSaveSettings }) => {
  const [settings, setSettings] = useState<UserSettings>(currentSettings);
  
  const handleThemeChange = (mode: 'light' | 'dark' | 'auto') => {
    setSettings({
      ...settings,
      theme: { ...settings.theme, mode }
    });
  };
  
  const handleSave = () => {
    onSaveSettings(settings);
    alert('Settings saved successfully!');
  };
  
  return (
    <div className="advanced-settings bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">⚙️ Advanced Settings</h2>
      
      {/* Theme Settings */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">🎨 Theme</h3>
        <div className="grid grid-cols-3 gap-3">
          {['light', 'dark', 'auto'].map((mode) => (
            <button
              key={mode}
              onClick={() => handleThemeChange(mode as any)}
              className={`p-4 rounded-lg border-2 transition-all ${
                settings.theme.mode === mode
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">
                  {mode === 'light' ? '☀️' : mode === 'dark' ? '🌙' : '🌓'}
                </div>
                <p className="text-sm font-semibold capitalize">{mode}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Avatar Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">👤 Interviewer Avatar</h3>
        <div className="grid grid-cols-3 gap-3">
          {AVATAR_CONFIGS.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => setSettings({ ...settings, selectedAvatar: avatar.id })}
              className={`p-4 rounded-lg border-2 transition-all ${
                settings.selectedAvatar === avatar.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="text-center">
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: avatar.appearance.color }}
                />
                <p className="text-xs font-semibold">{avatar.name}</p>
                <p className="text-xs text-slate-600 capitalize">{avatar.personality}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Interview Settings */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">🎯 Interview Preferences</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Default Difficulty
            </label>
            <select
              value={settings.difficulty}
              onChange={(e) => setSettings({ ...settings, difficulty: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Interview Duration (minutes)
            </label>
            <input
              type="number"
              value={settings.interviewDuration}
              onChange={(e) => setSettings({ ...settings, interviewDuration: parseInt(e.target.value) })}
              min="10"
              max="120"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Language
            </label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Features Toggle */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">🎥 Features</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <span className="text-sm font-medium text-slate-700">Enable Video Analysis</span>
            <input
              type="checkbox"
              checked={settings.videoEnabled}
              onChange={(e) => setSettings({ ...settings, videoEnabled: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </label>
          
          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <span className="text-sm font-medium text-slate-700">Enable Voice Analysis</span>
            <input
              type="checkbox"
              checked={settings.voiceEnabled}
              onChange={(e) => setSettings({ ...settings, voiceEnabled: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>
      
      {/* Accessibility */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">♿ Accessibility</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <span className="text-sm font-medium text-slate-700">High Contrast Mode</span>
            <input
              type="checkbox"
              checked={settings.accessibility.highContrast}
              onChange={(e) => setSettings({
                ...settings,
                accessibility: { ...settings.accessibility, highContrast: e.target.checked }
              })}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </label>
          
          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <span className="text-sm font-medium text-slate-700">Large Text</span>
            <input
              type="checkbox"
              checked={settings.accessibility.largeText}
              onChange={(e) => setSettings({
                ...settings,
                accessibility: { ...settings.accessibility, largeText: e.target.checked }
              })}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </label>
          
          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <span className="text-sm font-medium text-slate-700">Screen Reader Support</span>
            <input
              type="checkbox"
              checked={settings.accessibility.screenReader}
              onChange={(e) => setSettings({
                ...settings,
                accessibility: { ...settings.accessibility, screenReader: e.target.checked }
              })}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>
      
      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
      >
        Save Settings
      </button>
    </div>
  );
};

export default AdvancedSettings;
