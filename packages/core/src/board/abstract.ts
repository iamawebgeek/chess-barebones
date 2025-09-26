import {
  InvalidStateArgumentError,
  InvalidStateError,
  ParsingError,
} from '../errors';
import { FigureFactory } from '../factory';
import { AbstractFigure, Captured, NotCaptured } from '../figure';
import { checkCoordinatesEquality, getRelativeDirection } from '../helpers';
import { ObservableState } from '../observable';
import { Player } from '../player';
import { DirectionToVectorMap, Coordinate } from '../types';

export type BoardState<N extends string> = {
  activeFigures: AbstractFigure<N, NotCaptured>[];
  captures: AbstractFigure<N, Captured>[];
};

export abstract class AbstractBoard<
  T extends string = string,
> extends ObservableState<BoardState<T>> {
  public lastMoved: AbstractFigure<T, NotCaptured> | null = null;

  public constructor(protected readonly figureFactory: FigureFactory<T>) {
    super();
  }

  public abstract getCoordinateWithVector(
    coordinate: Coordinate,
    vector: [number, number],
  ): Coordinate | null;

  public abstract serializeCoordinate(coordinate: Coordinate): string;
  public abstract deserializeCoordinate(coordinate: string): Coordinate;

  public getInitialState() {
    return {
      activeFigures: [],
      captures: [],
    };
  }

  public createFigure(name: T, owner: Player, coordinate: Coordinate | string) {
    if (typeof coordinate === 'string') {
      coordinate = this.deserializeCoordinate(coordinate);
    }
    const figureAtCoordinate = this.getFigure(coordinate);
    if (figureAtCoordinate?.state.captured === false) {
      throw new InvalidStateError(
        this,
        `Another figure exists at coordinate "${this.serializeCoordinate(coordinate)}", please use replaceFigure method instead`,
      );
    }
    const figure = this.figureFactory.create(name, owner, this, coordinate);
    this.state = {
      ...this._state,
      activeFigures: [...this._state.activeFigures, figure],
    };
    figure.subscribe(() => {
      if (figure.state.captured) {
        this.state = {
          ...this._state,
          captures: [
            ...this._state.captures,
            figure as unknown as AbstractFigure<T, Captured>,
          ],
          activeFigures: this.state.activeFigures.filter((f) => f !== figure),
        };
      }
    });
    return figure;
  }

  public replaceFigure(figure: AbstractFigure<T, NotCaptured>, name: T) {
    if (figure.state.captured) {
      throw new InvalidStateArgumentError(
        figure,
        'Cannot replace captured figure',
      );
    }
    const newFigure = this.figureFactory.create(
      name,
      figure.owner,
      this,
      figure.state.coordinate,
    );
    this.state = {
      ...this._state,
      activeFigures: [
        ...this._state.activeFigures.filter((f) => f !== figure),
        newFigure,
      ],
    };
    return newFigure;
  }

  public getFigure(coordinate: Coordinate | string) {
    if (typeof coordinate === 'string') {
      coordinate = this.deserializeCoordinate(coordinate);
    }
    return (
      (Object.values(this._state.activeFigures).find((figure) =>
        checkCoordinatesEquality(coordinate, figure.state.coordinate),
      ) as AbstractFigure<T, NotCaptured>) ?? null
    );
  }

  public getAllFigures(): AbstractFigure<T, Captured | NotCaptured>[] {
    return [...this.state.activeFigures, ...this.state.captures];
  }

  public getPlayerFigures(player: Player) {
    return this.getAllFigures().filter((figure) => figure.owner === player);
  }

  public getPlayerFiguresByName(player: Player, figureName: T) {
    return this.getAllFigures().filter(
      (figure) => figure.owner === player && figure.name === figureName,
    );
  }

  public getFiguresReachCoordinate(coordinate: Coordinate) {
    return Object.values(this.state.activeFigures).filter((figure) => {
      return figure
        .getReach()
        .some((reach) => checkCoordinatesEquality(coordinate, reach));
    });
  }

  public getPathBetweenCoordinates(base: Coordinate, end: Coordinate) {
    const path: Coordinate[] = [];
    const direction = getRelativeDirection(end, base);
    if (direction !== null) {
      do {
        base = this.getCoordinateWithVector(
          base,
          DirectionToVectorMap[direction],
        )!;
        path.push(base);
      } while (!checkCoordinatesEquality(base, end));
    }
    return path;
  }

  public serializePosition() {
    return this.getAllFigures()
      .sort((figure1, figure2) => figure1.id.localeCompare(figure2.id))
      .map((figure) => {
        const { captured, capture, coordinate, previousCoordinate } =
          figure.state;
        const at = !captured
          ? this.serializeCoordinate(coordinate)
          : `#${capture[0].color}-${capture[1]}`;
        const was = previousCoordinate
          ? this.serializeCoordinate(previousCoordinate)
          : '-';
        return `${figure.id}:${at}:${was}`;
      })
      .join(';');
  }

  public loadPosition(
    serializedPosition: string,
    players: Record<string, Player>,
  ) {
    const figureStates = serializedPosition.trim().split(';');
    const currentFigures = this.getAllFigures().reduce((map, figure) => {
      map.set(figure.id, figure);
      return map;
    }, new Map<string, AbstractFigure<T>>());
    this.state = figureStates.reduce(
      (state, figureSerialization) => {
        const [id, at, was] = figureSerialization.trim().split(':');
        let figure = currentFigures.get(id);
        currentFigures.delete(id);
        if (!at || !was) {
          throw new ParsingError(figureSerialization, 'Invalid coordinate(s)');
        }
        if (!figure) {
          const [color, name] = id.split('-');
          if (!players[color] || !name) {
            throw new ParsingError(
              figureSerialization,
              !name
                ? 'Expected figure name to be provided'
                : 'Player is not found in the parameters',
            );
          }
          figure = this.createFigure(name as T, players[color], at);
        }
        if (was === '-') {
          figure.reset();
        } else {
          figure.move(was);
        }
        if (at.startsWith('#')) {
          const [color, as] = at.substring(1).split('-');
          if (!players[color] || Number.isNaN(parseInt(as))) {
            throw new ParsingError(
              figureSerialization,
              !players[color]
                ? 'Player is not found in the parameters'
                : 'Missing capture ordinal for the figure',
            );
          }
          figure.captureBy(players[color], +as);
          state.captures.push(figure as AbstractFigure<T, Captured>);
        } else {
          figure.move(at);
          state.activeFigures.push(figure as AbstractFigure<T, NotCaptured>);
        }
        return state;
      },
      { activeFigures: [], captures: [] } as BoardState<T>,
    );
    currentFigures.forEach((figure) => figure.unsubscribeAll());
  }
}
