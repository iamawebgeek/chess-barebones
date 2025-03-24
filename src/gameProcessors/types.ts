import { BoardInstance } from '../board/types';
import { Player } from '../player';

export type GameProcessor = {
  init(board: BoardInstance, whitePlayer: Player, blackPlayer: Player): void;
  move(): void;
};
