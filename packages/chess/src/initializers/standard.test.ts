import { Board8x8, Direction, Player } from '@chess-barebones/core';
import { describe, expect, it } from 'vitest';

import { StandardChessInitializer } from './standard';
import { Color } from '../chess';
import { ChessFigureFactory } from '../factory';
import { Figure } from '../figures';

describe('StandardChessInitializer', () => {
  it('creates same figures', () => {
    const board = new Board8x8<Figure>(new ChessFigureFactory());
    const initializer = new StandardChessInitializer(board);
    const player1 = new Player(Color.WHITE, Direction.SOUTH);
    const player2 = new Player(Color.BLACK, Direction.NORTH);
    initializer.onPlayerAdded(player1);
    initializer.onPlayerAdded(player2);
    expect(board.serializePosition()).toMatchSnapshot();
  });
});
