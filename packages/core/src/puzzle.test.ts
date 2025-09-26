import { describe, expect, it, vi } from 'vitest';

import { Board8x8 } from './board';
import { FigureFactory } from './factory';
import { BaseFigure } from './figure';
import { Game } from './game';
import { Player } from './player';
import { PuzzleProcessor, PuzzleResult } from './puzzle';
import { MoveSerializer } from './serializer';
import { Direction } from './types';

class MockSerializer extends MoveSerializer<any, any> {
  deserialize = vi.fn();
  serialize = vi.fn(() => '');
}

const setup = async (
  initialPosition: string,
  movesSequence: GeneratorFunction,
  autoStartSequence: boolean = true,
) => {
  const board = new Board8x8({
    create(name, player, board, coordinate) {
      return new BaseFigure(name, player, board, coordinate);
    },
  } as FigureFactory<string>);
  const player = new Player('w', Direction.SOUTH);
  const puzzler = new Player('b', Direction.NORTH);
  const serializer = new MockSerializer(board);
  const chess = new Game(
    board,
    serializer,
    new PuzzleProcessor(
      puzzler,
      board,
      serializer,
      initialPosition,
      movesSequence,
      autoStartSequence,
    ),
  );
  chess.addPlayer(player);
  chess.start();

  await new Promise(process.nextTick);
  return { board, player, puzzler, chess, serializer };
};

const getMovesCycler = (moves: string[]) => {
  return function* () {
    let index = 0;
    while (index < moves.length - 1) {
      yield moves[index++];
    }
    return moves.at(-1);
  } as GeneratorFunction;
};

describe('PuzzleProcessor', () => {
  it('makes the first move automatically on game start by default', async () => {
    const { serializer, puzzler } = await setup(
      'w-k-1:e1:-;b-k-1:h1:-;w-q-1:g8:-',
      getMovesCycler(['Kh2', 'Qg2']),
    );
    expect(serializer.deserialize).toHaveBeenCalledWith('Kh2', puzzler);
  });

  it('does not make the first move if mak initial move is off', async () => {
    const { serializer } = await setup(
      'w-k-1:e1:-;b-k-1:h1:-;w-q-1:g8:-',
      getMovesCycler(['Qg2']),
      false,
    );
    expect(serializer.deserialize).not.toHaveBeenCalled();
  });

  it('solves puzzle when correct move is made', async () => {
    const { player, chess } = await setup(
      'w-k-1:e1:-;b-k-1:h1:-;w-q-1:g8:-',
      getMovesCycler(['Kh2', 'Qg2']),
    );

    chess.move('Qg2');
    await Promise.resolve(process.nextTick);

    expect(player.state.score).toBe(PuzzleResult.Solved);
    expect(chess.state.ended).toBe(true);
  });

  it('fails puzzle when wrong move is made', async () => {
    const { player, chess } = await setup(
      'w-k-1:e1:-;b-k-1:h2:-;w-q-1:g8:-',
      getMovesCycler(['Kh1', 'Qg2']),
    );

    chess.move('Qg6');
    await Promise.resolve(process.nextTick);

    expect(player.state.score).toBe(PuzzleResult.Failed);
    expect(chess.state.ended).toBe(true);
  });

  it('handles multi-move puzzles correctly', async () => {
    const { player, chess, serializer, puzzler } = await setup(
      'w-k-1:e1:-;b-k-1:e8:-;w-q-1:d1:-;b-r-1:h8:-',
      getMovesCycler(['Qd8', 'Rxd8', 'Ke2']),
      false,
    );

    chess.move('Qd8');
    await Promise.resolve(process.nextTick);
    serializer.deserialize.mockClear();

    // Next move in sequence
    await Promise.resolve(process.nextTick);
    expect(player.state.score).toBe(null);
    expect(serializer.deserialize).toHaveBeenCalledExactlyOnceWith(
      'Rxd8',
      puzzler,
    );

    chess.move('Ke2');
    await Promise.resolve(process.nextTick);
    expect(player.state.score).toBe(PuzzleResult.Solved);
  });

  it('fails puzzle when wrong move is made in sequence', async () => {
    const initialPosition = 'w-k-1:e1:-;b-k-1:e8:-;w-q-1:d1:-;b-r-1:h8:-';
    const { player, chess } = await setup(
      initialPosition,
      getMovesCycler(['Qd8', 'Rxd8', 'Ke2']),
      false,
    );

    // Make the first correct move
    chess.move('Qd8');
    await Promise.resolve(process.nextTick);
    await Promise.resolve(process.nextTick);

    // Make the wrong move
    chess.move('Rh7');
    await Promise.resolve(process.nextTick);

    expect(player.state.score).toBe(PuzzleResult.Failed);
  });

  it('loads initial position correctly', async () => {
    const initialPosition = 'w-k-1:e1:-;b-k-1:e8:-;w-q-1:d1:-';
    const { board, player, puzzler } = await setup(
      initialPosition,
      getMovesCycler(['Qd8']),
    );

    // Check that the initial position was loaded
    const wk = board.getPlayerFiguresByName(player, 'k')[0];
    const bk = board.getPlayerFiguresByName(puzzler, 'k')[0];
    const wq = board.getPlayerFiguresByName(player, 'q')[0];

    expect(wk.state.coordinate).toEqual({
      x: 5,
      y: 1,
    });
    expect(bk.state.coordinate).toEqual({
      x: 5,
      y: 8,
    });
    expect(wq.state.coordinate).toEqual({
      x: 4,
      y: 1,
    });
  });
});
