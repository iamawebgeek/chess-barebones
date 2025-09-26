import { AbstractBoard } from './board';
import { Handler } from './handler';
import { Player } from './player';
import { MoveSerializer } from './serializer';

export enum PuzzleResult {
  Solved = 1,
  Failed = 2,
}

export class PuzzleProcessor implements Handler {
  private players: Record<string, Player> = {};
  private generator:
    | Generator<string, void, unknown>
    | AsyncGenerator<string, void, unknown>;

  public constructor(
    private readonly puzzler: Player,
    private readonly board: AbstractBoard<any>,
    private readonly serializer: MoveSerializer<any, any>,
    private readonly initialPosition: string,
    private readonly moveGenerator: GeneratorFunction | AsyncGeneratorFunction,
    private readonly makeFirstMove: boolean = true,
  ) {
    this.generator = moveGenerator() as
      | Generator<string, void, unknown>
      | AsyncGenerator<string, void, unknown>;
    this.players[puzzler.color] = puzzler;
  }

  private async getNextMove(): Promise<{ move: string; completed: boolean }> {
    const next = this.generator.next();
    const move = next instanceof Promise ? await next : next;
    if (!move.value) {
      throw new Error('Generator function must yield only a string');
    }
    return { move: move.value, completed: move.done ?? false };
  }

  public onPlayerAdded(player: Player) {
    this.players[player.color] = player;
  }

  public async onMove(move: string, player: Player) {
    const next = await this.getNextMove();
    if (next.move !== move) {
      player.assignScore(PuzzleResult.Failed);
      return;
    }
    if (next.completed) {
      player.assignScore(PuzzleResult.Solved);
    } else {
      const next = await this.getNextMove();
      this.serializer.deserialize(next.move, this.puzzler);
    }
  }

  public async onStart() {
    this.board.loadPosition(this.initialPosition, this.players);
    if (this.makeFirstMove) {
      const { move } = await this.getNextMove();
      this.serializer.deserialize(move, this.puzzler);
    }
  }
}
