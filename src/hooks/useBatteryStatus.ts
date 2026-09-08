import { useEffect, useState } from 'react';

interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  onchargingchange: ((this: BatteryManager, ev: Event) => any) | null;
  onlevelchange: ((this: BatteryManager, ev: Event) => any) | null;
}

interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

export interface BatteryState {
  level: number; // 0 - 100
  charging: boolean;
  supported: boolean;
}

export function useBatteryStatus() {
  const [battery, setBattery] = useState<BatteryState>({
    level: 86,
    charging: true,
    supported: false,
  });

  useEffect(() => {
    const nav = navigator as NavigatorWithBattery;
    if (typeof nav.getBattery === 'function') {
      let batteryManager: BatteryManager | null = null;

      nav.getBattery().then((bm) => {
        batteryManager = bm;
        const update = () => {
          setBattery({
            level: Math.round(bm.level * 100),
            charging: bm.charging,
            supported: true,
          });
        };
        update();
        bm.addEventListener('chargingchange', update);
        bm.addEventListener('levelchange', update);
      }).catch(() => {
        // Fallback default
        setBattery((prev) => ({ ...prev, supported: false }));
      });

      return () => {
        if (batteryManager) {
          batteryManager.removeEventListener('chargingchange', () => {});
          batteryManager.removeEventListener('levelchange', () => {});
        }
      };
    }
  }, []);

  return battery;
}
