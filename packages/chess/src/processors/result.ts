import { Player, Handler } from '@chess-barebones/core';

export enum Result {
  WIN,
  LOSS,
  DRAW,
}

export abstract class ResultProcessor implements Handler {
  protected players: Player[] = [];

  public abstract check(player: Player, nextPlayer: Player): void;

  public onPlayerAdded(player: Player) {
    this.players.push(player);
  }

  public onMove(_: string, player: Player, nextPlayer: Player) {
    if (player.state.score === null) {
      this.check(player, nextPlayer);
    }
  }

  public scorePlayer(player: Player, result: Result) {
    const scores = this.players
      .map((player) => player.state.score)
      .filter((score) => score !== null);
    const max = Math.max(this.players.length, ...scores);
    const notScoredPlayers = this.players.length - scores.length;
    player.assignScore(result === Result.WIN ? max - 1 : max);
    if (notScoredPlayers === 2) {
      this.players.forEach((player) => {
        if (player.state.score === null) {
          this.scorePlayer(
            player,
            result === Result.LOSS ? Result.WIN : Result.DRAW,
          );
        }
      });
    }
  }
}
