import { ProcessorInstance, Score } from './types';
import { Figure } from '../figures/types';

const checkmateInsufficientFigures = [
  Figure.KNIGHT,
  Figure.BISHOP,
  Figure.KING,
];

export const createInsufficientMaterialsProcessor = () => {
  return {
    process(board) {
      const insufficientMaterials = board.getAllPlayers().every((player) => {
        player.getState().figures.length < 3 ||
          player
            .getState()
            .figures.every((figure) =>
              checkmateInsufficientFigures.includes(figure.getState().name),
            );
      });
      if (insufficientMaterials) {
        board.getAllPlayers().forEach((player) => {
          player.assignScore(Score.DRAW);
        });
        return true;
      }
    },
  } as ProcessorInstance;
};
