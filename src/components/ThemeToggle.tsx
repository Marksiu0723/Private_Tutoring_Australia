import React, { useState, useRef, useEffect } from 'react';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { Sun, Moon, Laptop, Check } from 'lucide-react';

interface ThemeToggleProps {
  variant?: 'compact' | 'segmented' | 'dropdown';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'compact', className = '' }) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  // Segmented Pill Control (great for mobile menus or settings panels)
  if (variant === 'segmented') {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-full bg-[#E8E4D9] dark:bg-[#2A2A22] border border-[#D1C9BC] dark:border-[#38382E] ${className}`}
        role="group"
        aria-label="Color theme selector"
      >
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            theme === 'light'
              ? 'bg-white dark:bg-[#1E1E18] text-[#5A5A40] dark:text-[#A3B18A] shadow-xs'
              : 'text-[#6B6658] dark:text-[#A6A295] hover:text-[#2D2C27] dark:hover:text-[#EDEAE1]'
          }`}
          title="Light Theme"
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Light</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            theme === 'dark'
              ? 'bg-white dark:bg-[#1E1E18] text-[#5A5A40] dark:text-[#A3B18A] shadow-xs'
              : 'text-[#6B6658] dark:text-[#A6A295] hover:text-[#2D2C27] dark:hover:text-[#EDEAE1]'
          }`}
          title="Dark Theme"
        >
          <Moon className="w-3.5 h-3.5" />
          <span>Dark</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('system')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            theme === 'system'
              ? 'bg-white dark:bg-[#1E1E18] text-[#5A5A40] dark:text-[#A3B18A] shadow-xs'
              : 'text-[#6B6658] dark:text-[#A6A295] hover:text-[#2D2C27] dark:hover:text-[#EDEAE1]'
          }`}
          title="System Preference"
        >
          <Laptop className="w-3.5 h-3.5" />
          <span>Auto</span>
        </button>
      </div>
    );
  }

  // Compact Popover or direct toggle
  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      <button
        id="theme-toggle-button"
        type="button"
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="p-2 rounded-full text-[#5A5A40] dark:text-[#C6D4AB] bg-[#F5F2ED] dark:bg-[#25251F] hover:bg-[#E8E4D9] dark:hover:bg-[#2E2E25] border border-[#E8E4D9] dark:border-[#38382E] transition-all cursor-pointer flex items-center justify-center shadow-2xs"
        aria-label={`Current theme: ${theme} (${resolvedTheme}). Click to change.`}
        title={`Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
      >
        {resolvedTheme === 'dark' ? (
          <Moon className="w-4 h-4 text-[#A3B18A]" />
        ) : (
          <Sun className="w-4 h-4 text-[#5A5A40]" />
        )}
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white dark:bg-[#1E1E18] border border-[#E8E4D9] dark:border-[#38382E] shadow-xl py-1.5 z-50 text-xs animate-in fade-in-50 zoom-in-95">
          <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#8C867A] dark:text-[#7A7568] border-b border-[#E8E4D9] dark:border-[#2D2D24] mb-1">
            Theme Preference
          </div>

          <button
            type="button"
            onClick={() => {
              setTheme('light');
              setDropdownOpen(false);
            }}
            className={`w-full px-3.5 py-2 text-left flex items-center justify-between hover:bg-[#F5F2ED] dark:hover:bg-[#282820] transition-colors cursor-pointer ${
              theme === 'light'
                ? 'font-semibold text-[#5A5A40] dark:text-[#A3B18A] bg-[#F5F2ED]/60 dark:bg-[#282820]/60'
                : 'text-[#4A4A40] dark:text-[#EDEAE1]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sun className="w-3.5 h-3.5 text-[#5A5A40] dark:text-[#A3B18A]" />
              <span>Light</span>
            </div>
            {theme === 'light' && <Check className="w-3.5 h-3.5 text-[#5A5A40] dark:text-[#A3B18A]" />}
          </button>

          <button
            type="button"
            onClick={() => {
              setTheme('dark');
              setDropdownOpen(false);
            }}
            className={`w-full px-3.5 py-2 text-left flex items-center justify-between hover:bg-[#F5F2ED] dark:hover:bg-[#282820] transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'font-semibold text-[#5A5A40] dark:text-[#A3B18A] bg-[#F5F2ED]/60 dark:bg-[#282820]/60'
                : 'text-[#4A4A40] dark:text-[#EDEAE1]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Moon className="w-3.5 h-3.5 text-[#5A5A40] dark:text-[#A3B18A]" />
              <span>Dark</span>
            </div>
            {theme === 'dark' && <Check className="w-3.5 h-3.5 text-[#5A5A40] dark:text-[#A3B18A]" />}
          </button>

          <button
            type="button"
            onClick={() => {
              setTheme('system');
              setDropdownOpen(false);
            }}
            className={`w-full px-3.5 py-2 text-left flex items-center justify-between hover:bg-[#F5F2ED] dark:hover:bg-[#282820] transition-colors cursor-pointer ${
              theme === 'system'
                ? 'font-semibold text-[#5A5A40] dark:text-[#A3B18A] bg-[#F5F2ED]/60 dark:bg-[#282820]/60'
                : 'text-[#4A4A40] dark:text-[#EDEAE1]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Laptop className="w-3.5 h-3.5 text-[#5A5A40] dark:text-[#A3B18A]" />
              <div className="flex flex-col">
                <span>System</span>
                <span className="text-[10px] text-[#8C867A] dark:text-[#888377] font-normal">
                  Auto ({resolvedTheme})
                </span>
              </div>
            </div>
            {theme === 'system' && <Check className="w-3.5 h-3.5 text-[#5A5A40] dark:text-[#A3B18A]" />}
          </button>
        </div>
      )}
    </div>
  );
};
