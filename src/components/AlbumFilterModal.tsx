import React, { useState } from 'react';
import { X, Check, Search, Image, FolderCheck } from 'lucide-react';
import { AlbumSelection } from '../types';
import { formatBytes } from '../utils/formatters';

interface AlbumFilterModalProps {
  albums: AlbumSelection[];
  onToggleAlbum: (albumId: string) => void;
  onSelectAll: (select: boolean) => void;
  onClose: () => void;
}

export const AlbumFilterModal: React.FC<AlbumFilterModalProps> = ({
  albums,
  onToggleAlbum,
  onSelectAll,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAlbums = albums.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCount = albums.filter((a) => a.selected).length;
  const selectedSize = albums
    .filter((a) => a.selected)
    .reduce((acc, curr) => acc + curr.sizeBytes, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        id="album-filter-modal"
        className="bg-neutral-900 border border-white/10 rounded-2xl max-w-xl w-full p-5 shadow-2xl flex flex-col max-h-[85vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h3 className="text-base font-semibold text-white">Select Albums to Transfer</h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Choose which Google Photos albums to sync to your Apple iCloud Photos library
            </p>
          </div>
          <button
            id="btn-close-album-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search and Bulk Controls */}
        <div className="py-3 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search albums..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-800/80 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
            <button
              id="btn-album-select-all"
              onClick={() => onSelectAll(true)}
              className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
            >
              Select All
            </button>
            <button
              id="btn-album-deselect-all"
              onClick={() => onSelectAll(false)}
              className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 transition-colors cursor-pointer"
            >
              Deselect All
            </button>
          </div>
        </div>

        {/* Albums List */}
        <div className="overflow-y-auto space-y-2 pr-1 flex-1 my-2">
          {filteredAlbums.map((album) => (
            <div
              key={album.id}
              onClick={() => onToggleAlbum(album.id)}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                album.selected
                  ? 'bg-sky-500/10 border-sky-500/40 text-white'
                  : 'bg-neutral-800/40 border-white/5 text-neutral-400 hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                {album.coverUrl ? (
                  <img
                    src={album.coverUrl}
                    alt={album.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-lg object-cover border border-white/10"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-500">
                    <Image className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-semibold text-neutral-200">{album.name}</h4>
                  <p className="text-[11px] text-neutral-400">
                    {album.itemCount.toLocaleString()} items • {formatBytes(album.sizeBytes)}
                  </p>
                </div>
              </div>

              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                  album.selected
                    ? 'bg-sky-500 border-sky-500 text-white'
                    : 'border-neutral-600 bg-transparent'
                }`}
              >
                {album.selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
          ))}

          {filteredAlbums.length === 0 && (
            <p className="text-xs text-neutral-500 text-center py-6">No matching albums found.</p>
          )}
        </div>

        {/* Footer with totals */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
          <span className="text-neutral-400">
            Selected: <span className="text-white font-medium">{selectedCount}</span> of {albums.length} albums ({formatBytes(selectedSize)})
          </span>
          <button
            id="btn-confirm-albums"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-medium transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
