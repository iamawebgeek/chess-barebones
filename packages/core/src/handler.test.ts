import { describe, it, expect, vi } from 'vitest';

import { combineHandlers, type Handler } from './handler';
import { Player } from './player';
import { Direction } from './types';

describe('combineHandlers', () => {
  const makePlayer = () => new Player('p', Direction.NORTH);

  it('calls onMove for all composed handlers and forwards args', () => {
    const a: Handler = { onMove: vi.fn() };
    const b: Handler = { onMove: vi.fn() };
    const c: Handler = {}; // missing onMove should be fine
    const combined = combineHandlers([a, b, c]);

    const p1 = makePlayer();
    const p2 = makePlayer();
    void combined.onMove?.('e4', p1, p2);

    expect(a.onMove).toHaveBeenCalledWith('e4', p1, p2);
    expect(b.onMove).toHaveBeenCalledWith('e4', p1, p2);
  });

  it('calls onStart/onEnd/onPlayerAdded for all handlers', () => {
    const onStartA = vi.fn();
    const onEndA = vi.fn();
    const onPlayerAddedA = vi.fn();
    const onStartB = vi.fn();
    const onEndB = vi.fn();
    const onPlayerAddedB = vi.fn();

    const a: Handler = {
      onStart: onStartA,
      onEnd: onEndA,
      onPlayerAdded: onPlayerAddedA,
    };
    const b: Handler = {
      onStart: onStartB,
      onEnd: onEndB,
      onPlayerAdded: onPlayerAddedB,
    };

    const combined = combineHandlers([a, b]);
    const p = makePlayer();

    void combined.onStart?.();
    void combined.onEnd?.();
    void combined.onPlayerAdded?.(p);

    expect(onStartA).toHaveBeenCalledTimes(1);
    expect(onStartB).toHaveBeenCalledTimes(1);
    expect(onEndA).toHaveBeenCalledTimes(1);
    expect(onEndB).toHaveBeenCalledTimes(1);
    expect(onPlayerAddedA).toHaveBeenCalledWith(p);
    expect(onPlayerAddedB).toHaveBeenCalledWith(p);
  });
});
