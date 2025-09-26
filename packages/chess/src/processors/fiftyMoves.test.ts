import {
  Board8x8,
  Direction,
  Game,
  MoveSerializer,
  Player,
  XLine,
  YLine,
} from '@chess-barebones/core';
import { describe, expect, it } from 'vitest';

import { Figure } from '../figures';
import { FiftyMovesProcessor } from './fiftyMoves';
import { Color } from '../chess';
import { ChessFigureFactory } from '../factory';

class MockSerializer extends MoveSerializer<Figure, any> {
  public deserialize(move: string) {
    const { from, to } = move as unknown as {
      from: { x: XLine; y: YLine };
      to: { x: XLine; y: YLine };
    };
    this.board.getFigure(from).move(to);
  }

  public serialize(move: object) {
    return move as unknown as string;
  }
}

const setup = () => {
  const board = new Board8x8<Figure>(new ChessFigureFactory());
  const player1 = new Player(Color.WHITE, Direction.SOUTH);
  const player2 = new Player(Color.BLACK, Direction.NORTH);
  const serializer = new MockSerializer(board);
  const chess = new Game(board, serializer, new FiftyMovesProcessor(board));
  chess.addPlayer(player1);
  chess.addPlayer(player2);
  return { board, player1, player2, chess, serializer };
};

describe('FiftyMovesProcessor', () => {
  it('ends game after 50 moves without capture or pawn move', () => {
    const { board, player1, player2, chess, serializer } = setup();

    // Create kings and rooks for testing
    board.createFigure(Figure.KING, player1, 'e1');
    board.createFigure(Figure.KING, player2, 'e8');
    const rook1 = board.createFigure(Figure.ROOK, player1, 'a1');
    const rook2 = board.createFigure(Figure.ROOK, player2, 'a8');

    chess.start();

    // Make 50 moves back and forth with rooks (no captures, no pawn moves)
    for (let i = 0; i < 25; i++) {
      // White rook moves
      chess.move(
        serializer.serialize({
          from: rook1.state.coordinate,
          to: { x: XLine.A, y: YLine._2 },
        }),
      );
      chess.move(
        serializer.serialize({
          from: rook1.state.coordinate,
          to: { x: XLine.A, y: YLine._1 },
        }),
      );

      // Black rook moves
      chess.move(
        serializer.serialize({
          from: rook2.state.coordinate,
          to: { x: XLine.A, y: YLine._7 },
        }),
      );
      chess.move(
        serializer.serialize({
          from: rook2.state.coordinate,
          to: { x: XLine.A, y: YLine._8 },
        }),
      );
    }

    expect(chess.state.ended).toBe(true);
    expect(player1.state.score).toBe(2); // DRAW
    expect(player2.state.score).toBe(2); // DRAW
  });

  it('resets counter after capture', () => {
    const { board, player1, player2, chess, serializer } = setup();

    board.createFigure(Figure.KING, player1, 'e1');
    board.createFigure(Figure.KING, player2, 'e8');
    const rook1 = board.createFigure(Figure.ROOK, player1, 'a1');
    board.createFigure(Figure.ROOK, player2, 'a8');

    chess.start();

    // Make some moves
    for (let i = 0; i < 10; i++) {
      chess.move(
        serializer.serialize({
          from: rook1.state.coordinate,
          to: { x: XLine.A, y: YLine._2 },
        }),
      );
      chess.move(
        serializer.serialize({
          from: rook1.state.coordinate,
          to: { x: XLine.A, y: YLine._1 },
        }),
      );
    }

    // Capture a piece (should reset counter)
    chess.move(
      serializer.serialize({
        from: rook1.state.coordinate,
        to: { x: XLine.A, y: YLine._8 },
      }),
    );

    expect(chess.state.ended).toBe(false);
  });

  it('resets counter after pawn move', () => {
    const { board, player1, player2, chess, serializer } = setup();

    const king1 = board.createFigure(Figure.KING, player1, 'e1');
    board.createFigure(Figure.KING, player2, 'e8');
    const pawn1 = board.createFigure(Figure.PAWN, player1, 'a2');
    board.createFigure(Figure.ROOK, player2, 'a8');

    chess.start();

    // Make some moves
    for (let i = 0; i < 10; i++) {
      chess.move(
        serializer.serialize({
          from: king1.state.coordinate,
          to: { x: XLine.E, y: YLine._2 },
        }),
      );
      chess.move(
        serializer.serialize({
          from: king1.state.coordinate,
          to: { x: XLine.E, y: YLine._1 },
        }),
      );
    }

    // Move a pawn (should reset counter)
    chess.move(
      serializer.serialize({
        from: pawn1.state.coordinate,
        to: { x: XLine.A, y: YLine._3 },
      }),
    );

    expect(chess.state.ended).toBe(false);
  });

  it('does not end game before 50 moves', () => {
    const { board, player1, player2, chess, serializer } = setup();

    board.createFigure(Figure.KING, player1, 'e1');
    board.createFigure(Figure.KING, player2, 'e8');
    const rook1 = board.createFigure(Figure.ROOK, player1, 'a1');
    board.createFigure(Figure.ROOK, player2, 'a8');

    chess.start();

    // Make only 25 moves (should not trigger 50-move rule)
    for (let i = 0; i < 12; i++) {
      chess.move(
        serializer.serialize({
          from: rook1.state.coordinate,
          to: { x: XLine.A, y: YLine._2 },
        }),
      );
      chess.move(
        serializer.serialize({
          from: rook1.state.coordinate,
          to: { x: XLine.A, y: YLine._1 },
        }),
      );
    }

    expect(chess.state.ended).toBe(false);
  });
});
