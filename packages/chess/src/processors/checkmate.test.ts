import {
  Board8x8,
  Coordinate,
  Direction,
  Game,
  MoveSerializer,
  Player,
  XLine,
  YLine,
} from '@chess-barebones/core';
import { describe, expect, it } from 'vitest';

import { Figure } from '../figures';
import { CheckmateProcessor } from './checkmate';
import { Color } from '../chess';
import { ChessFigureFactory } from '../factory';

class MockSerializer extends MoveSerializer<Figure, any> {
  public deserialize(move: string) {
    const { from, to } = move as unknown as {
      from: Coordinate;
      to: Coordinate;
    };
    this.board.getFigure(from).move(to);
  }

  public serialize(move: object) {
    return move as unknown as string;
  }
}

const setup = (
  king1Coordinate: Coordinate | string,
  king2Coordinate: Coordinate | string,
) => {
  const board = new Board8x8<Figure>(new ChessFigureFactory());
  const player1 = new Player(Color.WHITE, Direction.NORTH);
  const player2 = new Player(Color.BLACK, Direction.SOUTH);
  board.createFigure(Figure.KING, player2, king1Coordinate);
  board.createFigure(Figure.KING, player1, king2Coordinate);
  const serializer = new MockSerializer(board);
  const chess = new Game(board, serializer, new CheckmateProcessor(board));
  chess.addPlayer(player1);
  chess.addPlayer(player2);
  chess.start();
  return { player1, player2, board, chess, serializer };
};

describe('CheckmateProcessor', () => {
  it('detects checkmate when the king has no valid moves', () => {
    const { board, player1, player2, chess, serializer } = setup('a8', 'c8');
    const queen = board.createFigure(Figure.QUEEN, player1, 'b3');
    chess.move(
      serializer.serialize({
        from: queen.state.coordinate,
        to: {
          x: XLine.B,
          y: YLine._7,
        },
      }),
    );

    expect(chess.state.ended).toBe(true);
    expect(player1.state.score).toBe(1);
    expect(player2.state.score).toBe(2);
  });

  it('detects checkmate when no figures have valid moves', () => {
    const { player1, player2, board, chess, serializer } = setup('a8', 'c8');
    const queen = board.createFigure(Figure.QUEEN, player1, 'b3');
    board.createFigure(Figure.ROOK, player1, 'h2');

    chess.move(
      serializer.serialize({
        from: queen.state.coordinate,
        to: {
          x: XLine.B,
          y: YLine._7,
        },
      }),
    );

    expect(chess.state.ended).toBe(true);
    expect(player1.state.score).toBe(1);
    expect(player2.state.score).toBe(2);
  });

  it('does not end the game when the king has moves after a check', () => {
    const { player1, player2, board, chess, serializer } = setup('a8', 'c5');
    const queen = board.createFigure(Figure.QUEEN, player1, 'b3');

    chess.move(
      serializer.serialize({
        from: queen.state.coordinate,
        to: {
          x: XLine.B,
          y: YLine._7,
        },
      }),
    );

    expect(chess.state.ended).toBe(false);
    expect(player1.state.score).toBe(null);
    expect(player2.state.score).toBe(null);
  });

  it('does not end the game when the checker can be captured', () => {
    const { player1, player2, board, chess, serializer } = setup('a8', 'c8');
    const queen = board.createFigure(Figure.QUEEN, player1, 'b3');
    const rook = board.createFigure(Figure.ROOK, player2, 'h7');

    chess.move(
      serializer.serialize({
        from: queen.state.coordinate,
        to: {
          x: XLine.B,
          y: YLine._7,
        },
      }),
    );

    expect(chess.state.ended).toBe(false);
    expect(player1.state.score).toBe(null);
    expect(player2.state.score).toBe(null);
    expect(rook.getAvailableMoves()).toEqual([{ x: XLine.B, y: YLine._7 }]);
  });
});
