import React from 'react';
import {
  Image,
  Video,
  HardDrive,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  FolderLock,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { GoogleAccountProfile, ICloudAccountProfile } from '../types';
import { formatBytes } from '../utils/formatters';

interface AccountOverviewCardProps {
  googleProfile: GoogleAccountProfile;
  iCloudProfile: ICloudAccountProfile;
  selectedAlbumsCount: number;
  totalAlbumsCount: number;
  onOpenAlbumFilter: () => void;
  onOpenRealAccountGuide: () => void;
}

export const AccountOverviewCard: React.FC<AccountOverviewCardProps> = ({
  googleProfile,
  iCloudProfile,
  selectedAlbumsCount,
  totalAlbumsCount,
  onOpenAlbumFilter,
  onOpenRealAccountGuide,
}) => {
  const selectedSize = googleProfile.albums
    .filter((a) => a.selected)
    .reduce((acc, curr) => acc + curr.sizeBytes, 0);

  const hasEnoughICloudSpace = iCloudProfile.freeSizeBytes >= selectedSize;
  const icloudUsagePercent = Math.round(
    (iCloudProfile.usedSizeBytes / iCloudProfile.totalSizeBytes) * 100
  );
  const postTransferPercent = Math.min(
    100,
    Math.round(
      ((iCloudProfile.usedSizeBytes + selectedSize) / iCloudProfile.totalSizeBytes) * 100
    )
  );

  return (
    <div
      id="account-overview-card"
      className="bg-neutral-900/70 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl"
    >
      {/* Real Account Connection Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3.5 mb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-neutral-200">
            Real Accounts: <span className="text-amber-400 font-semibold">{googleProfile.email}</span> → <span className="text-sky-300 font-semibold">{iCloudProfile.appleId}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="btn-open-real-guide"
            onClick={onOpenRealAccountGuide}
            className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Real Accounts & Mac Transfer Guide</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Source: Google Photos */}
        <div
          id="google-photos-source-panel"
          className="md:col-span-5 bg-neutral-800/60 border border-white/5 rounded-xl p-4 transition-all hover:border-amber-500/30"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 via-rose-500/20 to-blue-500/20 border border-amber-500/30 flex items-center justify-center">
                <Image className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                  Google Photos
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-medium">
                    Source
                  </span>
                </h3>
                <p className="text-xs text-neutral-400 truncate max-w-[200px]">
                  {googleProfile.email}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-neutral-400 bg-neutral-900/60 px-2 py-1 rounded-md border border-white/5">
              {formatBytes(selectedSize)}
            </span>
          </div>

          {/* Stats Breakdown */}
          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-white/5">
            <div className="p-1.5 bg-black/20 rounded-lg">
              <span className="text-[11px] text-neutral-400 block">Photos</span>
              <span className="text-xs font-semibold text-neutral-200">
                {googleProfile.totalPhotos.toLocaleString()}
              </span>
            </div>
            <div className="p-1.5 bg-black/20 rounded-lg">
              <span className="text-[11px] text-neutral-400 block">Videos</span>
              <span className="text-xs font-semibold text-neutral-200">
                {googleProfile.totalVideos.toLocaleString()}
              </span>
            </div>
            <div className="p-1.5 bg-black/20 rounded-lg">
              <span className="text-[11px] text-neutral-400 block">Albums</span>
              <span className="text-xs font-semibold text-neutral-200">
                {selectedAlbumsCount}/{totalAlbumsCount}
              </span>
            </div>
          </div>

          {/* Album Selection Button */}
          <div className="mt-3 flex items-center justify-between pt-1">
            <span className="text-[11px] text-neutral-400">
              {selectedAlbumsCount === totalAlbumsCount
                ? 'All albums included'
                : `${selectedAlbumsCount} albums selected`}
            </span>
            <button
              id="btn-manage-albums"
              onClick={onOpenAlbumFilter}
              className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Filter className="w-3 h-3" />
              <span>Customize Albums</span>
            </button>
          </div>
        </div>

        {/* Transfer Pathway Connector */}
        <div
          id="transfer-arrow-connector"
          className="md:col-span-2 flex flex-col items-center justify-center py-2 md:py-0"
        >
          <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-neutral-800 border border-white/10 text-neutral-400 shadow-md">
            <ArrowRight className="w-4 h-4 text-sky-400 animate-pulse" />
          </div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-500 mt-1.5 text-center">
            Zero Quality Loss
          </span>
          <span className="text-[9px] text-neutral-400 flex items-center gap-1 mt-0.5">
            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
            Live Photos & EXIF
          </span>
        </div>

        {/* Destination: Apple iCloud Photos */}
        <div
          id="icloud-photos-destination-panel"
          className="md:col-span-5 bg-neutral-800/60 border border-white/5 rounded-xl p-4 transition-all hover:border-sky-500/30"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500/20 via-blue-500/20 to-indigo-500/20 border border-sky-500/30 flex items-center justify-center">
                <Cloud className="w-4 h-4 text-sky-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                  Apple iCloud Photos
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-sky-500/20 text-sky-300 font-medium">
                    Destination
                  </span>
                </h3>
                <p className="text-xs text-neutral-400 truncate max-w-[200px]">
                  {iCloudProfile.appleId}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-neutral-300 bg-sky-950/40 px-2 py-1 rounded-md border border-sky-500/20">
              {iCloudProfile.tier}
            </span>
          </div>

          {/* Storage Meter */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-neutral-400 text-[11px]">iCloud Storage:</span>
              <span className="text-neutral-300 font-mono text-[11px]">
                {formatBytes(iCloudProfile.usedSizeBytes)} used of {formatBytes(iCloudProfile.totalSizeBytes)}
              </span>
            </div>

            {/* Visual Storage Bar */}
            <div className="w-full h-2 bg-neutral-700/60 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${icloudUsagePercent}%` }}
                className="bg-neutral-400 h-full transition-all duration-300"
                title="Current iCloud Usage"
              />
              <div
                style={{ width: `${Math.max(0, postTransferPercent - icloudUsagePercent)}%` }}
                className="bg-sky-500 h-full transition-all duration-300 animate-pulse"
                title="Incoming Google Photos"
              />
            </div>

            <div className="flex items-center justify-between mt-2 pt-1 text-[11px]">
              <span className="text-neutral-400 flex items-center gap-1">
                {hasEnoughICloudSpace ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">
                      {formatBytes(iCloudProfile.freeSizeBytes - selectedSize)} free after sync
                    </span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    <span className="text-rose-400 font-medium">Insufficient iCloud space</span>
                  </>
                )}
              </span>
              <span className="text-neutral-400 font-mono text-[10px]">
                iCloud Photos Ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
