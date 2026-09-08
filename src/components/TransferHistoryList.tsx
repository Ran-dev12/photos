import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Search,
  Upload,
  Image,
  Video,
  Sparkles,
  MapPin,
  HardDrive,
  FolderOpen,
} from 'lucide-react';
import { TransferItem, ItemStatus } from '../types';
import { formatBytes, formatDate } from '../utils/formatters';

interface TransferHistoryListProps {
  items: TransferItem[];
  onAddFiles?: (files: FileList) => void;
}

export const TransferHistoryList: React.FC<TransferHistoryListProps> = ({
  items,
  onAddFiles,
}) => {
  const [filter, setFilter] = useState<'all' | 'syncing' | 'completed' | 'skipped' | 'queued'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const completedCount = items.filter((i) => i.status === 'completed').length;
  const skippedCount = items.filter((i) => i.status === 'skipped').length;
  const queuedCount = items.filter((i) => i.status === 'queued').length;
  const syncingCount = items.filter((i) => i.status === 'syncing').length;

  const filteredItems = items.filter((item) => {
    const matchesFilter = filter === 'all' ? true : item.status === filter;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.album.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && onAddFiles) {
      onAddFiles(e.target.files);
    }
  };

  return (
    <div
      id="transfer-history-list"
      className="bg-neutral-900/70 border border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-xl"
    >
      {/* Header & Local File Import */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-sm font-semibold text-white">Item Transfer Queue & History</h3>
          <p className="text-xs text-neutral-400">
            Real-time status of files transitioning from Google Photos into Apple iCloud Photos
          </p>
        </div>

        {/* Import user photos button */}
        <label
          id="btn-import-local-photos"
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-neutral-200 text-xs font-medium flex items-center gap-2 cursor-pointer transition-colors self-start sm:self-auto"
        >
          <Upload className="w-3.5 h-3.5 text-sky-400" />
          <span>Add Photos from MacBook</span>
          <input
            type="file"
            multiple
            accept="image/*,video/*,.heic,.mov"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 my-3.5">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            id="tab-filter-all"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-white/15 text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            All ({items.length})
          </button>
          <button
            id="tab-filter-syncing"
            onClick={() => setFilter('syncing')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              filter === 'syncing'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Active ({syncingCount})
          </button>
          <button
            id="tab-filter-completed"
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              filter === 'completed'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Synced ({completedCount})
          </button>
          <button
            id="tab-filter-skipped"
            onClick={() => setFilter('skipped')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              filter === 'skipped'
                ? 'bg-neutral-800 text-neutral-300 border border-white/10'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Duplicates Skipped ({skippedCount})
          </button>
          <button
            id="tab-filter-queued"
            onClick={() => setFilter('queued')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              filter === 'queued'
                ? 'bg-neutral-800 text-neutral-300 border border-white/10'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Queued ({queuedCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-60">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search items or albums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-800/80 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Items Scrollable List */}
      <div className="overflow-y-auto max-h-[380px] space-y-2 pr-1">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-2.5 rounded-xl bg-neutral-800/40 border border-white/5 hover:border-white/10 flex items-center justify-between gap-3 transition-colors"
          >
            {/* Thumbnail + info */}
            <div className="flex items-center gap-3 min-w-0">
              {item.previewUrl ? (
                <img
                  src={item.previewUrl}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-lg object-cover border border-white/10 shrink-0"
                />
              ) : (
                <div className="w-11 h-11 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0 text-neutral-400">
                  {item.type === 'video' ? <Video className="w-5 h-5" /> : <Image className="w-5 h-5" />}
                </div>
              )}

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold text-neutral-200 truncate max-w-[220px] sm:max-w-[320px]">
                    {item.name}
                  </h4>
                  {item.isLivePhoto && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-medium flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" />
                      Live
                    </span>
                  )}
                  {item.type === 'video' && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 font-medium">
                      Video
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] text-neutral-400 mt-0.5">
                  <span>{formatBytes(item.size)}</span>
                  <span>•</span>
                  <span>{formatDate(item.date)}</span>
                  <span>•</span>
                  <span className="truncate max-w-[140px]">{item.album}</span>
                  {item.location && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:flex items-center gap-0.5 text-neutral-400 truncate max-w-[160px]">
                        <MapPin className="w-2.5 h-2.5" />
                        {item.location}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2 shrink-0">
              {item.status === 'syncing' && (
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[11px] font-mono text-sky-400 block font-medium">
                      {item.progress}%
                    </span>
                    <span className="text-[10px] text-neutral-400">Uploading</span>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
                </div>
              )}

              {item.status === 'completed' && (
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="font-medium">In iCloud</span>
                </div>
              )}

              {item.status === 'skipped' && (
                <div className="flex items-center gap-1.5 text-neutral-300 text-xs px-2.5 py-1 rounded-lg bg-neutral-800 border border-white/10" title="Identical photo already present in iCloud Photos">
                  <FileCheck className="w-3.5 h-3.5 text-sky-400" />
                  <span>Deduplicated</span>
                </div>
              )}

              {item.status === 'queued' && (
                <div className="flex items-center gap-1.5 text-neutral-400 text-xs px-2.5 py-1 rounded-lg bg-neutral-800/60">
                  <Clock className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Queued</span>
                </div>
              )}

              {item.status === 'failed' && (
                <div className="flex items-center gap-1.5 text-rose-400 text-xs px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="text-center py-10 text-neutral-500 text-xs">
            No photos found for the selected filter.
          </div>
        )}
      </div>
    </div>
  );
};
