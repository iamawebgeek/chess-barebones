import {
  AbstractBoard,
  combineHandlers,
  Direction,
  Game,
  Handler,
  InvalidStateError,
  Player,
} from '@chess-barebones/core';

import { Figure } from './figures';
import {
  CheckmateProcessor,
  FiftyMovesProcessor,
  InsufficientMaterialsProcessor,
  RepetitionProcessor,
  StalemateProcessor,
} from './processors';
import { AlgebraicNotationSerializer, RegularChessMove } from './serializers';

export enum Color {
  WHITE = 'white',
  BLACK = 'black',
}

export class RegularChess extends Game<Figure, RegularChessMove, Color> {
  public constructor(board: AbstractBoard<Figure>, handler: Handler = {}) {
    const serializer = new AlgebraicNotationSerializer(board);
    super(
      board,
      serializer,
      combineHandlers([
        handler,
        // Do not change
        // The order is important
        new CheckmateProcessor(board),
        new StalemateProcessor(board),
        new InsufficientMaterialsProcessor(board),
        new FiftyMovesProcessor(board),
        new RepetitionProcessor(board),
      ]),
    );
    this.addPlayer(new Player(Color.WHITE, Direction.SOUTH));
    this.addPlayer(new Player(Color.BLACK, Direction.NORTH));
  }

  public start() {
    if (this.state.players.length !== 2) {
      throw new InvalidStateError(
        this,
        'Regular chess can be played with only 2 players, consider making your variation with Game class',
      );
    }
    super.start();
  }

  public getPlayerByColor(color: Color) {
    return this.state.players.find((player) => player.color === color)!;
  }
}
