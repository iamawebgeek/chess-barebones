import { Board8x8, Direction, Game, Player } from '@chess-barebones/core';
import { describe, expect, it } from 'vitest';

import { InsufficientMaterialsProcessor } from './insufficient';
import { Color } from '../chess';
import { ChessFigureFactory } from '../factory';
import { Figure } from '../figures';
import { AlgebraicNotationSerializer } from '../serializers';

const setup = () => {
  const board = new Board8x8<Figure>(new ChessFigureFactory());
  const serializer = new AlgebraicNotationSerializer(board);
  const player1 = new Player(Color.WHITE, Direction.SOUTH);
  const player2 = new Player(Color.BLACK, Direction.NORTH);
  const chess = new Game(
    board,
    serializer,
    new InsufficientMaterialsProcessor(board),
  );
  chess.addPlayer(player1);
  chess.addPlayer(player2);
  return {
    chess,
    serializer,
    board,
    players: { [Color.WHITE]: player1, [Color.BLACK]: player2 },
  };
};

describe('InsufficientMaterialsProcessor', () => {
  it('ends the game when only kings left', () => {
    const { chess, board, players } = setup();
    board.loadPosition('white-king-1:e1:e2;black-king-1:e8:e7', players);
    chess.start();
    chess.move('Kf2');
    expect(chess.state.ended).toBe(true);
  });

  it('ends the game when king and bishop vs king', () => {
    const { chess, board, players } = setup();
    board.loadPosition(
      'white-king-1:e1:-;white-bishop-1:c1:-;black-king-1:e8:e8',
      players,
    );
    chess.start();
    chess.move('Bb2');
    expect(chess.state.ended).toBe(true);
  });

  it('ends the game when king and knight vs king', () => {
    const { chess, board, players } = setup();
    board.loadPosition(
      'white-king-1:e1:-;white-knight-1:b1:-;black-king-1:e8:e8',
      players,
    );
    chess.start();
    chess.move('Nc3');
    expect(chess.state.ended).toBe(true);
  });

  it('ends the game when kings with bishops on same color squares', () => {
    const { chess, board, players } = setup();
    board.loadPosition(
      'white-king-1:e1:-;white-bishop-1:c1:-;black-king-1:e8:e8;black-bishop-1:c8:-',
      players,
    );
    chess.start();
    chess.move('Bb2');
    expect(chess.state.ended).toBe(true);
  });

  it('does not end the game when sufficient material exists', () => {
    const { chess, board, players } = setup();
    board.loadPosition(
      'white-king-1:e1:-;white-queen-1:c1:-;black-king-1:e8:e8',
      players,
    );
    chess.start();
    chess.move('Qc5');
    expect(chess.state.ended).toBe(false);
  });
});
