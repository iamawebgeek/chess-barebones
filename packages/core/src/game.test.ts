import { describe, it, expect, vi } from 'vitest';

import { AbstractBoard, Board8x8 } from './board';
import { FigureFactory } from './factory';
import { BaseFigure } from './figure';
import { Game } from './game';
import { combineHandlers, Handler } from './handler';
import { Player } from './player';
import { MoveSerializer } from './serializer';
import { Direction } from './types';

class TestSerializer<F extends string, M extends object> extends MoveSerializer<
  F,
  M
> {
  public serialize() {
    return 'x';
  }

  public deserialize() {
    // spy hook
  }
}

const setup = (initialHandler: Handler = {}) => {
  const white = new Player('white', Direction.NORTH);
  const black = new Player('black', Direction.SOUTH);
  const board: AbstractBoard = new Board8x8({
    create(name, player, board, coordinate) {
      return new BaseFigure(name, player, board, coordinate);
    },
  } as FigureFactory<string>);
  const serializer = new TestSerializer<string, { fake?: true }>(board);
  const deserializeSpy = vi.spyOn(serializer, 'deserialize');
  const handler = initialHandler;
  return { white, black, board, serializer, deserializeSpy, handler };
};

describe('Game', () => {
  it('throws when getting player to move with no players', () => {
    const { board, serializer, handler } = setup();
    const game = new Game<string, { fake?: true }>(board, serializer, handler);
    expect(() => game.getPlayerToMove()).toThrow('No players added');
  });

  it('adds unique players and calls onPlayerAdded callback once when addPlayer is called', () => {
    const onPlayerAdded = vi.fn();
    const { board, serializer, white, black } = setup();
    const handler: Handler = { onPlayerAdded };
    const game = new Game<string, { fake?: true }>(board, serializer, handler);

    game.addPlayer(white);
    game.addPlayer(white); // duplicate should be ignored
    game.addPlayer(black);

    const { players } = game.state;
    expect(players.length).toBe(2);
    expect(players[0]).toBe(white);
    expect(players[1]).toBe(black);
    expect(onPlayerAdded).toHaveBeenCalledTimes(2);
    expect(onPlayerAdded).toHaveBeenNthCalledWith(1, white);
    expect(onPlayerAdded).toHaveBeenNthCalledWith(2, black);
  });

  it('sets start flag in its state to true and calls onStart callback when start is called', () => {
    const onStart = vi.fn();
    const { board, serializer } = setup();
    const handler: Handler = { onStart };
    const game = new Game<string, { fake?: true }>(board, serializer, handler);

    game.start();

    const state = game.state;
    expect(state.started).toBe(true);
    expect(state.ended).toBe(false);
    expect(state.lastMovedPlayer).toBeNull();
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('returns the first player added initially and rotates after each move', () => {
    const { board, serializer, white, black, deserializeSpy } = setup();
    const game = new Game<string, { fake?: true }>(board, serializer, {});
    game.addPlayer(white);
    game.addPlayer(black);
    game.start();

    expect(game.getPlayerToMove()).toBe(white);

    game.move('e4');
    expect(deserializeSpy).toHaveBeenCalledWith('e4', white);
    expect(game.getPlayerToMove()).toBe(black);

    game.move('e5');
    expect(deserializeSpy).toHaveBeenLastCalledWith('e5', black);
    expect(game.getPlayerToMove()).toBe(white);
  });

  it('move does nothing if current player already has a score', () => {
    const { board, serializer, white, deserializeSpy } = setup();
    const game = new Game<string, { fake?: true }>(board, serializer, {});
    game.addPlayer(white);
    game.start();
    white.assignScore(1);

    expect(() => game.move('any')).toThrow();
    expect(deserializeSpy).not.toHaveBeenCalled();
    // last moved player should remain null because no move executed
    expect(game.state.lastMovedPlayer).toBeNull();
  });

  it('calls onMove with move, player and next player, updates lastMovedPlayer', () => {
    const onMove = vi.fn();
    const { board, serializer, white, black } = setup();
    const handler: Handler = { onMove };
    const game = new Game<string, { fake?: true }>(board, serializer, handler);
    game.addPlayer(white);
    game.addPlayer(black);
    game.start();

    game.move('m1');

    expect(game.state.lastMovedPlayer).toBe(white);
    expect(onMove).toHaveBeenCalledTimes(1);
    expect(onMove).toHaveBeenCalledWith('m1', white, black);
  });

  it('throws on an attempt to call start twice', () => {
    const { board, serializer } = setup();
    const game = new Game<string, { fake?: true }>(board, serializer);
    game.start();

    expect(() => game.start()).toThrow();
  });

  it('sets ended state and calls onEnd when all players have scores after a move', () => {
    const onEnd = vi.fn();
    const onMove = vi.fn();
    const { board, serializer, white, black } = setup();
    const handler: Handler = combineHandlers([{ onEnd, onMove }]);
    const game = new Game<string, { fake?: true }>(board, serializer, handler);
    game.addPlayer(white);
    game.addPlayer(black);
    game.start();

    // After first move, no end yet
    game.move('m1');
    expect(game.state.ended).toBe(false);
    expect(onEnd).not.toHaveBeenCalled();

    onMove.mockImplementation(() => {
      // Assign score to next player (black), then make white move again to trigger end when both are scored
      black.assignScore(0);
      white.assignScore(1);
    });

    game.move('m2');
    expect(game.state.ended).toBe(true);
    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it('throws an error when move called after game ended', () => {
    const { board, serializer, white, black } = setup();
    const handler: Handler = combineHandlers([
      {
        onMove: () => {
          black.assignScore(0);
          white.assignScore(1);
        },
      },
    ]);
    const game = new Game<string, { fake?: true }>(board, serializer, handler);
    game.addPlayer(white);
    game.addPlayer(black);
    game.start();
    game.move('m2');
    expect(game.state.ended).toBe(true);
    expect(() => game.move('c4')).toThrow();
  });
});
