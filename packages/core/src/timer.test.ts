import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { Player } from './player';
import { Timer } from './timer';
import { Direction } from './types';

const makePlayer = (id: string) => new Player(id, Direction.NORTH);

describe('Timer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('initPlayer sets initial remaining time and getRemainingTime returns -1 for unknown', () => {
    const timer = new Timer({ seconds: 5 });
    const player = makePlayer('a');
    expect(timer.getRemainingTime(player)).toBe(-1);
    timer.initPlayer(player);
    expect(timer.getRemainingTime(player)).toBe(5000);
  });

  it('startWatch schedules expiration callback and zeroes remaining on expiry', () => {
    const t = new Timer({ seconds: 1 });
    const player = makePlayer('a');
    t.initPlayer(player);

    const cb = vi.fn();
    t.subscribe(cb);

    t.startWatch(player);
    // advance almost to expiry
    vi.advanceTimersByTime(900);
    expect(cb).not.toHaveBeenCalled();
    // advance to expiry
    vi.advanceTimersByTime(100);
    // callback should be called with player
    expect(cb).toHaveBeenCalledWith(player);
    // remaining should be 0
    expect(t.getRemainingTime(player)).toBe(0);
  });

  it('immediate callback if remaining time is less than 10ms', () => {
    const t = new Timer({ seconds: 0 });
    const player = makePlayer('a');
    t.initPlayer(player);
    const cb = vi.fn();
    t.subscribe(cb);
    // manually set remaining less than 10ms by starting and advancing
    t.startWatch(player);
    vi.advanceTimersByTime(1); // with 0 seconds, it should have fired already or be immediate
    // Start again should trigger immediate callback branch as remaining is at 0
    t.startWatch(player);
    expect(cb).toHaveBeenCalled();
  });

  it('switching players stores elapsed and applies increment on previous player', () => {
    const t = new Timer({ seconds: 10, increment: 2 });
    const player1 = makePlayer('a');
    const player2 = makePlayer('b');
    t.initPlayer(player1);
    t.initPlayer(player2);

    t.startWatch(player1);
    vi.advanceTimersByTime(3000);

    t.startWatch(player2);
    expect(Math.round(t.getRemainingTime(player1))).toBe(9000);

    vi.advanceTimersByTime(1000);
    t.startWatch(player1);
    expect(Math.round(t.getRemainingTime(player2))).toBe(11000);
  });

  it('stopWatch stops the current watch and records elapsed time', () => {
    const t = new Timer({ seconds: 2 });
    const player = makePlayer('a');
    t.initPlayer(player);

    t.startWatch(player);
    vi.advanceTimersByTime(500);
    t.stopWatch();

    const remainingAfterStop = t.getRemainingTime(player);
    expect(remainingAfterStop).toBeGreaterThan(1400);
    expect(remainingAfterStop).toBeLessThanOrEqual(1500);

    vi.advanceTimersByTime(5000);
    expect(t.getRemainingTime(player)).toBeCloseTo(remainingAfterStop, 0);
  });
});
