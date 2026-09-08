import React from 'react';
import {
  Maximize2,
  Play,
  Pause,
  Cloud,
  HardDrive,
  Zap,
  CheckCircle2,
  ArrowUpRight,
  Eye,
  Sliders,
} from 'lucide-react';
import { SyncStats, TransferItem, ThrottleProfile } from '../types';
import { formatBytes, formatDuration, formatSpeed } from '../utils/formatters';

interface MenuBarCompanionProps {
  stats: SyncStats;
  currentItem?: TransferItem;
  throttleProfile: ThrottleProfile;
  wakeLockActive: boolean;
  onStartSync: () => void;
  onPauseSync: () => void;
  onResumeSync: () => void;
  onChangeThrottle: (profile: ThrottleProfile) => void;
  onExpandWindow: () => void;
}

export const MenuBarCompanion: React.FC<MenuBarCompanionProps> = ({
  stats,
  currentItem,
  throttleProfile,
  wakeLockActive,
  onStartSync,
  onPauseSync,
  onResumeSync,
  onChangeThrottle,
  onExpandWindow,
}) => {
  const percent = stats.totalBytes > 0
    ? Math.min(100, Math.round((stats.transferredBytes / stats.totalBytes) * 100))
    : 0;

  const isSyncing = stats.status === 'syncing';
  const isPaused = stats.status === 'paused';
  const isCompleted = stats.status === 'completed';

  return (
    <div
      id="mac-menubar-companion"
      className="max-w-md mx-auto my-8 bg-neutral-900/95 border border-white/15 rounded-2xl shadow-2xl p-4 text-white backdrop-blur-xl animate-fadeIn"
    >
      {/* Top simulated macOS Menu Bar Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-neutral-200">Google Photos → iCloud</span>
        </div>

        <button
          id="btn-expand-menubar-window"
          onClick={onExpandWindow}
          title="Expand to Full Mac Window"
          className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-neutral-300 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
        >
          <Maximize2 className="w-3 h-3" />
          <span>Full Window</span>
        </button>
      </div>

      {/* Progress & Speed */}
      <div className="py-4 text-center">
        <div className="text-3xl font-bold font-mono tracking-tight text-white mb-1">
          {percent}%
        </div>
        <p className="text-xs text-neutral-400 font-mono">
          {formatBytes(stats.transferredBytes)} of {formatBytes(stats.totalBytes)}
        </p>

        {/* Mini progress bar */}
        <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden my-3">
          <div
            style={{ width: `${percent}%` }}
            className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full transition-all duration-300"
          />
        </div>

        <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
          <span>Speed: <strong className="text-white font-mono">{isSyncing ? formatSpeed(stats.currentSpeedBytesPerSec) : '0 KB/s'}</strong></span>
          <span>ETA: <strong className="text-white font-mono">{isSyncing ? formatDuration(stats.remainingSeconds) : '—'}</strong></span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2 p-2.5 bg-neutral-800/60 rounded-xl border border-white/5 my-2">
        <div className="flex items-center gap-1">
          {stats.status === 'idle' && (
            <button
              id="btn-menubar-start"
              onClick={onStartSync}
              className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>Start Sync</span>
            </button>
          )}

          {isSyncing && (
            <button
              id="btn-menubar-pause"
              onClick={onPauseSync}
              className="px-3 py-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-amber-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Pause className="w-3 h-3 fill-amber-300" />
              <span>Pause</span>
            </button>
          )}

          {isPaused && (
            <button
              id="btn-menubar-resume"
              onClick={onResumeSync}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>Resume</span>
            </button>
          )}
        </div>

        {/* Speed Pacing Profile */}
        <div className="flex items-center gap-1 bg-neutral-900/80 p-0.5 rounded-lg border border-white/10 text-[10px]">
          <button
            onClick={() => onChangeThrottle('eco')}
            className={`px-1.5 py-0.5 rounded cursor-pointer ${
              throttleProfile === 'eco' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-neutral-400'
            }`}
          >
            Eco
          </button>
          <button
            onClick={() => onChangeThrottle('balanced')}
            className={`px-1.5 py-0.5 rounded cursor-pointer ${
              throttleProfile === 'balanced' ? 'bg-sky-500/20 text-sky-300 font-semibold' : 'text-neutral-400'
            }`}
          >
            Balanced
          </button>
          <button
            onClick={() => onChangeThrottle('turbo')}
            className={`px-1.5 py-0.5 rounded cursor-pointer ${
              throttleProfile === 'turbo' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-neutral-400'
            }`}
          >
            Turbo
          </button>
        </div>
      </div>

      {/* Current item mini preview */}
      {currentItem && isSyncing && (
        <div className="mt-3 p-2 bg-neutral-800/40 rounded-xl border border-white/5 flex items-center gap-2.5 text-xs text-neutral-300">
          {currentItem.previewUrl ? (
            <img
              src={currentItem.previewUrl}
              alt={currentItem.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-lg object-cover border border-white/10 shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-neutral-700 flex items-center justify-center shrink-0">
              <HardDrive className="w-4 h-4 text-neutral-400" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <span className="truncate block font-medium text-white text-[11px]">
              {currentItem.name}
            </span>
            <span className="text-[10px] text-neutral-400 font-mono">
              {currentItem.progress}% • {formatBytes(currentItem.size)}
            </span>
          </div>
        </div>
      )}

      {/* Footer info */}
      <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
        <span className="flex items-center gap-1">
          <Eye className="w-3 h-3 text-emerald-400" />
          {wakeLockActive ? 'Awake Protected' : 'Low Power'}
        </span>
        <span className="text-sky-400 font-mono">
          {stats.processedItems} / {stats.totalItems.toLocaleString()} items
        </span>
      </div>
    </div>
  );
};
