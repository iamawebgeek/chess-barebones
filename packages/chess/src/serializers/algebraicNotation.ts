import {
  AbstractFigure,
  Coordinate,
  Direction,
  getRelativeDirection,
  IllegalMoveError,
  InvalidMoveError,
  InvalidStateError,
  MoveSerializer,
  NotCaptured,
  Player,
  XLine,
} from '@chess-barebones/core';

import { Figure } from '../figures';

export type RegularChessMove = {
  from: Coordinate;
  to: Coordinate;
  promotion?: Figure;
};

// Mapping constants for algebraic notation
const FIGURE_TO_CHAR: Record<Figure, string> = {
  [Figure.KING]: 'K',
  [Figure.QUEEN]: 'Q',
  [Figure.ROOK]: 'R',
  [Figure.BISHOP]: 'B',
  [Figure.KNIGHT]: 'N',
  [Figure.PAWN]: '',
};

const LETTER_TO_FIGURE: Record<string, Figure> = {
  K: Figure.KING,
  Q: Figure.QUEEN,
  R: Figure.ROOK,
  B: Figure.BISHOP,
  N: Figure.KNIGHT,
};

const FILE_TO_X: Record<string, XLine> = {
  a: XLine.A,
  b: XLine.B,
  c: XLine.C,
  d: XLine.D,
  e: XLine.E,
  f: XLine.F,
  g: XLine.G,
  h: XLine.H,
};

const X_TO_FILE: Record<XLine, string> = {
  [XLine.A]: 'a',
  [XLine.B]: 'b',
  [XLine.C]: 'c',
  [XLine.D]: 'd',
  [XLine.E]: 'e',
  [XLine.F]: 'f',
  [XLine.G]: 'g',
  [XLine.H]: 'h',
};

const KING_CASTLE_DEST = {
  [Direction.EAST]: XLine.G, // short castle
  [Direction.WEST]: XLine.C, // long castle
} as const;

const ROOK_CASTLE_DEST = {
  [Direction.EAST]: XLine.F, // rook from H to F
  [Direction.WEST]: XLine.D, // rook from A to D
} as const;

const CASTLE_TO_STR = {
  [Direction.EAST]: 'O-O',
  [Direction.WEST]: 'O-O-O',
} as const;

const STR_TO_CASTLE_DIR: Record<string, Direction> = {
  'O-O': Direction.EAST,
  'O-O-O': Direction.WEST,
  '0-0': Direction.EAST,
  '0-0-0': Direction.WEST,
  'o-o': Direction.EAST,
  'o-o-o': Direction.WEST,
};

export class AlgebraicNotationSerializer extends MoveSerializer<
  Figure,
  RegularChessMove
> {
  public serialize({ from, to, promotion }: RegularChessMove) {
    const figure = this.board.getFigure(from);
    if (!figure) throw new Error('No figure at source square');

    if (figure.name === Figure.KING && Math.abs(from.x - to.x) > 1) {
      const isEast = to.x > from.x;
      const expectedX = isEast
        ? KING_CASTLE_DEST[Direction.EAST]
        : KING_CASTLE_DEST[Direction.WEST];
      if ((to.x as XLine) !== expectedX) {
        throw new Error('Not a castle move');
      }
      return CASTLE_TO_STR[isEast ? Direction.EAST : Direction.WEST];
    }

    const fromFile = X_TO_FILE[from.x as XLine];
    const toFile = X_TO_FILE[to.x as XLine];
    const pieceChar = FIGURE_TO_CHAR[figure.name];

    const capture = this.isCapture(figure, from, to);

    let san = '';
    if (pieceChar) san += pieceChar;

    const dis = this.needsDisambiguation(figure, from, to);
    if (dis === 'file') san += fromFile;
    else if (dis === 'rank') san += String(from.y);
    else if (dis === 'both') san += `${fromFile}${from.y}`;

    if (capture) {
      if (figure.name === Figure.PAWN) {
        san += fromFile; // pawn captures include its file
      }
      san += 'x';
    }

    san += `${toFile}${to.y}`;

    if (promotion) {
      if (figure.name !== Figure.PAWN) {
        throw new Error('Only pawns can be promoted');
      }
      san += `=${FIGURE_TO_CHAR[promotion]}`;
    }

    return san;
  }

  public deserialize(move: string, player: Player) {
    const trimmed = move.trim();
    const moveSansAnnotations = trimmed.replace(/[!?+#]+$/g, '');

    if (moveSansAnnotations in STR_TO_CASTLE_DIR) {
      const dir = STR_TO_CASTLE_DIR[moveSansAnnotations];
      const king = this.board.getPlayerFiguresByName(player, Figure.KING)[0];
      if (!king) throw new InvalidStateError(this.board, 'No king found');
      const { coordinate, captured } = king.state;
      if (!coordinate || captured) {
        throw new InvalidStateError(this.board, 'King captured');
      }

      const kingTo: Coordinate = {
        x: KING_CASTLE_DEST[dir as keyof typeof KING_CASTLE_DEST],
        y: coordinate.y,
      };
      const rookTo: Coordinate = {
        x: ROOK_CASTLE_DEST[dir as keyof typeof KING_CASTLE_DEST],
        y: coordinate.y,
      };

      const rook = this.getFiguresByNameForPlayer(Figure.ROOK, player)
        .filter((f): f is AbstractFigure<Figure, NotCaptured> => {
          const s = f.state;
          return !s.captured && s.previousCoordinate === null;
        })
        .find(
          (r) => getRelativeDirection(r.state.coordinate, coordinate) === dir,
        );

      if (!this.validateMove(king, kingTo) || !rook) {
        throw new IllegalMoveError(move, king);
      }

      king.move(kingTo);
      rook.move(rookTo);
      return;
    }

    // General SAN: [Piece?][disambig?][x?][dest][=Promotion?]
    const mainRe = new RegExp(
      '^([KQRBN])?([a-h]?[1-8]?)?(x)?([a-h][1-8])(?:=)?([QRBN])?$',
    );
    let m: RegExpMatchArray | null = moveSansAnnotations.match(mainRe);
    if (!m) {
      // Fallback for pawn quiet moves or promotions like e8Q
      const pawnRe = new RegExp('^([a-h][1-8])(?:=)?([QRBN])?$');
      const pm = moveSansAnnotations.match(pawnRe);
      if (!pm) throw new InvalidMoveError(moveSansAnnotations);
      m = [
        moveSansAnnotations,
        undefined,
        undefined,
        undefined,
        pm[1],
        pm[2],
      ] as unknown as RegExpMatchArray;
    }

    const pieceLetter = m[1] || undefined;
    const disambiguation = m[2] || undefined;
    const captureMarker = m[3] || undefined;
    const destination = m[4];
    const promoLetter = m[5] || undefined;

    let srcFile: string | undefined;
    let srcRank: string | undefined;
    if (disambiguation) {
      const fm = disambiguation.match(/[a-h]/);
      if (fm) srcFile = fm[0];
      const rm = disambiguation.match(/[1-8]/);
      if (rm) srcRank = rm[0];
    }

    const dstFile = destination[0];
    const dstRank = destination[1];

    const figureType = pieceLetter
      ? LETTER_TO_FIGURE[pieceLetter.toUpperCase()]
      : Figure.PAWN;

    // Pawn SAN constraints
    if (!pieceLetter) {
      if (captureMarker && !srcFile)
        throw new InvalidMoveError(moveSansAnnotations);
      if (!captureMarker && srcFile)
        throw new InvalidMoveError(moveSansAnnotations);
    }

    const to: Coordinate = { x: FILE_TO_X[dstFile], y: parseInt(dstRank, 10) };

    const captureRequested = Boolean(captureMarker);
    const candidates = this.board
      .getPlayerFiguresByName(player, figureType)
      .filter((f): f is AbstractFigure<Figure, NotCaptured> => {
        const c = f.state.coordinate;
        if (!c) return false;
        if (srcFile && X_TO_FILE[c.x as XLine] !== srcFile) return false;
        if (srcRank && String(c.y) !== srcRank) return false;
        if (!this.validateMove(f, to)) return false;
        const isCap = this.isCapture(f, c, to);
        return captureRequested ? isCap : !isCap;
      });

    if (candidates.length !== 1) {
      throw new InvalidMoveError(moveSansAnnotations);
    }

    const mover = candidates[0];
    mover.move(to);

    if (promoLetter) {
      if (mover.name !== Figure.PAWN)
        throw new InvalidMoveError(moveSansAnnotations);
      const promotionFigure: Figure =
        LETTER_TO_FIGURE[promoLetter.toUpperCase()];
      this.board.replaceFigure(mover, promotionFigure);
    }
  }

  private getFiguresByNameForPlayer(name: Figure, player: Player) {
    return this.board
      .getPlayerFiguresByName(player, name)
      .filter((figure) => !figure.state.captured);
  }

  private isCapture(
    figure: AbstractFigure<Figure>,
    from: Coordinate,
    to: Coordinate,
  ) {
    const targetFigure = this.board.getFigure(to);
    if (targetFigure && targetFigure.owner !== figure.owner) {
      return true;
    }

    // En passant capture for pawns
    if (figure.name === Figure.PAWN) {
      const enPassantTarget = this.board.getFigure({ x: to.x, y: from.y });
      if (
        enPassantTarget &&
        enPassantTarget.name === Figure.PAWN &&
        enPassantTarget.owner !== figure.owner
      ) {
        return true;
      }
    }

    return false;
  }

  private needsDisambiguation(
    figure: AbstractFigure<Figure>,
    from: Coordinate,
    to: Coordinate,
  ): 'file' | 'rank' | 'both' | null {
    if (figure.name === Figure.KING || figure.name === Figure.PAWN) return null;

    /*const samePieceFigures = this.board
      .getPlayerFiguresByName(figure.owner, figure.name)
      .filter(
        (f) => !f.state.captured && f !== figure && this.validateMove(f, to),
      );

    const sameFileFigures = samePieceFigures.filter(
      (f) => f.state.coordinate?.x === from.x,
    );
    const sameRankFigures = samePieceFigures.filter(
      (f) => f.state.coordinate?.y === from.y,
    );

    if (sameFileFigures.length === 0 && sameRankFigures.length === 0) {
      return null;
    }

    if (sameFileFigures.length > 0 && sameRankFigures.length > 0) {
      return 'both';
    }

    return sameFileFigures.length === 0 ? 'file' : 'rank';*/
    const peers = this.board
      .getPlayerFiguresByName(figure.owner, figure.name)
      .filter((f) => f !== figure && !f.state.captured);

    const ambiguousPeers = peers.filter(
      (figure): figure is AbstractFigure<Figure, NotCaptured> => {
        const coordinate = figure.state.coordinate;
        if (!coordinate) return false;
        return this.validateMove(figure, to);
      },
    );

    if (ambiguousPeers.length === 0) return null;

    const sameFile = ambiguousPeers.some(
      (f) => f.state.coordinate.x === from.x,
    );
    const sameRank = ambiguousPeers.some(
      (f) => f.state.coordinate.y === from.y,
    );

    if (sameFile && sameRank) return 'both';
    if (sameFile) return 'rank';
    return 'file';
  }
}
