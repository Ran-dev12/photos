export type ItemType = 'photo' | 'video' | 'live_photo';

export type ItemStatus = 'queued' | 'syncing' | 'completed' | 'skipped' | 'failed';

export interface TransferItem {
  id: string;
  name: string;
  size: number; // in bytes
  type: ItemType;
  date: string;
  album: string;
  status: ItemStatus;
  progress: number; // 0 - 100
  dimensions?: string;
  location?: string;
  previewUrl?: string;
  error?: string;
  hash?: string;
  isLivePhoto?: boolean;
}

export interface AlbumSelection {
  id: string;
  name: string;
  itemCount: number;
  sizeBytes: number;
  selected: boolean;
  coverUrl?: string;
}

export interface GoogleAccountProfile {
  email: string;
  name: string;
  avatarUrl: string;
  totalPhotos: number;
  totalVideos: number;
  totalSizeBytes: number;
  oldestDate: string;
  newestDate: string;
  albums: AlbumSelection[];
}

export interface ICloudAccountProfile {
  appleId: string;
  tier: '50 GB' | '200 GB' | '2 TB' | '6 TB';
  totalSizeBytes: number;
  usedSizeBytes: number;
  freeSizeBytes: number;
  photosAppLinked: boolean;
  optimizeStorage: boolean;
}

export type ThrottleProfile = 'eco' | 'balanced' | 'turbo';

export interface SyncSettings {
  preventMacSleep: boolean;
  pauseOnBattery: boolean;
  throttleProfile: ThrottleProfile;
  notificationsEnabled: boolean;
  preserveLivePhotos: boolean;
  preserveExifMetadata: boolean;
  deduplicateFiles: boolean;
  autoImportToMacPhotos: boolean;
}

export interface SyncStats {
  status: 'idle' | 'scanning' | 'ready' | 'syncing' | 'paused' | 'completed';
  totalItems: number;
  processedItems: number;
  completedItems: number;
  skippedDuplicates: number;
  failedItems: number;
  totalBytes: number;
  transferredBytes: number;
  currentSpeedBytesPerSec: number;
  remainingSeconds: number;
  startedAt?: number;
  lastActiveAt?: number;
}

export type TransferMethod = 'mac_engine' | 'cloud_direct';
