import React from 'react';
import { ShieldCheck, Zap, Battery, BatteryCharging, Eye, Compass, Moon, HardDrive, BookOpen } from 'lucide-react';
import { ThrottleProfile } from '../types';

interface MacWindowHeaderProps {
  wakeLockActive: boolean;
  batteryLevel: number;
  isCharging: boolean;
  throttleProfile: ThrottleProfile;
  currentSpeed: number;
  isSyncing: boolean;
  isMenuBarMode: boolean;
  onToggleMenuBarMode: () => void;
  onReset?: () => void;
  onOpenRealAccountGuide?: () => void;
}

export const MacWindowHeader: React.FC<MacWindowHeaderProps> = ({
  wakeLockActive,
  batteryLevel,
  isCharging,
  throttleProfile,
  isSyncing,
  isMenuBarMode,
  onToggleMenuBarMode,
  onOpenRealAccountGuide,
}) => {
  return (
    <div
      id="mac-titlebar"
      className="bg-neutral-900/95 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between select-none text-xs text-neutral-400 z-30"
    >
      {/* macOS Traffic Lights */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 pr-3 group">
          <button
            id="btn-traffic-close"
            aria-label="Close"
            className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] hover:opacity-80 transition-opacity flex items-center justify-center text-[8px] text-[#780000] font-bold cursor-default"
          >
            <span className="opacity-0 group-hover:opacity-100 leading-none">×</span>
          </button>
          <button
            id="btn-traffic-minimize"
            aria-label="Minimize"
            className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] hover:opacity-80 transition-opacity flex items-center justify-center text-[8px] text-[#805500] font-bold cursor-default"
          >
            <span className="opacity-0 group-hover:opacity-100 leading-none">−</span>
          </button>
          <button
            id="btn-traffic-maximize"
            aria-label="Maximize"
            className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] hover:opacity-80 transition-opacity flex items-center justify-center text-[8px] text-[#055811] font-bold cursor-default"
          >
            <span className="opacity-0 group-hover:opacity-100 leading-none">+</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-neutral-300 font-medium pl-1 border-l border-white/10">
          <HardDrive className="w-3.5 h-3.5 text-sky-400" />
          <span className="tracking-tight text-neutral-200">MacBook Pro Sync Bridge</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-neutral-400 font-mono">
            macOS
          </span>
        </div>
      </div>

      {/* Center title */}
      <div className="text-center font-medium text-neutral-200 flex items-center gap-1.5">
        <span className="text-amber-400 font-semibold">Google Photos</span>
        <span className="text-neutral-500">→</span>
        <span className="text-sky-400 font-semibold">iCloud Photos</span>
      </div>

      {/* Right MacBook status metrics */}
      <div className="flex items-center gap-2.5">
        {/* Background Wake Lock Indicator */}
        <div
          id="badge-wakelock"
          title={wakeLockActive ? 'MacBook Awake Lock Active (Screen & Network stay on)' : 'Mac Sleep Allowed'}
          className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
            wakeLockActive
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              : 'bg-neutral-800 text-neutral-400 border border-neutral-700/50'
          }`}
        >
          {wakeLockActive ? (
            <Eye className="w-3 h-3 text-emerald-400" />
          ) : (
            <Moon className="w-3 h-3 text-neutral-500" />
          )}
          <span className="hidden md:inline text-[11px] font-medium">
            {wakeLockActive ? 'Awake Active' : 'Eco Standby'}
          </span>
        </div>

        {/* Battery Indicator */}
        <div
          id="badge-battery"
          title={`Battery: ${batteryLevel}% ${isCharging ? '(Charging)' : '(On Battery)'}`}
          className="flex items-center gap-1 px-2 py-1 rounded-md bg-neutral-800/80 border border-white/10 text-neutral-300 text-[11px]"
        >
          {isCharging ? (
            <BatteryCharging className="w-3 h-3 text-emerald-400" />
          ) : (
            <Battery className="w-3 h-3 text-neutral-400" />
          )}
          <span className="font-mono">{batteryLevel}%</span>
        </div>

        {/* Profile Speed Tag */}
        <div
          id="badge-throttle-profile"
          className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-md bg-neutral-800/80 border border-white/10 text-neutral-300 text-[11px] uppercase font-mono"
        >
          <Zap className="w-3 h-3 text-amber-400" />
          <span>{throttleProfile}</span>
        </div>

        {/* Real Account Transfer Guide Trigger */}
        {onOpenRealAccountGuide && (
          <button
            id="btn-header-real-guide"
            onClick={onOpenRealAccountGuide}
            title="Step-by-step instructions for real Google & Apple accounts and iCloud Drive transfer"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 transition-colors text-[11px] font-medium cursor-pointer"
          >
            <BookOpen className="w-3 h-3 text-sky-400" />
            <span className="hidden sm:inline">Mac Transfer Guide</span>
          </button>
        )}

        {/* Menu Bar View Switcher */}
        <button
          id="btn-toggle-menubar-view"
          onClick={onToggleMenuBarMode}
          title={isMenuBarMode ? 'Expand to Standard Mac App Window' : 'Switch to Compact Menu Bar Popover'}
          className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 hover:bg-white/15 text-neutral-200 border border-white/10 transition-colors text-[11px] font-medium cursor-pointer"
        >
          <Compass className="w-3 h-3 text-sky-400" />
          <span className="hidden sm:inline">{isMenuBarMode ? 'Window View' : 'Menu Bar Mode'}</span>
        </button>
      </div>
    </div>
  );
};
