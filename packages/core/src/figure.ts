import { AbstractBoard } from './board';
import { ObservableState } from './observable';
import { Player } from './player';
import { Coordinate } from './types';

export type Move = Coordinate & {
  requiresInput?: symbol;
};

export type Captured = {
  captured: true;
  capture: [Player, number];
  previousCoordinate: Coordinate;
  coordinate: null;
};

export type NotCaptured = {
  captured: false;
  capture: null;
  previousCoordinate: Coordinate | null;
  coordinate: Coordinate;
};

export abstract class AbstractFigure<
  T extends string,
  S extends Captured | NotCaptured = Captured | NotCaptured,
> extends ObservableState<S, Coordinate> {
  private readonly ordinal;

  public constructor(
    private readonly _name: T,
    private readonly _owner: Player,
    protected readonly board: AbstractBoard<T>,
    public readonly initialCoordinate: Coordinate,
  ) {
    super(initialCoordinate);
    this.ordinal = board.getPlayerFiguresByName(_owner, _name).length + 1;
  }

  public getInitialState(initParam?: Coordinate) {
    const initialState: NotCaptured = {
      captured: false,
      capture: null,
      previousCoordinate: null,
      coordinate: initParam ?? this.initialCoordinate,
    };
    return initialState as S;
  }

  public get owner() {
    return this._owner;
  }

  public get name() {
    return this._name;
  }

  public get id() {
    return `${this._owner.color}-${this._name}-${this.ordinal}`;
  }

  public captureBy(player: Player, as?: number) {
    if (!this._state.captured) {
      as ??=
        this.board
          .getAllFigures()
          .filter((figure) => figure.state.capture?.[0] === player).length + 1;
      const newState: Captured = {
        captured: true,
        capture: [player, as],
        previousCoordinate: this._state.coordinate,
        coordinate: null,
      };
      this.state = newState as S;
    }
  }

  public move(to: Coordinate | string) {
    if (typeof to === 'string') {
      to = this.board.deserializeCoordinate(to);
    }
    const figureAtTargetCoordinate = this.board.getFigure(to);
    if (
      figureAtTargetCoordinate !== null &&
      !figureAtTargetCoordinate.state.captured
    ) {
      figureAtTargetCoordinate.captureBy(this._owner);
    }
    const newState: NotCaptured = {
      captured: false,
      capture: null,
      previousCoordinate: this._state.coordinate,
      coordinate: to,
    };
    this.state = newState as S;
    this.board.lastMoved = this as AbstractFigure<T, NotCaptured>;
  }

  public reset() {
    this.state = this.getInitialState();
  }

  public abstract getAvailableMoves(): Move[];
  public abstract getAllMoves(): Move[];
  public abstract getReach(): Coordinate[];
}

export class BaseFigure<T extends string> extends AbstractFigure<T> {
  public getAllMoves() {
    return [] as Move[];
  }

  public getAvailableMoves() {
    return [] as Move[];
  }

  public getReach() {
    return [] as Coordinate[];
  }
}

export type InferFigureName<T extends AbstractFigure<string>> =
  T extends AbstractFigure<infer N> ? N : never;

export const castFigure = <S extends Captured | NotCaptured, T extends string>(
  figure: AbstractFigure<T>,
) => figure as AbstractFigure<InferFigureName<typeof figure>, S>;
