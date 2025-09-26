---
sidebar_position: 5
---

# useObservablesState Hook

`useObservablesState<T extends object>(observable: ObservableState<T>): T`

A thin wrapper around React's `useSyncExternalStore` for subscribing to ObservableState instances from `@chess-barebones/core`.

## Parameters

- `observable: ObservableState<T>` — Any ObservableState instance (e.g., Game, AbstractBoard, Player, or a Figure).

## Returns

- The current state snapshot of the observable, and re-renders the component whenever the observable emits updates.

## Example

```tsx
import { useObservablesState } from '@chess-barebones/chess-react';

function Score({ player }: { player: Player }) {
  const state = useObservablesState(player);
  return <span>{state.score ?? '—'}</span>;
}
```
