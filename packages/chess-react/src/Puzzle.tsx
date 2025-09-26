import {
  AlgebraicNotationSerializer,
  ChessBoard8x8,
  ChessFigureFactory,
  Color,
} from '@chess-barebones/chess';
import {
  combineHandlers,
  Direction,
  Game,
  Handler,
  Player,
  PuzzleProcessor,
} from '@chess-barebones/core';
import * as React from 'react';

import { Chess } from './Chess';

import type { ChessProps } from './Chess';

export type PuzzleProps = Omit<
  ChessProps,
  'chessInstance' | 'boardInstance'
> & {
  chessRef?: React.RefObject<Game>;
  playingFor: Color;
  initialPosition: string;
  autoFirstMove: boolean;
  movesGenerator: AsyncGeneratorFunction | GeneratorFunction;
  handler?: Handler;
};

export const Puzzle: React.FC<PuzzleProps> = ({
  chessRef,
  initialPosition,
  movesGenerator,
  playingFor,
  autoFirstMove,
  handler,
  ...props
}) => {
  const handlerRef = React.useRef(handler);
  handlerRef.current = handler;
  const { puzzleInstance, boardInstance } = React.useMemo(() => {
    const boardInstance = new ChessBoard8x8(new ChessFigureFactory());
    const serializer = new AlgebraicNotationSerializer(boardInstance);
    const puzzlerColor =
      (playingFor as Color) === Color.WHITE ? Color.BLACK : Color.WHITE;
    const handlers: Handler[] = [
      {
        onMove(...args: Parameters<NonNullable<Handler['onMove']>>) {
          void handlerRef.current?.onMove?.(...args);
        },
        onEnd(...args: Parameters<NonNullable<Handler['onEnd']>>) {
          void handlerRef.current?.onEnd?.(...args);
        },
        onStart(...args: Parameters<NonNullable<Handler['onStart']>>) {
          void handlerRef.current?.onStart?.(...args);
        },
        onPlayerAdded(
          ...args: Parameters<NonNullable<Handler['onPlayerAdded']>>
        ) {
          void handlerRef.current?.onPlayerAdded?.(...args);
        },
      },
      new PuzzleProcessor(
        new Player(
          puzzlerColor,
          puzzlerColor === Color.WHITE ? Direction.SOUTH : Direction.NORTH,
        ),
        boardInstance,
        serializer,
        initialPosition,
        movesGenerator,
        autoFirstMove,
      ),
    ];
    const puzzleInstance = new Game(
      boardInstance,
      serializer,
      combineHandlers(handlers),
    );
    puzzleInstance.addPlayer(
      new Player(
        playingFor,
        playingFor === Color.WHITE ? Direction.SOUTH : Direction.NORTH,
      ),
    );
    puzzleInstance.start();
    return { puzzleInstance, boardInstance };
  }, [autoFirstMove, initialPosition, movesGenerator, playingFor]);

  if (chessRef) {
    (chessRef as React.MutableRefObject<Game>).current = puzzleInstance;
  }

  return (
    <Chess
      chessInstance={puzzleInstance}
      boardInstance={boardInstance}
      playingFor={playingFor}
      {...props}
    />
  );
};
