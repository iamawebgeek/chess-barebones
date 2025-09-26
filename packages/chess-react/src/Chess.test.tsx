import {
  ChessBoard8x8,
  ChessFigureFactory,
  RegularChess,
  StandardChessInitializer,
} from '@chess-barebones/chess';
import { combineHandlers } from '@chess-barebones/core';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { FigureProps } from './BoardFigureComponent';
import { BoardProps, Chess, MoveHighlightProps } from './Chess';

const DummyBoard = ({ boardFigures, moves }: BoardProps) => (
  <div>
    <div data-testid="figures-count">{boardFigures.length}</div>
    <div data-testid="moves-count">{moves ? moves.length : 0}</div>
    <div data-testid="root">
      {boardFigures}
      {moves}
    </div>
  </div>
);

const DummyFigure = ({ location, onSelect }: FigureProps) => (
  <button data-testid={`figure-${location.x}-${location.y}`} onClick={onSelect}>
    F
  </button>
);

// eslint-disable-next-line @typescript-eslint/unbound-method
const DummyMove = ({ move, onSelect }: MoveHighlightProps) => (
  <button data-testid={`move-${move.x}-${move.y}`} onClick={onSelect}>
    M
  </button>
);

const DummyCapture = () => <span>C</span>;
const DummyPromotion = () => <div>P</div>;

describe('Chess component', () => {
  it('renders real figures, allows selecting e2 pawn and moving to e4 triggering serializer + chess.move', () => {
    const board = new ChessBoard8x8(new ChessFigureFactory());
    const chess = new RegularChess(
      board,
      combineHandlers([new StandardChessInitializer(board)]),
    );
    chess.start();

    const spySerialize = vi.spyOn(chess.serializer, 'serialize');
    const spyMove = vi.spyOn(chess, 'move');

    render(
      <Chess
        chessInstance={chess}
        boardInstance={board}
        components={{
          Board: DummyBoard,
          Figure: DummyFigure,
          Capture: DummyCapture,
          MoveHighlight: DummyMove,
          PawnPromotionMenu: DummyPromotion,
        }}
      />,
    );

    // 32 figures at start, no moves selected initially
    expect(screen.getByTestId('figures-count').textContent).toBe('32');
    expect(screen.getByTestId('moves-count').textContent).toBe('0');

    // Select the white pawn at e2 (x=5,y=2)
    fireEvent.click(screen.getByTestId('figure-5-2'));

    // Available moves should include e3 (5,3) and e4 (5,4)
    expect(screen.getByTestId('moves-count').textContent).toBe('2');

    // Click e4
    fireEvent.click(screen.getByTestId('move-5-4'));

    // Serializer and move should be called
    expect(spySerialize).toHaveBeenCalledTimes(1);
    expect(spyMove).toHaveBeenCalledTimes(1);

    // The pawn should now be at e4 (button exists for figure at 5,4)
    expect(screen.getByTestId('figure-5-4')).toBeTruthy();
  });
});
