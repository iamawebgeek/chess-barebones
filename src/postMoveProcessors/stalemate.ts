import { ProcessorInstance, Score } from './types';

export const createStalemateProcessor = () => {
  return {
    process(board, playerToMove) {
      const noMoves = playerToMove
        .getState()
        .figures.every((figure) => figure.getAvailableMoves().length === 0);
      if (noMoves) {
        board.getAllPlayers().forEach((player) => {
          player.assignScore(Score.DRAW);
        });
      }
    },
  } as ProcessorInstance;
};
