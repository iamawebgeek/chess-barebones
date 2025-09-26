import { AbstractBoard, Handler, Player } from '@chess-barebones/core';

export class HistoryProcessor<F extends string = string> implements Handler {
  private moves: string[] = [];
  private positions: string[] = [];
  private currentPositionIndex = 0;
  private players: Record<string, Player> = {};

  public constructor(private readonly board: AbstractBoard<F>) {}

  public onPlayerAdded(player: Player) {
    this.players[player.color] = player;
  }

  public onMove(move: string) {
    this.moves.push(move);
    this.positions.push(this.board.serializePosition());
    this.currentPositionIndex++;
  }

  public onStart() {
    this.positions.push(this.board.serializePosition());
  }

  public undoMove() {
    if (this.moves.length === 0) return;

    this.moves.pop();
    this.positions.pop();

    const position = this.positions.at(-1);
    if (position && this.currentPositionIndex === this.positions.length) {
      this.currentPositionIndex--;
      this.board.loadPosition(position, this.players);
    }
  }

  public previousMove() {
    if (this.currentPositionIndex > 0) {
      this.board.loadPosition(
        this.positions[--this.currentPositionIndex],
        this.players,
      );
    }
  }

  public nextMove() {
    if (this.currentPositionIndex < this.positions.length - 1) {
      this.board.loadPosition(
        this.positions[++this.currentPositionIndex],
        this.players,
      );
    }
  }

  public getAllMoves() {
    return this.moves as Readonly<string[]>;
  }
}
