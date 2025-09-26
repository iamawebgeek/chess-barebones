import {
  AbstractFigure,
  Board8x8,
  NotCaptured,
  ParsingError,
  Player,
} from '@chess-barebones/core';

import { Color } from '../chess';
import { Figure } from '../figures';

const fenToFigure = {
  p: Figure.PAWN,
  n: Figure.KNIGHT,
  b: Figure.BISHOP,
  r: Figure.ROOK,
  q: Figure.QUEEN,
  k: Figure.KING,
};

const figureToFENSymbol: Record<Figure, string> = {
  [Figure.PAWN]: 'p',
  [Figure.KNIGHT]: 'n',
  [Figure.BISHOP]: 'b',
  [Figure.ROOK]: 'r',
  [Figure.QUEEN]: 'q',
  [Figure.KING]: 'k',
};

export class ChessBoard8x8 extends Board8x8<Figure> {
  public serializePosition() {
    const ranks = Array.from({ length: 8 }, () =>
      Array<null | string>(8).fill(null),
    );

    this.state.activeFigures.forEach((figure) => {
      const { coordinate } = figure.state;
      const fenSymbol = this.getFENSymbol(figure);
      const rank = 8 - coordinate.y;
      ranks[rank][coordinate.x - 1] = fenSymbol;
    });

    return ranks
      .map((rank) => {
        let emptyCount = 0;
        let fenRank = '';

        for (let file = 0; file < 8; file++) {
          const char = rank[file] ?? '';
          if (char === '') {
            emptyCount++;
          } else {
            if (emptyCount > 0) {
              fenRank += emptyCount;
              emptyCount = 0;
            }
            fenRank += char;
          }
        }
        if (emptyCount > 0) {
          fenRank += emptyCount;
        }
        return fenRank;
      })
      .join('/');
  }

  private getFENSymbol(figure: AbstractFigure<Figure, NotCaptured>) {
    let symbol = figureToFENSymbol[figure.name];
    if ((figure.owner.color as Color) === Color.WHITE) {
      symbol = symbol.toUpperCase();
    }
    return symbol;
  }

  public loadPosition(fenString: string, players: Record<string, Player>) {
    const currentFigures = this.getAllFigures();
    currentFigures.forEach((figure) => figure.unsubscribeAll());

    this.state = this.getInitialState();

    const [placement] = fenString.trim().split(/\s+/);
    const ranks = placement.split('/');
    if (ranks.length !== 8) {
      throw new ParsingError(
        fenString,
        'Invalid FEN string: must have 8 ranks',
      );
    }

    ranks.forEach((rank, rankIndex) => {
      let fileIndex = 0;

      for (let i = 0; i < rank.length; i++) {
        const char = rank[i];

        if (/[1-8]/.test(char)) {
          fileIndex += parseInt(char, 10);
          continue;
        }

        const color = char === char.toUpperCase() ? Color.WHITE : Color.BLACK;
        const pieceName = this.getFigureNameFromFen(char);

        if (!players[color]) {
          throw new ParsingError(
            fenString,
            `Player not found for color: ${color}`,
          );
        }

        const coordinate = {
          x: fileIndex + 1,
          y: 8 - rankIndex,
        };

        this.createFigure(pieceName, players[color], coordinate);

        fileIndex++;
      }

      if (fileIndex !== 8) {
        throw new ParsingError(
          fenString,
          `Invalid rank length at rank ${8 - rankIndex}`,
        );
      }
    });
  }

  private getFigureNameFromFen(fenChar: string): Figure {
    const char = fenChar.toLowerCase();

    const name = fenToFigure[char as keyof typeof fenToFigure];
    if (!name) {
      throw new ParsingError(fenChar, 'Invalid piece character in FEN string');
    }

    return name;
  }
}
