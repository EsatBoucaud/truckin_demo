import React, { useRef } from 'react';
import { X, Moon, Sun, Upload, Trash2 } from 'lucide-react';
import { type AccentColor, useTheme } from '../contexts/ThemeContext';
import { cn } from '../utils/cn';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ACCENT_COLORS = [
  { id: 'blue', hex: '#3b82f6', label: 'Blue' },
  { id: 'purple', hex: '#a855f7', label: 'Purple' },
  { id: 'emerald', hex: '#10b981', label: 'Emerald' },
  { id: 'rose', hex: '#f43f5e', label: 'Rose' },
  { id: 'amber', hex: '#f59e0b', label: 'Amber' },
] as const satisfies ReadonlyArray<{ id: AccentColor; hex: string; label: string }>;

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { mode, setMode, accent, setAccent, backgroundImage, setBackgroundImage } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-zinc-200 dark:border-zinc-800">
        <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight">Settings</h2>
          <button 
            onClick={onClose} 
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Theme Toggle */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Appearance</h3>
            <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              <button
                onClick={() => setMode('light')}
                className={cn(
                  "flex-1 flex items-center justify-center space-x-2 py-2 text-sm font-medium rounded-md transition-all",
                  mode === 'light' ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                )}
              >
                <Sun size={16} />
                <span>Light</span>
              </button>
              <button
                onClick={() => setMode('dark')}
                className={cn(
                  "flex-1 flex items-center justify-center space-x-2 py-2 text-sm font-medium rounded-md transition-all",
                  mode === 'dark' ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                )}
              >
                <Moon size={16} />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Accent Color */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Accent Color</h3>
            <div className="flex space-x-3">
              {ACCENT_COLORS.map(c => (
                <button
                  key={c.id}
                  onClick={() => setAccent(c.id)}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110",
                    accent === c.id && "ring-2 ring-offset-2 ring-zinc-400 dark:ring-offset-zinc-900"
                  )}
                  style={{ backgroundColor: c.hex }}
                  title={c.label}
                >
                  {accent === c.id && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                </button>
              ))}
            </div>
          </div>

          {/* Background Image */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Background Image</h3>
            <div className="flex items-center space-x-3">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-medium transition-colors"
              >
                <Upload size={16} />
                <span>Upload Image</span>
              </button>
              {backgroundImage && (
                <button
                  onClick={() => setBackgroundImage(null)}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors"
                >
                  <Trash2 size={16} />
                  <span>Remove</span>
                </button>
              )}
            </div>
            {backgroundImage && (
              <div className="mt-3 relative h-24 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
                <img src={backgroundImage} alt="Background preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
