import React from 'react';
import { Laptop, CloudLightning, ShieldCheck, Zap, Layers, RefreshCw } from 'lucide-react';
import { TransferMethod } from '../types';

interface TransferModeSelectorProps {
  method: TransferMethod;
  onChangeMethod: (method: TransferMethod) => void;
  isSyncing: boolean;
}

export const TransferModeSelector: React.FC<TransferModeSelectorProps> = ({
  method,
  onChangeMethod,
  isSyncing,
}) => {
  return (
    <div id="transfer-mode-selector" className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
      {/* Option 1: Native Mac Background Engine */}
      <button
        id="btn-mode-mac-engine"
        onClick={() => !isSyncing && onChangeMethod('mac_engine')}
        disabled={isSyncing}
        className={`text-left p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
          method === 'mac_engine'
            ? 'bg-sky-500/10 border-sky-500/50 shadow-lg shadow-sky-500/5'
            : 'bg-neutral-900/40 border-white/5 hover:border-white/15 opacity-75 hover:opacity-100'
        } ${isSyncing ? 'cursor-not-allowed opacity-60' : ''}`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              method === 'mac_engine'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                : 'bg-neutral-800 text-neutral-400'
            }`}
          >
            <Laptop className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-white">MacBook Background Engine</h4>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300">
                Recommended
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Syncs with macOS Photos app & iCloud directly. Background throttle control, Live Photos pairing, and instant duplicate detection.
            </p>
          </div>
        </div>
      </button>

      {/* Option 2: Direct Apple & Google Cloud-to-Cloud */}
      <button
        id="btn-mode-cloud-direct"
        onClick={() => !isSyncing && onChangeMethod('cloud_direct')}
        disabled={isSyncing}
        className={`text-left p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
          method === 'cloud_direct'
            ? 'bg-indigo-500/10 border-indigo-500/50 shadow-lg shadow-indigo-500/5'
            : 'bg-neutral-900/40 border-white/5 hover:border-white/15 opacity-75 hover:opacity-100'
        } ${isSyncing ? 'cursor-not-allowed opacity-60' : ''}`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              method === 'cloud_direct'
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'bg-neutral-800 text-neutral-400'
            }`}
          >
            <CloudLightning className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-white">Direct Cloud-to-Cloud</h4>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                Official API
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Apple & Google server-side transfer. Zero MacBook disk or battery usage. Runs automatically in Apple’s data centers.
            </p>
          </div>
        </div>
      </button>
    </div>
  );
};
