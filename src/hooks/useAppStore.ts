import { useState, useEffect, useCallback } from 'react';
import { AppState, loadState, saveState } from '@/lib/store';

export function useAppStore() {
  const [state, setState] = useState<AppState>(loadState);

  // Debounced save to prevent excessive localStorage writes
  const debouncedSave = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (newState: AppState) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          saveState(newState);
        }, 300); // 300ms debounce
      };
    })(),
    []
  );

  const updateState = (updater: (prevState: AppState) => AppState) => {
    setState(prevState => {
      const newState = updater(prevState);
      debouncedSave(newState);
      return newState;
    });
  };

  return { state, updateState };
}