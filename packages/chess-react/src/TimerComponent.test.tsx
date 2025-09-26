import {
  ChessBoard8x8,
  ChessFigureFactory,
  RegularChess,
  StandardChessInitializer,
  TimerProcessor,
} from '@chess-barebones/chess';
import { combineHandlers, Direction, Timer } from '@chess-barebones/core';
import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { TimerComponent, TimerProps } from './TimerComponent';

const setup = () => {
  const board = new ChessBoard8x8(new ChessFigureFactory());
  const timer = new Timer({ seconds: 30 });
  const chess = new RegularChess(
    board,
    combineHandlers([
      new TimerProcessor(timer),
      new StandardChessInitializer(board),
    ]),
  );
  return { board, chess, timer };
};

const DummyComponent = ({ remainingMS, running, color }: TimerProps) => (
  <div>
    <span data-testid="ms">{remainingMS}</span>
    <span data-testid="running">{String(running)}</span>
    <span data-testid="color">{color}</span>
  </div>
);

describe('TimerComponent', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('passes false to running flag when the game has not yet started', () => {
    const { chess, timer } = setup();

    render(
      <TimerComponent
        chessInstance={chess}
        playerFlank={Direction.NORTH}
        timer={timer}
        Component={DummyComponent}
      />,
    );

    expect(screen.getByTestId('color').textContent).toBe('black');
    expect(screen.getByTestId('running').textContent).toBe('false');
    expect(Number(screen.getByTestId('ms').textContent)).toBe(30000);
  });

  it('triggers interval re-render updating remainingMS while running', async () => {
    const { chess, timer } = setup();
    chess.start();

    render(
      <TimerComponent
        chessInstance={chess}
        playerFlank={Direction.SOUTH}
        timer={timer}
        Component={DummyComponent}
      />,
    );

    expect(screen.getByTestId('running').textContent).toBe('true');
    const initial = Number(screen.getByTestId('ms').textContent);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    const after = Number(screen.getByTestId('ms').textContent);
    expect(after).toBeLessThan(initial);
  });

  it('updates component passing false after the white player makes a move and stops the timer', async () => {
    const { chess, timer } = setup();
    chess.start();

    render(
      <TimerComponent
        chessInstance={chess}
        playerFlank={Direction.SOUTH}
        timer={timer}
        Component={DummyComponent}
      />,
    );

    act(() => {
      chess.move('e4');
    });

    expect(screen.getByTestId('color').textContent).toBe('white');
    expect(screen.getByTestId('running').textContent).toBe('false');

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    expect(Number(screen.getByTestId('ms').textContent)).toBe(30000);
  });
});
