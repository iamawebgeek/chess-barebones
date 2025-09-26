import {
  Board8x8,
  Coordinate,
  Direction,
  Game,
  MoveSerializer,
  Player,
} from '@chess-barebones/core';
import { describe, expect, it } from 'vitest';

import { Color } from '../chess';
import { Figure } from '../figures';
import { StalemateProcessor } from './stalemate';
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
  const player1 = new Player(Color.WHITE, Direction.SOUTH);
  const player2 = new Player(Color.BLACK, Direction.NORTH);

  board.createFigure(Figure.KING, player1, king1Coordinate);
  board.createFigure(Figure.KING, player2, king2Coordinate);
  const chess = new Game(
    board,
    new MockSerializer(board),
    new StalemateProcessor(board),
  );
  chess.addPlayer(player1);
  chess.addPlayer(player2);
  chess.start();
  const move = (obj: {
    from: Coordinate | string;
    to: Coordinate | string;
  }) => {
    chess.move(obj as unknown as string);
  };
  return { board, player1, player2, chess, move };
};

describe('StalemateProcessor', () => {
  it('detects stalemate position', () => {
    const { board, player1, player2, chess, move } = setup('a2', 'c1');
    board.createFigure(Figure.QUEEN, player2, 'c6');
    move({ from: 'a2', to: 'a1' });
    move({ from: 'c6', to: 'c2' });

    expect(chess.state.ended).toBe(true);
    expect(player1.state.score).toBe(2);
    expect(player2.state.score).toBe(2);
  });

  it('does not assign scores for non-stalemate position', () => {
    const { board, player1, player2, chess, move } = setup('a2', 'c1');
    board.createFigure(Figure.QUEEN, player2, 'c6');
    move({ from: 'a2', to: 'a1' });
    move({ from: 'c6', to: 'c5' });

    expect(chess.state.ended).toBe(false);
    expect(player1.state.score).toBe(null);
    expect(player2.state.score).toBe(null);
  });
});
