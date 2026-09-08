/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MacWindowHeader,
} from './components/MacWindowHeader';
import {
  AccountOverviewCard,
} from './components/AccountOverviewCard';
import {
  TransferModeSelector,
} from './components/TransferModeSelector';
import {
  SyncProgressDashboard,
} from './components/SyncProgressDashboard';
import {
  BackgroundEfficiencyPanel,
} from './components/BackgroundEfficiencyPanel';
import {
  TransferHistoryList,
} from './components/TransferHistoryList';
import {
  AlbumFilterModal,
} from './components/AlbumFilterModal';
import {
  CloudDirectTransferModal,
} from './components/CloudDirectTransferModal';
import {
  RealAccountTransferGuide,
} from './components/RealAccountTransferGuide';
import {
  MenuBarCompanion,
} from './components/MenuBarCompanion';

import {
  GoogleAccountProfile,
  ICloudAccountProfile,
  SyncSettings,
  SyncStats,
  TransferItem,
  TransferMethod,
  ThrottleProfile,
} from './types';
import {
  initialGoogleProfile,
  initialICloudProfile,
  defaultSyncSettings,
  sampleLibraryItems,
} from './data/initialData';
import { useWakeLock } from './hooks/useWakeLock';
import { useBatteryStatus } from './hooks/useBatteryStatus';

export default function App() {
  // State: Profiles & Settings
  const [googleProfile, setGoogleProfile] = useState<GoogleAccountProfile>(() => {
    const saved = localStorage.getItem('gphotos_profile');
    return saved ? JSON.parse(saved) : initialGoogleProfile;
  });

  const [iCloudProfile, setICloudProfile] = useState<ICloudAccountProfile>(() => {
    const saved = localStorage.getItem('icloud_profile');
    return saved ? JSON.parse(saved) : initialICloudProfile;
  });

  const [settings, setSettings] = useState<SyncSettings>(() => {
    const saved = localStorage.getItem('sync_settings');
    return saved ? JSON.parse(saved) : defaultSyncSettings;
  });

  const [transferMethod, setTransferMethod] = useState<TransferMethod>('mac_engine');
  const [isMenuBarMode, setIsMenuBarMode] = useState(false);
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [showCloudDirectModal, setShowCloudDirectModal] = useState(false);
  const [showRealGuideModal, setShowRealGuideModal] = useState(false);

  // Items and processing queue
  const [items, setItems] = useState<TransferItem[]>(() => {
    const saved = localStorage.getItem('gphotos_transfer_items');
    return saved ? JSON.parse(saved) : sampleLibraryItems;
  });

  const [stats, setStats] = useState<SyncStats>(() => {
    const totalBytes = sampleLibraryItems.reduce((acc, i) => acc + i.size, 0);
    return {
      status: 'idle',
      totalItems: 8906, // representative full library count
      processedItems: 0,
      completedItems: 0,
      skippedDuplicates: 0,
      failedItems: 0,
      totalBytes: 42.8 * 1024 * 1024 * 1024,
      transferredBytes: 0,
      currentSpeedBytesPerSec: 0,
      remainingSeconds: 0,
    };
  });

  const [currentItemId, setCurrentItemId] = useState<string | undefined>();

  // Battery and WakeLock hooks
  const battery = useBatteryStatus();
  const isSyncing = stats.status === 'syncing';
  const { isLocked: wakeLockActive, supported: wakeLockSupported } = useWakeLock(
    isSyncing && settings.preventMacSleep
  );

  // Persistent storage sync
  useEffect(() => {
    localStorage.setItem('sync_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('gphotos_profile', JSON.stringify(googleProfile));
  }, [googleProfile]);

  useEffect(() => {
    localStorage.setItem('icloud_profile', JSON.stringify(iCloudProfile));
  }, [iCloudProfile]);

  // Battery monitoring: Auto-pause if unplugged and pauseOnBattery is enabled
  useEffect(() => {
    if (isSyncing && settings.pauseOnBattery && battery.supported && !battery.charging) {
      pauseSync();
    }
  }, [battery.charging, battery.supported, isSyncing, settings.pauseOnBattery]);

  // Throttle speeds in bytes/sec
  const getThrottleSpeed = useCallback((profile: ThrottleProfile) => {
    switch (profile) {
      case 'eco':
        return 4.2 * 1024 * 1024; // 4.2 MB/s
      case 'balanced':
        return 16.5 * 1024 * 1024; // 16.5 MB/s
      case 'turbo':
        return 42.0 * 1024 * 1024; // 42.0 MB/s
    }
  }, []);

  // Background Processing Loop
  const timerRef = useRef<number | null>(null);

  const startSync = () => {
    if (stats.status === 'completed') {
      resetSync();
      return;
    }
    setStats((prev) => ({
      ...prev,
      status: 'syncing',
      startedAt: prev.startedAt || Date.now(),
    }));
  };

  const pauseSync = () => {
    setStats((prev) => ({
      ...prev,
      status: 'paused',
      currentSpeedBytesPerSec: 0,
    }));
  };

  const resumeSync = () => {
    setStats((prev) => ({
      ...prev,
      status: 'syncing',
    }));
  };

  const resetSync = () => {
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        status: 'queued',
        progress: 0,
      }))
    );
    setStats((prev) => ({
      ...prev,
      status: 'idle',
      processedItems: 0,
      completedItems: 0,
      skippedDuplicates: 0,
      failedItems: 0,
      transferredBytes: 0,
      currentSpeedBytesPerSec: 0,
      remainingSeconds: 0,
    }));
    setCurrentItemId(undefined);
  };

  // Processing Step Function
  useEffect(() => {
    if (stats.status !== 'syncing') {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const intervalTime = settings.throttleProfile === 'eco' ? 300 : settings.throttleProfile === 'balanced' ? 180 : 90;
    const speed = getThrottleSpeed(settings.throttleProfile);

    timerRef.current = window.setInterval(() => {
      setItems((prevItems) => {
        // Find next queued item or currently syncing item
        const activeIndex = prevItems.findIndex((i) => i.status === 'syncing');
        let targetIndex = activeIndex;

        if (targetIndex === -1) {
          targetIndex = prevItems.findIndex((i) => i.status === 'queued');
          if (targetIndex === -1) {
            // All sample items finished! Mark sync complete
            setStats((s) => ({
              ...s,
              status: 'completed',
              currentSpeedBytesPerSec: 0,
              remainingSeconds: 0,
              transferredBytes: s.totalBytes,
              processedItems: s.totalItems,
              completedItems: s.totalItems - s.skippedDuplicates,
            }));
            setCurrentItemId(undefined);

            // Trigger notification
            if (Notification && Notification.permission === 'granted') {
              new Notification('Google Photos → iCloud Transfer Complete', {
                body: `Successfully transferred ${stats.totalItems.toLocaleString()} photos and videos into your Apple iCloud Photos library.`,
              });
            }
            return prevItems;
          }

          // Check for duplicate simulation
          const currentItem = prevItems[targetIndex];
          if (settings.deduplicateFiles && currentItem.hash === 'dup_test_hash_already_in_icloud') {
            const updated = [...prevItems];
            updated[targetIndex] = {
              ...currentItem,
              status: 'skipped',
              progress: 100,
            };
            setStats((s) => ({
              ...s,
              processedItems: s.processedItems + 1,
              skippedDuplicates: s.skippedDuplicates + 1,
            }));
            return updated;
          }

          // Start syncing this item
          const updated = [...prevItems];
          updated[targetIndex] = {
            ...currentItem,
            status: 'syncing',
            progress: 10,
          };
          setCurrentItemId(currentItem.id);
          return updated;
        }

        // Increment active item progress
        const activeItem = prevItems[targetIndex];
        const nextProgress = Math.min(100, activeItem.progress + (settings.throttleProfile === 'turbo' ? 25 : 15));

        const updated = [...prevItems];
        if (nextProgress >= 100) {
          updated[targetIndex] = {
            ...activeItem,
            status: 'completed',
            progress: 100,
          };

          // Update library overall stats
          setStats((s) => {
            const nextTransferred = Math.min(s.totalBytes, s.transferredBytes + activeItem.size * 80);
            const remainingBytes = Math.max(0, s.totalBytes - nextTransferred);
            const remainingSecs = Math.round(remainingBytes / speed);
            const nextProcessed = Math.min(s.totalItems, s.processedItems + 740);

            return {
              ...s,
              transferredBytes: nextTransferred,
              processedItems: nextProcessed,
              completedItems: nextProcessed - s.skippedDuplicates,
              currentSpeedBytesPerSec: speed * (0.85 + Math.random() * 0.3),
              remainingSeconds: remainingSecs,
            };
          });
        } else {
          updated[targetIndex] = {
            ...activeItem,
            progress: nextProgress,
          };
        }

        return updated;
      });
    }, intervalTime);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [stats.status, settings.throttleProfile, settings.deduplicateFiles, getThrottleSpeed, stats.totalItems]);

  // Handle local user files dropped or uploaded
  const handleAddFiles = (files: FileList) => {
    const newItems: TransferItem[] = Array.from(files).map((file, idx) => {
      const isVideo = file.type.startsWith('video') || file.name.endsWith('.mov') || file.name.endsWith('.mp4');
      const isLive = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().includes('live');
      return {
        id: `user_item_${Date.now()}_${idx}`,
        name: file.name,
        size: file.size,
        type: isLive ? 'live_photo' : isVideo ? 'video' : 'photo',
        date: new Date(file.lastModified).toISOString(),
        album: 'MacBook Staging',
        status: 'queued',
        progress: 0,
        previewUrl: file.type.startsWith('image') ? URL.createObjectURL(file) : undefined,
        isLivePhoto: isLive,
      };
    });

    setItems((prev) => [...newItems, ...prev]);
    setStats((prev) => ({
      ...prev,
      totalItems: prev.totalItems + newItems.length,
      totalBytes: prev.totalBytes + newItems.reduce((a, b) => a + b.size, 0),
    }));
  };

  // Album selection togglers
  const handleToggleAlbum = (albumId: string) => {
    setGoogleProfile((prev) => ({
      ...prev,
      albums: prev.albums.map((a) =>
        a.id === albumId ? { ...a, selected: !a.selected } : a
      ),
    }));
  };

  const handleSelectAllAlbums = (select: boolean) => {
    setGoogleProfile((prev) => ({
      ...prev,
      albums: prev.albums.map((a) => ({ ...a, selected: select })),
    }));
  };

  const handleUpdateSettings = (newSettings: Partial<SyncSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleChangeThrottle = (profile: ThrottleProfile) => {
    setSettings((prev) => ({ ...prev, throttleProfile: profile }));
  };

  const activeItem = items.find((i) => i.id === currentItemId);
  const selectedAlbums = googleProfile.albums.filter((a) => a.selected);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col antialiased selection:bg-sky-500/30 font-sans">
      {/* MacBook Window Framing */}
      <div className="w-full flex-1 flex flex-col">
        {/* macOS Style Titlebar & Status Items */}
        <MacWindowHeader
          wakeLockActive={wakeLockActive}
          batteryLevel={battery.level}
          isCharging={battery.charging}
          throttleProfile={settings.throttleProfile}
          currentSpeed={stats.currentSpeedBytesPerSec}
          isSyncing={isSyncing}
          isMenuBarMode={isMenuBarMode}
          onToggleMenuBarMode={() => setIsMenuBarMode(!isMenuBarMode)}
          onReset={resetSync}
          onOpenRealAccountGuide={() => setShowRealGuideModal(true)}
        />

        {/* Content Container */}
        <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col gap-5">
          {isMenuBarMode ? (
            /* Compact macOS Menu Bar Popover View */
            <MenuBarCompanion
              stats={stats}
              currentItem={activeItem}
              throttleProfile={settings.throttleProfile}
              wakeLockActive={wakeLockActive}
              onStartSync={startSync}
              onPauseSync={pauseSync}
              onResumeSync={resumeSync}
              onChangeThrottle={handleChangeThrottle}
              onExpandWindow={() => setIsMenuBarMode(false)}
            />
          ) : (
            /* Full MacBook Desktop Application Layout */
            <>
              {/* Top Source & Destination Connection Overview */}
              <AccountOverviewCard
                googleProfile={googleProfile}
                iCloudProfile={iCloudProfile}
                selectedAlbumsCount={selectedAlbums.length}
                totalAlbumsCount={googleProfile.albums.length}
                onOpenAlbumFilter={() => setShowAlbumModal(true)}
                onOpenRealAccountGuide={() => setShowRealGuideModal(true)}
              />

              {/* Transfer Architecture Selector */}
              <TransferModeSelector
                method={transferMethod}
                onChangeMethod={(method) => {
                  setTransferMethod(method);
                  if (method === 'cloud_direct') {
                    setShowCloudDirectModal(true);
                  }
                }}
                isSyncing={isSyncing}
              />

              {/* Central Background Sync Progress Telemetry */}
              <SyncProgressDashboard
                stats={stats}
                currentItem={activeItem}
                throttleProfile={settings.throttleProfile}
                wakeLockActive={wakeLockActive}
                onStartSync={startSync}
                onPauseSync={pauseSync}
                onResumeSync={resumeSync}
                onResetSync={resetSync}
                onChangeThrottle={handleChangeThrottle}
              />

              {/* MacBook Background Efficiency Controls & Native Daemon */}
              <BackgroundEfficiencyPanel
                settings={settings}
                wakeLockSupported={wakeLockSupported}
                wakeLockActive={wakeLockActive}
                batteryLevel={battery.level}
                isCharging={battery.charging}
                onUpdateSettings={handleUpdateSettings}
              />

              {/* Live Item Queue & Transfer History */}
              <TransferHistoryList
                items={items}
                onAddFiles={handleAddFiles}
              />
            </>
          )}
        </div>
      </div>

      {/* Album Filter Modal */}
      {showAlbumModal && (
        <AlbumFilterModal
          albums={googleProfile.albums}
          onToggleAlbum={handleToggleAlbum}
          onSelectAll={handleSelectAllAlbums}
          onClose={() => setShowAlbumModal(false)}
        />
      )}

      {/* Cloud Direct Transfer Modal */}
      {showCloudDirectModal && (
        <CloudDirectTransferModal
          googleEmail={googleProfile.email}
          appleId={iCloudProfile.appleId}
          librarySizeBytes={googleProfile.totalSizeBytes}
          onClose={() => setShowCloudDirectModal(false)}
        />
      )}

      {/* Real Account Transfer Guide & Mac Instructions Modal */}
      {showRealGuideModal && (
        <RealAccountTransferGuide
          googleProfile={googleProfile}
          iCloudProfile={iCloudProfile}
          onUpdateGoogleProfile={(updated) =>
            setGoogleProfile((prev) => ({ ...prev, ...updated }))
          }
          onUpdateICloudProfile={(updated) =>
            setICloudProfile((prev) => ({ ...prev, ...updated }))
          }
          onClose={() => setShowRealGuideModal(false)}
        />
      )}
    </div>
  );
}
