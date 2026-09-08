import React, { useState } from 'react';
import {
  ShieldCheck,
  Eye,
  BatteryCharging,
  Sliders,
  Terminal,
  Copy,
  Check,
  Download,
  FileCode,
  Sparkles,
  RefreshCw,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SyncSettings, ThrottleProfile } from '../types';
import { generateMacPhotosImportScript, generateLaunchdPlist } from '../utils/macScriptGenerator';

interface BackgroundEfficiencyPanelProps {
  settings: SyncSettings;
  wakeLockSupported: boolean;
  wakeLockActive: boolean;
  batteryLevel: number;
  isCharging: boolean;
  onUpdateSettings: (newSettings: Partial<SyncSettings>) => void;
}

export const BackgroundEfficiencyPanel: React.FC<BackgroundEfficiencyPanelProps> = ({
  settings,
  wakeLockSupported,
  wakeLockActive,
  batteryLevel,
  isCharging,
  onUpdateSettings,
}) => {
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedPlist, setCopiedPlist] = useState(false);
  const [showCliGuide, setShowCliGuide] = useState(false);

  const macScript = generateMacPhotosImportScript();
  const plistXml = generateLaunchdPlist();

  const handleCopyScript = () => {
    navigator.clipboard.writeText(macScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleCopyPlist = () => {
    navigator.clipboard.writeText(plistXml);
    setCopiedPlist(true);
    setTimeout(() => setCopiedPlist(false), 2000);
  };

  const handleDownloadScript = () => {
    const blob = new Blob([macScript], { type: 'application/x-sh' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'import-to-mac-photos.command';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="background-efficiency-panel"
      className="bg-neutral-900/70 border border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-xl my-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              MacBook Background & Efficiency Settings
            </h3>
            <p className="text-xs text-neutral-400">
              Low-power operation, sleep prevention, and native Apple Photos integration
            </p>
          </div>
        </div>

        <button
          id="btn-toggle-cli-guide"
          onClick={() => setShowCliGuide(!showCliGuide)}
          className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>{showCliGuide ? 'Hide Native Script' : 'macOS Background Daemon'}</span>
          {showCliGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Toggles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {/* Toggle 1: Wake Lock (Keep MacBook Awake) */}
        <div className="bg-neutral-800/50 border border-white/5 rounded-xl p-3.5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div
              className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                wakeLockActive
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-neutral-700 text-neutral-400'
              }`}
            >
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <label htmlFor="toggle-wake-lock" className="text-xs font-semibold text-white block cursor-pointer">
                Prevent MacBook Sleep
              </label>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                Keeps network and background sync active while transfer is running. Automatically releases sleep lock when done.
              </p>
            </div>
          </div>
          <button
            id="toggle-wake-lock"
            role="switch"
            aria-checked={settings.preventMacSleep}
            onClick={() => onUpdateSettings({ preventMacSleep: !settings.preventMacSleep })}
            className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 mt-1 ${
              settings.preventMacSleep ? 'bg-emerald-500' : 'bg-neutral-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                settings.preventMacSleep ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Toggle 2: Battery Aware Pause */}
        <div className="bg-neutral-800/50 border border-white/5 rounded-xl p-3.5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div
              className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                !isCharging
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'bg-neutral-700 text-neutral-400'
              }`}
            >
              <BatteryCharging className="w-4 h-4" />
            </div>
            <div>
              <label htmlFor="toggle-pause-battery" className="text-xs font-semibold text-white block cursor-pointer">
                Pause on Battery Power
              </label>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                Automatically pauses heavy cloud uploads when MacBook is unplugged from MagSafe to preserve battery life.
              </p>
            </div>
          </div>
          <button
            id="toggle-pause-battery"
            role="switch"
            aria-checked={settings.pauseOnBattery}
            onClick={() => onUpdateSettings({ pauseOnBattery: !settings.pauseOnBattery })}
            className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 mt-1 ${
              settings.pauseOnBattery ? 'bg-emerald-500' : 'bg-neutral-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                settings.pauseOnBattery ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Toggle 3: Smart Deduplication */}
        <div className="bg-neutral-800/50 border border-white/5 rounded-xl p-3.5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-md bg-sky-500/20 text-sky-300 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <label htmlFor="toggle-deduplication" className="text-xs font-semibold text-white block cursor-pointer">
                Smart Deduplication
              </label>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                Compares file hashes & capture dates against existing iCloud Photos to avoid uploading duplicates.
              </p>
            </div>
          </div>
          <button
            id="toggle-deduplication"
            role="switch"
            aria-checked={settings.deduplicateFiles}
            onClick={() => onUpdateSettings({ deduplicateFiles: !settings.deduplicateFiles })}
            className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 mt-1 ${
              settings.deduplicateFiles ? 'bg-sky-500' : 'bg-neutral-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                settings.deduplicateFiles ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Toggle 4: Apple Live Photos Preservation */}
        <div className="bg-neutral-800/50 border border-white/5 rounded-xl p-3.5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-md bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <label htmlFor="toggle-live-photos" className="text-xs font-semibold text-white block cursor-pointer">
                Preserve Apple Live Photos
              </label>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                Automatically pairs HEIC stills with short video clips (.mov) into native Apple Live Photos in iCloud.
              </p>
            </div>
          </div>
          <button
            id="toggle-live-photos"
            role="switch"
            aria-checked={settings.preserveLivePhotos}
            onClick={() => onUpdateSettings({ preserveLivePhotos: !settings.preserveLivePhotos })}
            className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 mt-1 ${
              settings.preserveLivePhotos ? 'bg-rose-500' : 'bg-neutral-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                settings.preserveLivePhotos ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Expandable macOS Terminal Script & Background Daemon Section */}
      {showCliGuide && (
        <div className="mt-4 pt-4 border-t border-white/10 bg-neutral-950/60 rounded-xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-sky-400" />
              <h4 className="text-xs font-semibold text-white">
                macOS Native Photos Importer (.command)
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <button
                id="btn-copy-mac-script"
                onClick={handleCopyScript}
                className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedScript ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedScript ? 'Copied' : 'Copy Script'}</span>
              </button>
              <button
                id="btn-download-mac-script"
                onClick={handleDownloadScript}
                className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Download .command</span>
              </button>
            </div>
          </div>

          <p className="text-[11px] text-neutral-400 mb-2 leading-relaxed">
            Run this native script on your MacBook to import photos directly into macOS <span className="text-neutral-200 font-mono">Photos.app</span> using AppleScript. Photos.app then automatically uploads to iCloud Photos in the background.
          </p>

          <pre className="bg-black/50 p-3 rounded-lg text-[10px] font-mono text-neutral-300 overflow-x-auto max-h-40 border border-white/5">
            {macScript}
          </pre>

          {/* Launchd Daemon info */}
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-[11px] text-neutral-400">
              Need 24/7 background launchd daemon configuration?
            </span>
            <button
              id="btn-copy-launchd-plist"
              onClick={handleCopyPlist}
              className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
            >
              {copiedPlist ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedPlist ? 'Plist Copied' : 'Copy launchd .plist'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
