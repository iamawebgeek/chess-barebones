import { createBoard } from './board';
import { Player } from '../player';
import { FigureInstance } from '../figures';
import { Color } from '../chess';

export enum XLine {
  A = 1,
  B = 2,
  C = 3,
  D = 4,
  E = 5,
  F = 6,
  G = 7,
  H = 8,
}

export enum YLine {
  _1 = 1,
  _2 = 2,
  _3 = 3,
  _4 = 4,
  _5 = 5,
  _6 = 6,
  _7 = 7,
  _8 = 8,
}

export type Coordinate = {
  x: XLine;
  y: YLine;
};

export type BoardInstance = {
  _bypassProxies?: boolean;
  addPlayer(player: Player): void;
  move(figure: FigureInstance): void;
  getPlayer(color: Color): Player | null;
  getAllPlayers(): Player[];
  getFigure(coordinate: Coordinate): FigureInstance | null;
  getFigureOwner(coordinate: Coordinate): Player | null;
  getCoordinateAttackers(coordinate: Coordinate): FigureInstance[];
  getLastMovedFigure(): FigureInstance | null;
  getAllFigures(): FigureInstance[];
};
