import React, { createContext, useContext } from "react";

type RouteHistory = {
  last(): string | undefined
}

type AppendHistory = (route: string) => void;

let HISTORY: string[] = [];

let h = {
  last() {
    return HISTORY[HISTORY.length - 1];
  }
}

export let append: AppendHistory = route => {
  if (HISTORY[HISTORY.length - 1] !== route) {
    HISTORY.push(route);
  }
};

let HistoryCtx = createContext<[RouteHistory, AppendHistory]>([h, append]);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  return <HistoryCtx.Provider value={[h, append]}>
    {children}
  </HistoryCtx.Provider>;
}

export function useHistory() {
  let [history] = useContext(HistoryCtx);
  return history;
}