import { AbstractBoard } from './board';
import { AbstractFigure, NotCaptured } from './figure';
import { Player } from './player';
import { Coordinate } from './types';

export interface FigureFactory<T extends string> {
  create(
    name: T,
    player: Player,
    board: AbstractBoard<T>,
    coordinate: Coordinate,
  ): AbstractFigure<T, NotCaptured>;
}
