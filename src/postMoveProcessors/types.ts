import { BoardInstance } from '../board/types';
import { Player } from '../player';

export type ProcessorInstance = {
  process(board: BoardInstance, playerToMove: Player): boolean | void;
};

export enum Score {
  WIN = 1,
  LOOSE = -1,
  DRAW = 0,
}
