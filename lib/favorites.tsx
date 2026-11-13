"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type FavoritesState = {
  driverId: string;
  teamId: string;
  raceId: string;
  circuitId: string;
};

const DEFAULT_FAVORITES: FavoritesState = {
  driverId: "antonelli",
  teamId: "mercedes",
  raceId: "vegas",
  circuitId: "monaco",
};

type FavoritesContextValue = {
  favorites: FavoritesState;
  setFavoriteDriver: (id: string) => void;
  setFavoriteTeam: (id: string) => void;
  setFavoriteRace: (id: string) => void;
  setFavoriteCircuit: (id: string) => void;
  totalSelectedCount: number;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoritesState>(DEFAULT_FAVORITES);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("f1-fanverse-favorites-2026");
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<FavoritesState>;
        setFavorites((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // Ignore storage read issues
    }
  }, []);

  const persist = useCallback((next: FavoritesState) => {
    try {
      window.localStorage.setItem(
        "f1-fanverse-favorites-2026",
        JSON.stringify(next)
      );
    } catch {
      // Ignore storage write issues
    }
  }, []);

  const setFavoriteDriver = useCallback(
    (driverId: string) => {
      setFavorites((prev) => {
        const next = { ...prev, driverId };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const setFavoriteTeam = useCallback(
    (teamId: string) => {
      setFavorites((prev) => {
        const next = { ...prev, teamId };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const setFavoriteRace = useCallback(
    (raceId: string) => {
      setFavorites((prev) => {
        const next = { ...prev, raceId };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const setFavoriteCircuit = useCallback(
    (circuitId: string) => {
      setFavorites((prev) => {
        const next = { ...prev, circuitId };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        setFavoriteDriver,
        setFavoriteTeam,
        setFavoriteRace,
        setFavoriteCircuit,
        totalSelectedCount: 4,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used inside FavoritesProvider");
  }
  return ctx;
}

