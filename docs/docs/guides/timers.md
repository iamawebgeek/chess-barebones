---
sidebar_position: 4
---

# Timers

This guide explains how to use timers in Chess barebones.

## The `Timer` Class

The `Timer` class from `@chess-barebones/core` provides a simple chess-like clock with increments.

## The `TimerProcessor`

The `TimerProcessor` from `@chess-barebones/chess` integrates a `Timer` with the game, ending the game when a player's time runs out.

### Example

```typescript
import { Timer } from '@chess-barebones/core';
import { TimerProcessor } from '@chess-barebones/chess';

const timer = new Timer({ seconds: 300, increment: 2 });
const withTimer = combineHandlers([new StandardChessInitializer(board), new TimerProcessor(timer)]);
const timedGame = new RegularChess(board, withTimer);
```
