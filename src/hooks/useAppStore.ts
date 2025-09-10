import { useState, useEffect } from 'react';
import { AppState, loadState, saveState } from '@/lib/store';

export function useAppStore() {
  const [state, setState] = useState<AppState>(loadState);

  const updateState = (updater: (prevState: AppState) => AppState) => {
    setState(prevState => {
      const newState = updater(prevState);
      saveState(newState);
      return newState;
    });
  };

  return { state, updateState };
}