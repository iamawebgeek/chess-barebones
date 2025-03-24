import { createBoard } from './board';
import { createPlayer } from './player';
import { Coordinate } from './board/types';
import { GameProcessor } from './gameProcessors';
import {
  createCheckmateProcessor,
  createFiftyMovesProcessor,
  createInsufficientMaterialsProcessor,
  createRepetitionProcessor,
  createStalemateProcessor,
} from './postMoveProcessors';

export const createChess = () => {
  const board = createBoard();
  const state = {
    ended: false,
    board,
    move: Color.WHITE as Color,
    moves: 0,
    processor: null as null | GameProcessor,
  };
  const whitePlayer = createPlayer(Color.WHITE);
  const blackPlayer = createPlayer(Color.BLACK);
  const orderedPostMoveProcessors = [
    createCheckmateProcessor(),
    createStalemateProcessor(),
    createInsufficientMaterialsProcessor(),
    createRepetitionProcessor(),
    createFiftyMovesProcessor(),
  ];
  return {
    setGameProcessor(processor: GameProcessor) {
      state.processor = processor;
    },
    newGame() {
      if (state.processor === null) {
        throw new Error('No game processor');
      }

      state.processor.init(board, whitePlayer, blackPlayer);
    },
    getGameState() {
      return state;
    },
    move(oldCoordinate: Coordinate, newCoordinate: Coordinate) {
      if (!state.ended) {
        const playerToMove =
          state.move === Color.WHITE ? whitePlayer : blackPlayer;
        const figure = board.getFigure(oldCoordinate);
        if (
          figure &&
          board.getFigureOwner(oldCoordinate) === playerToMove &&
          figure
            .getAvailableMoves()
            .some(({ x, y }) => newCoordinate.x === x && newCoordinate.y === y)
        ) {
          state.move = state.move === Color.WHITE ? Color.BLACK : Color.WHITE;
          figure.move(newCoordinate);
          board.move(figure);
          const gameEnded = orderedPostMoveProcessors.some((processor) =>
            processor.process(board, board.getPlayer(state.move)!),
          );
          if (gameEnded) {
            state.ended = true;
          }
        }
      }
    },
  };
};

export enum Color {
  WHITE = '#fff',
  BLACK = '#000',
}
