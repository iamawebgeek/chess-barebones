import { AbstractBoard } from './board';
import { InvalidStateError } from './errors';
import { Handler } from './handler';
import { ObservableState } from './observable';
import { Player } from './player';
import { MoveSerializer } from './serializer';

export type GameState<P extends string> = {
  players: Player<P>[];
  started: boolean;
  ended: boolean;
  lastMovedPlayer: null | Player<P>;
  scoredPlayersCount: number;
};

export class Game<
  FigureName extends string = string,
  Move extends object = object,
  PlayerColor extends string = string,
> extends ObservableState<GameState<PlayerColor>> {
  public constructor(
    protected readonly board: AbstractBoard<FigureName>,
    public readonly serializer: MoveSerializer<FigureName, Move>,
    protected readonly handler: Handler = {},
  ) {
    super();
  }

  public getInitialState() {
    return {
      players: [],
      started: false,
      ended: false,
      lastMovedPlayer: null,
      scoredPlayersCount: 0,
    };
  }

  public addPlayer(player: Player<PlayerColor>) {
    if (!this.state.players.includes(player)) {
      this.state = {
        ...this.state,
        players: [...this.state.players, player],
      };
      void this.handler.onPlayerAdded?.(player);
      const unsub = player.subscribe(() => {
        const scoredPlayersCount = this.state.scoredPlayersCount + 1;
        const ended = scoredPlayersCount === this.state.players.length;
        this.state = {
          ...this.state,
          ended,
          scoredPlayersCount,
        };
        if (ended) {
          void this.handler.onEnd?.();
        }
        unsub();
      });
    }
  }

  public getPlayerToMove() {
    if (this.state.ended) {
      return null;
    }
    if (this.state.players.length === 0) {
      throw new InvalidStateError(this, 'No players added');
    }
    const { lastMovedPlayer, players } = this.state;
    return lastMovedPlayer === null
      ? players[0]
      : (players.find(
          (player, index) =>
            player.state.score === null &&
            index > this.state.players.indexOf(lastMovedPlayer),
        ) ??
          players.find((player) => player.state.score === null) ??
          null);
  }

  public start() {
    if (this.state.started) {
      throw new InvalidStateError(this, 'The game has already started');
    }
    this.state = {
      ...this.state,
      started: true,
      ended: false,
      lastMovedPlayer: null,
    };
    void this.handler.onStart?.();
  }

  public move(move: string) {
    if (!this.state.started || this.state.ended) {
      throw new InvalidStateError(
        this,
        'Can only accept moves when the game is started and has not ended',
      );
    }
    const player = this.getPlayerToMove();
    if (!player) {
      throw new InvalidStateError(
        this,
        'Received invalid player to make a move',
      );
    }
    this.serializer.deserialize(move, player);
    this.state = {
      ...this.state,
      lastMovedPlayer: player,
    };
    void this.handler.onMove?.(move, player, this.getPlayerToMove()!);
  }
}
