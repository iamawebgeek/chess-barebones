import {
  Board8x8,
  Coordinate,
  Direction,
  Game,
  Player,
} from '@chess-barebones/core';
import { describe, expect, it } from 'vitest';

import { RepetitionProcessor } from './repetition';
import { Color } from '../chess';
import { ChessFigureFactory } from '../factory';
import { Figure } from '../figures';
import { AlgebraicNotationSerializer } from '../serializers';

const setup = (
  coordinate1: Coordinate | string,
  coordinate2: Coordinate | string,
) => {
  const board = new Board8x8<Figure>(new ChessFigureFactory());
  const player1 = new Player(Color.WHITE, Direction.SOUTH);
  const player2 = new Player(Color.BLACK, Direction.NORTH);
  const serializer = new AlgebraicNotationSerializer(board);
  const chess = new Game(board, serializer, new RepetitionProcessor(board));
  board.createFigure(Figure.KING, player1, 'e1');
  board.createFigure(Figure.KING, player2, 'e8');
  const rook1 = board.createFigure(Figure.ROOK, player1, coordinate1);
  const rook2 = board.createFigure(Figure.ROOK, player2, coordinate2);
  chess.addPlayer(player1);
  chess.addPlayer(player2);
  const move = (from: Coordinate | string, to: Coordinate | string) => {
    chess.move(
      serializer.serialize({
        from:
          typeof from === 'string' ? board.deserializeCoordinate(from) : from,
        to: typeof to === 'string' ? board.deserializeCoordinate(to) : to,
      }),
    );
  };
  return { board, chess, move, player1, player2, rook1, rook2 };
};

describe('RepetitionProcessor', () => {
  it('detects threefold moves repetition', () => {
    const { chess, player1, player2, move } = setup('a1', 'h8');

    chess.start();

    move('a1', 'a2');
    move('h8', 'h7');
    move('a2', 'a1');
    move('h7', 'h8');
    move('a1', 'a2');
    move('h8', 'h7');
    move('a2', 'a1');
    move('h7', 'h8');
    move('a1', 'a2');
    move('h8', 'h7');

    expect(chess.state.ended).toBe(true);
    expect(player1.state.score).toBe(2); // DRAW
    expect(player2.state.score).toBe(2); // DRAW
  });

  it('does not end game before threefold repetition', () => {
    const { chess, player1, player2, move } = setup('a2', 'd5');

    chess.start();

    // Only two repetition cycles (not enough for threefold)
    move('a2', 'a3');
    move('d5', 'd6');
    move('a3', 'a2');
    move('d6', 'd5');

    expect(chess.state.ended).toBe(false);
    expect(player1.state.score).toBe(null);
    expect(player2.state.score).toBe(null);
  });

  it('handles different positions separately', () => {
    const { chess, move } = setup('a2', 'd5');

    chess.start();

    // Make different moves to create different positions
    move('a2', 'a3');
    move('d5', 'd6');

    // Make a different move
    move('a3', 'b3');
    move('d6', 'd5');
    move('b3', 'b4');
    move('d5', 'd6');

    expect(chess.state.ended).toBe(false);
  });
});
