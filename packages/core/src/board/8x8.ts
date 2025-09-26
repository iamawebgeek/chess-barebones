import { AbstractBoard } from './abstract';
import { ParsingError } from '../errors';
import { Coordinate } from '../types';

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

const flankLetter: Record<XLine, string> = {
  [XLine.A]: 'a',
  [XLine.B]: 'b',
  [XLine.C]: 'c',
  [XLine.D]: 'd',
  [XLine.E]: 'e',
  [XLine.F]: 'f',
  [XLine.G]: 'g',
  [XLine.H]: 'h',
};

const letterFlank: Record<string, XLine> = {
  a: XLine.A,
  b: XLine.B,
  c: XLine.C,
  d: XLine.D,
  e: XLine.E,
  f: XLine.F,
  g: XLine.G,
  h: XLine.H,
};

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

export class Board8x8<T extends string> extends AbstractBoard<T> {
  public serializeCoordinate(coordinate: Coordinate) {
    return `${flankLetter[coordinate.x as XLine]}${coordinate.y}`;
  }

  public deserializeCoordinate(coordinate: string) {
    if (
      !letterFlank[coordinate.charAt(0)] ||
      Number.isNaN(parseInt(coordinate.charAt(1), 10))
    ) {
      throw new ParsingError(coordinate, 'Invalid coordinate');
    }
    return { x: letterFlank[coordinate.charAt(0)], y: +coordinate.charAt(1) };
  }

  public getCoordinateWithVector(
    coordinate: Coordinate,
    vector: [number, number],
  ) {
    const newX: number = coordinate.x + vector[0];
    if (newX > (XLine.H as number) || newX < (XLine.A as number)) {
      return null;
    }
    const newY: number = coordinate.y + vector[1];
    if (newY > (YLine._8 as number) || newY < (YLine._1 as number)) {
      return null;
    }
    return { x: newX, y: newY };
  }
}
