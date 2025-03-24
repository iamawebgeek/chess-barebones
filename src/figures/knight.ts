import { createAbstractFigure, FigureCreator, FigureInstance } from './figure';
import { Figure } from './types';
import { walk } from './helpers';
import { createCheckProxy, createPinProxy } from './decorators';

const moves = [
  [2, 1],
  [2, -1],
  [-2, 1],
  [-2, -1],
  [1, 2],
  [1, -2],
  [-1, 2],
  [-1, -2],
] as Readonly<[number, number][]>;

export const createKnight: FigureCreator = createCheckProxy(
  createPinProxy((props) => {
    const knight = createAbstractFigure({
      ...props,
      name: Figure.KNIGHT,
    });
    return {
      ...knight,
      getAvailableMoves(bypassDecorators, pierce = false) {
        const owner = props.board.getFigureOwner(knight.getState().coordinate);
        return moves
          .map((vector) => walk(knight.getState().coordinate, vector))
          .filter(
            (move) =>
              move !== null &&
              (pierce ? true : props.board.getFigureOwner(move) !== owner),
          );
      },
    } as FigureInstance;
  }),
);
