import {
  Board8x8,
  Direction,
  Game,
  MoveSerializer,
  Player,
} from '@chess-barebones/core';
import { describe, expect, it, vi } from 'vitest';

import { ResultProcessor, Result } from './result';
import { Color } from '../chess';
import { ChessFigureFactory } from '../factory';
import { Figure } from '../figures';

class TestResultProcessor extends ResultProcessor {
  public check() {}

  public testScorePlayer(player: Player, result: Result) {
    this.scorePlayer(player, result);
  }

  public getPlayers() {
    return this.players;
  }
}

const setup = () => {
  const board = new Board8x8<Figure>(new ChessFigureFactory());
  const player1 = new Player(Color.WHITE, Direction.SOUTH);
  const player2 = new Player(Color.BLACK, Direction.NORTH);
  const processor = new TestResultProcessor();
  const chess = new Game(
    board,
    new (class extends MoveSerializer<Figure, object> {
      serialize() {
        return '';
      }

      deserialize() {}
    })(board),
    processor,
  );
  chess.addPlayer(player1);
  chess.addPlayer(player2);
  return { board, player1, player2, chess, processor };
};

describe('ResultProcessor', () => {
  it('tracks players correctly', () => {
    const { player1, player2, processor } = setup();

    expect(processor.getPlayers()).toContain(player1);
    expect(processor.getPlayers()).toContain(player2);
    expect(processor.getPlayers().length).toBe(2);
  });

  it('scores WIN correctly', () => {
    const { player1, player2, processor } = setup();

    processor.testScorePlayer(player1, Result.WIN);

    expect(player1.state.score).toBe(1); // WIN
    expect(player2.state.score).toBe(2); // LOSS
  });

  it('scores LOSS correctly', () => {
    const { player1, player2, processor } = setup();

    processor.testScorePlayer(player1, Result.LOSS);

    expect(player1.state.score).toBe(2); // LOSS
    expect(player2.state.score).toBe(1); // WIN
  });

  it('scores DRAW correctly', () => {
    const { player1, player2, processor } = setup();

    processor.testScorePlayer(player1, Result.DRAW);

    expect(player1.state.score).toBe(2); // DRAW
    expect(player2.state.score).toBe(2); // DRAW
  });

  it('calls check method on move when player has no score', () => {
    const { player1, player2, processor } = setup();

    const checkSpy = vi.spyOn(processor, 'check');

    processor.onMove('test-move', player1, player2);

    expect(checkSpy).toHaveBeenCalledWith(player1, player2);
  });

  it('does not call check method when player already has score', () => {
    const { player1, player2, processor } = setup();

    processor.testScorePlayer(player1, Result.WIN);

    const checkSpy = vi.spyOn(processor, 'check');

    processor.onMove('test-move', player1, player2);

    expect(checkSpy).not.toHaveBeenCalled();
  });

  it('handles three players correctly', () => {
    const player1 = new Player(Color.WHITE, Direction.SOUTH);
    const player2 = new Player(Color.BLACK, Direction.NORTH);
    const player3 = new Player('red', Direction.EAST);
    const processor = new TestResultProcessor();

    processor.onPlayerAdded(player1);
    processor.onPlayerAdded(player2);
    processor.onPlayerAdded(player3);

    expect(processor.getPlayers().length).toBe(3);

    processor.testScorePlayer(player1, Result.LOSS);

    expect(player1.state.score).toBe(3);
    expect(player2.state.score).toBe(null);
    expect(player3.state.score).toBe(null);
  });

  it('handles edge case with no players', () => {
    const processor = new TestResultProcessor();

    expect(processor.getPlayers().length).toBe(0);
  });
});
