'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface SearchContextValue {
  query: string;
  isOpen: boolean;
  setQuery: (q: string) => void;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  clearSearch: () => void;
}

/* ─── Context ────────────────────────────────────────────────────────────── */
const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQueryState] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const setQuery    = useCallback((q: string) => setQueryState(q), []);
  const openSearch  = useCallback(() => setIsOpen(true), []);
  const closeSearch = useCallback(() => setIsOpen(false), []);
  const toggleSearch = useCallback(() => setIsOpen((prev) => !prev), []);
  const clearSearch = useCallback(() => { setQueryState(''); setIsOpen(false); }, []);

  return (
    <SearchContext.Provider value={{ query, isOpen, setQuery, openSearch, closeSearch, toggleSearch, clearSearch }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used inside SearchProvider');
  return ctx;
}
