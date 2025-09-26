import {
  ChessFigureFactory,
  Figure,
  StandardChessInitializer,
  TimerProcessor,
  RegularChess as RegularChessGame,
} from '@chess-barebones/chess';
import { Board8x8, combineHandlers, Handler } from '@chess-barebones/core';
import * as React from 'react';

import { Chess, ChessProps } from './Chess';

export type RegularChessProps = Omit<
  ChessProps,
  'chessInstance' | 'boardInstance'
> & {
  chessRef?: React.RefObject<RegularChessGame>;
  handler?: Handler;
};

export const RegularChess: React.FC<RegularChessProps> = ({
  handler,
  timer,
  chessRef,
  ...rest
}) => {
  const handlerRef = React.useRef(handler);
  handlerRef.current = handler;
  const { chessInstance, boardInstance } = React.useMemo(() => {
    const board = new Board8x8<Figure>(new ChessFigureFactory());

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
      new StandardChessInitializer(board),
    ];
    if (timer) {
      handlers.push(new TimerProcessor(timer));
    }

    const gameInstance = new RegularChessGame(board, combineHandlers(handlers));

    gameInstance.start();

    return {
      chessInstance: gameInstance,
      boardInstance: board,
    };
  }, [timer]);

  if (chessRef) {
    (chessRef as React.MutableRefObject<RegularChessGame>).current =
      chessInstance;
  }

  return (
    <Chess
      timer={timer}
      chessInstance={chessInstance}
      boardInstance={boardInstance}
      {...rest}
    />
  );
};
