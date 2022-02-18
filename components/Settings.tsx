import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useMount } from "react-use";
import { DifficultyLevel } from "../data/difficulty";

export interface Storage<T> {
  get(key: string): T | null
  set(key: string, value: T): T | null
  delete(key: string): T | null
}

export type Settings = {
  players?: number
  difficulty?: number
  [key: string]: any
}

type UpdateSetting = (key: string, value: any) => void

const DEFAULT_SETTINGS = {
  players: 2,
  difficulty: DifficultyLevel.TWENTY
};

let settingsCtx = createContext<[Settings, UpdateSetting]>([DEFAULT_SETTINGS, (key: string, value: any) => { }]);

export function SettingsProvider({ storage, children }: { storage: Storage<Settings>, children: React.ReactNode }) {
  let [innerState, setInnerState] = useState<Settings>({});

  useEffect(() => {
    let storedSettings = storage.get('settings');

    if (storedSettings) {
      setInnerState(storedSettings);
    }
  }, []);

  let update = useCallback((key: string, value: any) => {
    setInnerState({ ...innerState, [key]: value });
  }, [innerState, setInnerState]);

  useEffect(() => {
    storage.set('settings', innerState);
  }, [innerState]);

  return <settingsCtx.Provider value={[innerState, update]}>
    {children}
  </settingsCtx.Provider>;
}

export default function useSettings() {
  return useContext(settingsCtx);
}

export function useSetting(key: string) {
  let [settings, updateSetting] = useSettings();
  let update = useCallback((value: any) => {
    updateSetting(key, value);
  }, [key, updateSetting]);
  return [settings[key], update];
}