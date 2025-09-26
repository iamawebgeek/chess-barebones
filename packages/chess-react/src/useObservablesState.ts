import { ObservableState } from '@chess-barebones/core';
import { useSyncExternalStore } from 'react';

export const useObservablesState = <T extends object>(
  observable: ObservableState<T>,
) => {
  return useSyncExternalStore(
    observable.subscribe.bind(observable),
    () => observable.state,
  );
};
