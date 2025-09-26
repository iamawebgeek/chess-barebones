import { RegularChess as RegularChessGame } from '@chess-barebones/chess';
import { Timer } from '@chess-barebones/core';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { BoardProps } from './Chess';
import { RegularChess } from './RegularChess';
import { TimerProps } from './TimerComponent';

describe('RegularChess component', () => {
  it('creates real instances, starts the game, forwards timer, and sets chessRef; Board receives initial figures and timers', () => {
    const handler = {
      onMove: vi.fn(),
      onStart: vi.fn(),
      onEnd: vi.fn(),
      onPlayerAdded: vi.fn(),
    };

    const timer = new Timer({ seconds: 60 });
    const ref = { current: null as null | RegularChessGame };

    const DummyTimer = ({ remainingMS }: TimerProps) => (
      <span data-testid="timer">{remainingMS}</span>
    );

    const DummyBoard: React.FC<any> = ({
      boardFigures,
      timerTop,
      timerBottom,
    }: BoardProps) => (
      <div>
        <div data-testid="figures-count">{boardFigures.length}</div>
        <div data-testid="top-timer">{timerTop ? 'yes' : 'no'}</div>
        <div data-testid="bottom-timer">{timerBottom ? 'yes' : 'no'}</div>
      </div>
    );

    render(
      <RegularChess
        handler={handler}
        timer={timer}
        chessRef={ref}
        components={{
          Board: DummyBoard,
          Figure: () => null,
          Capture: () => null,
          MoveHighlight: () => null,
          PawnPromotionMenu: () => null,
          Timer: DummyTimer,
        }}
      />,
    );

    // chessRef should be set to a real RegularChess instance and started
    expect(ref.current).toBeInstanceOf(RegularChessGame);
    expect(ref.current!.state.started).toBe(true);

    // Board should render initial 32 figures
    expect(screen.getByTestId('figures-count').textContent).toBe('32');

    // Timers are forwarded and rendered at both sides
    expect(screen.getByTestId('top-timer').textContent).toBe('yes');
    expect(screen.getByTestId('bottom-timer').textContent).toBe('yes');
  });
});
