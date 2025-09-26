import { Player, Timer, Direction } from '@chess-barebones/core';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';

import { TimerProcessor } from './timer';
import { Color } from '../chess';

describe('TimerProcessor', () => {
  let timer: Timer;
  let processor: TimerProcessor;
  let player1: Player;
  let player2: Player;

  beforeEach(() => {
    timer = {
      subscribe: vi.fn(),
      startWatch: vi.fn(),
      stopWatch: vi.fn(),
      initPlayer: vi.fn(),
    } as unknown as Timer;
    processor = new TimerProcessor(timer);
    player1 = new Player(Color.WHITE, Direction.NORTH);
    player2 = new Player(Color.BLACK, Direction.SOUTH);
    processor.onPlayerAdded(player1);
    processor.onPlayerAdded(player2);
  });

  it('subscribes to the timer on creation', () => {
    expect(timer.subscribe).toHaveBeenCalledWith(expect.any(Function));
  });

  it('starts the timer for the first player onStart', () => {
    processor.onStart();
    expect(timer.startWatch).toHaveBeenCalledWith(player1);
  });

  it('stops the timer onEnd', () => {
    processor.onEnd();
    expect(timer.stopWatch).toHaveBeenCalled();
  });

  it('initializes players onPlayerAdded', () => {
    expect(timer.initPlayer).toHaveBeenCalledWith(player1);
    expect(timer.initPlayer).toHaveBeenCalledWith(player2);
  });

  it('starts the timer for the next player on check', () => {
    processor.check(player1, player2);
    expect(timer.startWatch).toHaveBeenCalledWith(player2);
  });

  it('scores the player as a looser when timer times out', () => {
    const timeoutCallback = (timer.subscribe as Mock<Timer['subscribe']>).mock
      .calls[0][0];
    timeoutCallback(player1);
    expect(player1.state.score).toBe(2);
  });
});
