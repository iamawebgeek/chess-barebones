import { Color } from '../chess';
import { createPlayer } from '../player';
import { BoardInstance, Coordinate, XLine, YLine } from '../board/types';
import {
  createBishop,
  createKing,
  createKnight,
  createPawn,
  createQueen,
  createRook,
  FigureCreator,
} from '../figures';
import { GameProcessor } from './types';

const initialWhiteFigures = [
  [createRook, { x: XLine.A, y: YLine._1 }],
  [createKnight, { x: XLine.B, y: YLine._1 }],
  [createBishop, { x: XLine.C, y: YLine._1 }],
  [createQueen, { x: XLine.D, y: YLine._1 }],
  [createKing, { x: XLine.E, y: YLine._1 }],
  [createBishop, { x: XLine.F, y: YLine._1 }],
  [createKnight, { x: XLine.G, y: YLine._1 }],
  [createRook, { x: XLine.H, y: YLine._1 }],
  [createPawn, { x: XLine.A, y: YLine._2 }],
  [createPawn, { x: XLine.B, y: YLine._2 }],
  [createPawn, { x: XLine.C, y: YLine._2 }],
  [createPawn, { x: XLine.D, y: YLine._2 }],
  [createPawn, { x: XLine.E, y: YLine._2 }],
  [createPawn, { x: XLine.F, y: YLine._2 }],
  [createPawn, { x: XLine.G, y: YLine._2 }],
  [createPawn, { x: XLine.H, y: YLine._2 }],
] as Readonly<[FigureCreator, Coordinate][]>;

const initialBlackFigures = [
  [createRook, { x: XLine.A, y: YLine._8 }],
  [createKnight, { x: XLine.B, y: YLine._8 }],
  [createBishop, { x: XLine.C, y: YLine._8 }],
  [createQueen, { x: XLine.D, y: YLine._8 }],
  [createKing, { x: XLine.E, y: YLine._8 }],
  [createBishop, { x: XLine.F, y: YLine._8 }],
  [createKnight, { x: XLine.G, y: YLine._8 }],
  [createRook, { x: XLine.H, y: YLine._8 }],
  [createPawn, { x: XLine.A, y: YLine._7 }],
  [createPawn, { x: XLine.B, y: YLine._7 }],
  [createPawn, { x: XLine.C, y: YLine._7 }],
  [createPawn, { x: XLine.D, y: YLine._7 }],
  [createPawn, { x: XLine.E, y: YLine._7 }],
  [createPawn, { x: XLine.F, y: YLine._7 }],
  [createPawn, { x: XLine.G, y: YLine._7 }],
  [createPawn, { x: XLine.H, y: YLine._7 }],
] as Readonly<[FigureCreator, Coordinate][]>;

export const createRegularChessProcessor = (): GameProcessor => {
  return {
    init(board: BoardInstance, whitePlayer, blackPlayer) {
      //const whitePlayer = createPlayer(Color.WHITE)
      initialWhiteFigures.forEach(([figureCreator, initialCoordinate]) => {
        whitePlayer.addFigure(figureCreator({ board, initialCoordinate }));
      });
      board.addPlayer(whitePlayer);
      //const blackPlayer = createPlayer(Color.BLACK)
      initialBlackFigures.forEach(([figureCreator, initialCoordinate]) => {
        blackPlayer.addFigure(figureCreator({ board, initialCoordinate }));
      });
      board.addPlayer(blackPlayer);
    },
    move() {},
  };
};
