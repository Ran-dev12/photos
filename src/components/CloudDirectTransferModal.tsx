import React, { useState } from 'react';
import { CloudLightning, CheckCircle2, ArrowRight, ExternalLink, ShieldCheck, Clock, Info } from 'lucide-react';
import { formatBytes } from '../utils/formatters';

interface CloudDirectTransferModalProps {
  googleEmail: string;
  appleId: string;
  librarySizeBytes: number;
  onClose: () => void;
}

export const CloudDirectTransferModal: React.FC<CloudDirectTransferModalProps> = ({
  googleEmail,
  appleId,
  librarySizeBytes,
  onClose,
}) => {
  const [stage, setStage] = useState<'overview' | 'initiated'>('overview');

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        id="cloud-direct-modal"
        className="bg-neutral-900 border border-white/10 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <CloudLightning className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">
              Apple & Google Official Cloud Transfer
            </h3>
            <p className="text-xs text-neutral-400">
              Zero-disk, server-to-server direct data migration
            </p>
          </div>
        </div>

        {stage === 'overview' ? (
          <div>
            <p className="text-xs text-neutral-300 leading-relaxed mb-4">
              Apple and Google provide a direct cloud-to-cloud transfer initiative. Your {formatBytes(librarySizeBytes)} photo and video library will be transferred directly between Google Cloud and Apple iCloud servers.
            </p>

            {/* Steps Visual */}
            <div className="space-y-2.5 bg-neutral-800/60 p-4 rounded-xl border border-white/5 mb-4 text-xs text-neutral-300">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-neutral-700 text-neutral-300 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <span className="font-semibold text-white">Authenticate Google Account</span>
                  <p className="text-neutral-400 text-[11px] mt-0.5">
                    Authorize Google Takeout to export your Photos library ({googleEmail}).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-neutral-700 text-neutral-300 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <span className="font-semibold text-white">Authorize Destination Apple ID</span>
                  <p className="text-neutral-400 text-[11px] mt-0.5">
                    Sign in to iCloud ({appleId}) to grant permission for incoming photos.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-neutral-700 text-neutral-300 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <span className="font-semibold text-white">Server-Side Cloud Sync</span>
                  <p className="text-neutral-400 text-[11px] mt-0.5">
                    Apple & Google handle the transfer automatically in 1–3 business days. Your MacBook can be powered off.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-3 flex items-center gap-2.5 text-xs text-sky-200 mb-5">
              <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
              <span>
                Your original photos remain intact in Google Photos. They are safely copied without deleting originals.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                id="btn-cloud-cancel"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium cursor-pointer transition-colors"
              >
                Use MacBook Engine Instead
              </button>
              <button
                id="btn-cloud-initiate"
                onClick={() => setStage('initiated')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer transition-colors"
              >
                <span>Initiate Direct Transfer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-semibold text-white mb-1">
              Transfer Request Registered
            </h4>
            <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed mb-4">
              Your Google Photos library ({formatBytes(librarySizeBytes)}) has been queued for direct server transfer to Apple iCloud Photos ({appleId}).
            </p>

            <div className="bg-neutral-800/60 p-3 rounded-xl border border-white/5 text-xs text-neutral-400 max-w-sm mx-auto mb-5 text-left">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Google Request ID:</span>
                <span className="font-mono text-neutral-200">GPH-2026-9812A</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Apple Confirmation:</span>
                <span className="font-mono text-neutral-200">Pending Apple Accept</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Estimated Completion:</span>
                <span className="font-mono text-emerald-400">Within 24–48 hours</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                id="btn-cloud-done"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium cursor-pointer transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
