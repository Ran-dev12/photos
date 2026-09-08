import { useEffect, useRef, useState } from 'react';

export function useWakeLock(isActive: boolean) {
  const [isLocked, setIsLocked] = useState(false);
  const [supported, setSupported] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    setSupported('wakeLock' in navigator);
  }, []);

  useEffect(() => {
    if (!supported || !isActive) {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
        setIsLocked(false);
      }
      return;
    }

    let isMounted = true;

    const requestLock = async () => {
      try {
        if ('wakeLock' in navigator && !wakeLockRef.current) {
          const lock = await navigator.wakeLock.request('screen');
          if (isMounted) {
            wakeLockRef.current = lock;
            setIsLocked(true);

            lock.addEventListener('release', () => {
              if (isMounted) {
                setIsLocked(false);
                wakeLockRef.current = null;
              }
            });
          }
        }
      } catch (err) {
        // Can fail if battery is critically low or tab is in background without permission
        console.warn('Wake Lock request skipped or unavailable:', err);
      }
    };

    requestLock();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isActive && !wakeLockRef.current) {
        requestLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMounted = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
        setIsLocked(false);
      }
    };
  }, [isActive, supported]);

  return { isLocked, supported };
}
