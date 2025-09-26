import { Player, Timer } from '@chess-barebones/core';

import { Result, ResultProcessor } from './result';

export class TimerProcessor extends ResultProcessor {
  public constructor(private timer: Timer) {
    super();
    timer.subscribe((player) => {
      this.scorePlayer(player, Result.LOSS);
    });
  }

  public onStart() {
    this.timer.startWatch(this.players[0]);
  }

  public onEnd() {
    this.timer.stopWatch();
  }

  public onPlayerAdded(player: Player) {
    this.timer.initPlayer(player);
    super.onPlayerAdded(player);
  }

  public check(_: Player, nextPlayer: Player) {
    this.timer.startWatch(nextPlayer);
  }
}
