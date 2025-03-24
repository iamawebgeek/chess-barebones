import { Figure } from '../figures/types';
import { ProcessorInstance, Score } from './types';

export const createCheckmateProcessor = () => {
  return {
    process(board, playerToMove) {
      const king = playerToMove.getFiguresByName(Figure.KING)[0];
      if (
        king &&
        board.getCoordinateAttackers(king.getState().coordinate).length > 0
      ) {
        const hasMoves = playerToMove.getState().figures.every((figure) => {
          figure.getAvailableMoves().length === 0;
        });
        if (!hasMoves) {
          playerToMove.assignScore(Score.LOOSE);
          board.getAllPlayers().forEach((player) => {
            if (player !== playerToMove) {
              player.assignScore(Score.WIN);
            }
          });
          return true;
        }
      }
    },
  } as ProcessorInstance;
};
