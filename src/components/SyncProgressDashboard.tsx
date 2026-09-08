import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Gauge,
  Clock,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileCheck,
  Sparkles,
  Layers,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { SyncStats, TransferItem, ThrottleProfile } from '../types';
import { formatBytes, formatDuration, formatSpeed } from '../utils/formatters';

interface SyncProgressDashboardProps {
  stats: SyncStats;
  currentItem?: TransferItem;
  throttleProfile: ThrottleProfile;
  wakeLockActive: boolean;
  onStartSync: () => void;
  onPauseSync: () => void;
  onResumeSync: () => void;
  onResetSync: () => void;
  onChangeThrottle: (profile: ThrottleProfile) => void;
}

export const SyncProgressDashboard: React.FC<SyncProgressDashboardProps> = ({
  stats,
  currentItem,
  throttleProfile,
  wakeLockActive,
  onStartSync,
  onPauseSync,
  onResumeSync,
  onResetSync,
  onChangeThrottle,
}) => {
  const percent = stats.totalBytes > 0
    ? Math.min(100, Math.round((stats.transferredBytes / stats.totalBytes) * 100))
    : 0;

  const isSyncing = stats.status === 'syncing';
  const isPaused = stats.status === 'paused';
  const isCompleted = stats.status === 'completed';
  const isIdle = stats.status === 'idle';

  return (
    <div
      id="sync-progress-dashboard"
      className="bg-neutral-900/80 border border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-2xl relative overflow-hidden"
    >
      {/* Background soft glow when syncing */}
      {isSyncing && (
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      )}

      {/* Header bar with status indicator & controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white tracking-tight">
              Transfer Pipeline
            </h2>
            {isSyncing && (
              <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Active Background Sync
              </span>
            )}
            {isPaused && (
              <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Sync Paused
              </span>
            )}
            {isCompleted && (
              <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-medium border border-sky-500/30">
                <CheckCircle2 className="w-3 h-3 text-sky-400" />
                Transfer Complete
              </span>
            )}
            {isIdle && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-medium">
                Ready to sync
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Preserving Apple Live Photos, original resolution, EXIF capture dates, and GPS metadata.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isIdle && (
            <button
              id="btn-start-sync"
              onClick={onStartSync}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Start Background Transfer</span>
            </button>
          )}

          {isSyncing && (
            <button
              id="btn-pause-sync"
              onClick={onPauseSync}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-medium text-xs flex items-center gap-2 border border-amber-500/30 transition-all cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5 fill-amber-300" />
              <span>Pause Sync</span>
            </button>
          )}

          {isPaused && (
            <button
              id="btn-resume-sync"
              onClick={onResumeSync}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Resume Sync</span>
            </button>
          )}

          {(isCompleted || isPaused || isSyncing) && (
            <button
              id="btn-reset-sync"
              onClick={onResetSync}
              title="Reset queue and rescan"
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs border border-white/10 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Progress Metric Banner */}
      <div className="my-5">
        <div className="flex items-end justify-between mb-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-white">
              {percent}%
            </span>
            <span className="text-xs text-neutral-400">
              ({formatBytes(stats.transferredBytes)} / {formatBytes(stats.totalBytes)})
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-neutral-400 font-medium block">
              {stats.processedItems} of {stats.totalItems.toLocaleString()} items
            </span>
            <span className="text-[11px] text-neutral-400 font-mono">
              {stats.skippedDuplicates > 0 && `${stats.skippedDuplicates} duplicates skipped`}
            </span>
          </div>
        </div>

        {/* Multi-segmented Progress Bar */}
        <div className="w-full h-3 bg-neutral-800 rounded-full overflow-hidden p-0.5 border border-white/5 relative">
          <div
            style={{ width: `${percent}%` }}
            className={`h-full rounded-full transition-all duration-300 ${
              isCompleted
                ? 'bg-emerald-500'
                : isPaused
                ? 'bg-amber-500'
                : 'bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500'
            }`}
          />
        </div>
      </div>

      {/* Detailed Live Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-white/5">
        {/* Speed */}
        <div className="p-2.5 rounded-xl bg-neutral-800/40 border border-white/5">
          <div className="flex items-center gap-1.5 text-neutral-400 text-[11px] mb-1">
            <Gauge className="w-3.5 h-3.5 text-sky-400" />
            <span>Transfer Rate</span>
          </div>
          <span className="text-sm sm:text-base font-semibold font-mono text-neutral-200">
            {isSyncing ? formatSpeed(stats.currentSpeedBytesPerSec) : '0 KB/s'}
          </span>
        </div>

        {/* ETA */}
        <div className="p-2.5 rounded-xl bg-neutral-800/40 border border-white/5">
          <div className="flex items-center gap-1.5 text-neutral-400 text-[11px] mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Time Remaining</span>
          </div>
          <span className="text-sm sm:text-base font-semibold font-mono text-neutral-200">
            {isSyncing ? formatDuration(stats.remainingSeconds) : isCompleted ? 'Completed' : '—'}
          </span>
        </div>

        {/* Duplicates Saved */}
        <div className="p-2.5 rounded-xl bg-neutral-800/40 border border-white/5">
          <div className="flex items-center gap-1.5 text-neutral-400 text-[11px] mb-1">
            <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Deduplication</span>
          </div>
          <span className="text-sm sm:text-base font-semibold font-mono text-emerald-300">
            {stats.skippedDuplicates} skipped
          </span>
        </div>

        {/* Background Status */}
        <div className="p-2.5 rounded-xl bg-neutral-800/40 border border-white/5">
          <div className="flex items-center gap-1.5 text-neutral-400 text-[11px] mb-1">
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            <span>MacBook State</span>
          </div>
          <span className="text-sm sm:text-base font-semibold text-neutral-200 truncate block">
            {wakeLockActive ? 'Awake Protected' : 'Low Power'}
          </span>
        </div>
      </div>

      {/* Speed Throttler Profile Segmented Control */}
      <div className="mt-4 pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-neutral-400">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-medium">Background Throttle Pacing:</span>
        </div>

        <div className="flex items-center gap-1 bg-neutral-800/80 p-1 rounded-xl border border-white/10">
          <button
            id="btn-throttle-eco"
            onClick={() => onChangeThrottle('eco')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              throttleProfile === 'eco'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Eco (4 MB/s)
          </button>
          <button
            id="btn-throttle-balanced"
            onClick={() => onChangeThrottle('balanced')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              throttleProfile === 'balanced'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Balanced (15 MB/s)
          </button>
          <button
            id="btn-throttle-turbo"
            onClick={() => onChangeThrottle('turbo')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              throttleProfile === 'turbo'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Turbo (Max)
          </button>
        </div>
      </div>

      {/* Active Processing Item Preview Card */}
      {currentItem && isSyncing && (
        <div
          id="active-item-preview-card"
          className="mt-4 p-3 rounded-xl bg-neutral-800/90 border border-sky-500/30 flex items-center gap-3 animate-fadeIn"
        >
          {currentItem.previewUrl ? (
            <img
              src={currentItem.previewUrl}
              alt={currentItem.name}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-lg object-cover border border-white/10 shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-neutral-700 flex items-center justify-center shrink-0 text-neutral-400">
              <HardDrive className="w-6 h-6" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-white truncate max-w-[280px]">
                {currentItem.name}
              </span>
              <span className="text-[11px] font-mono text-sky-400">
                {currentItem.progress}%
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-neutral-400">
              <span>{formatBytes(currentItem.size)}</span>
              <span>•</span>
              <span className="truncate">{currentItem.album}</span>
              {currentItem.isLivePhoto && (
                <>
                  <span>•</span>
                  <span className="text-amber-400 flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" />
                    Live Photo
                  </span>
                </>
              )}
            </div>

            {/* Individual Item Mini Progress */}
            <div className="w-full h-1.5 bg-neutral-700 rounded-full mt-2 overflow-hidden">
              <div
                style={{ width: `${currentItem.progress}%` }}
                className="h-full bg-sky-400 rounded-full transition-all duration-150"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
