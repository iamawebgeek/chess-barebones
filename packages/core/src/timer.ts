import { Player } from './player';

export type Options = {
  seconds: number;
  increment?: number;
};

export class Timer {
  private subscriptions = new Set<(player: Player) => void>();
  private currentTimer = 0;
  private startTime: number | null = null;
  private currentPlayer: Player | null = null;
  private remainingTime = new Map<Player, number>();

  public constructor(private readonly options: Options) {}

  public initPlayer(player: Player) {
    if (!this.remainingTime.has(player)) {
      this.remainingTime.set(player, this.options.seconds * 1000);
    }
  }

  public subscribe(listener: (player: Player) => void) {
    this.subscriptions.add(listener);
    return () => {
      this.subscriptions.delete(listener);
    };
  }

  public startWatch(player: Player) {
    clearTimeout(this.currentTimer);

    const playerRemainingTime = this.remainingTime.get(player) ?? 0;
    if (playerRemainingTime < 10) {
      this.subscriptions.forEach((subscription) => {
        subscription(player);
      });
    } else {
      this.currentTimer = setTimeout(() => {
        if (this.currentPlayer) {
          this.remainingTime.set(this.currentPlayer, 0);
          this.subscriptions.forEach((subscription) => {
            subscription(player);
          });
        }
      }, playerRemainingTime);
    }

    if (this.currentPlayer !== null) {
      let setRemaining = this.remainingTime.get(this.currentPlayer);
      if (setRemaining == null) {
        throw new Error('Reached invalid state');
      }
      if (this.startTime !== null) {
        const elapsed = Date.now() - this.startTime;
        const incrementMs = (this.options.increment ?? 0) * 1000;
        setRemaining = setRemaining - elapsed + incrementMs;
      }
      this.remainingTime.set(this.currentPlayer, setRemaining);
    }
    this.currentPlayer = player;
    this.startTime = Date.now();
  }

  public stopWatch() {
    clearTimeout(this.currentTimer);
    if (this.currentPlayer !== null && this.startTime !== null) {
      const prevRemaining = this.remainingTime.get(this.currentPlayer);
      if (prevRemaining != null) {
        const elapsed = Date.now() - this.startTime;
        this.remainingTime.set(this.currentPlayer, prevRemaining - elapsed);
      }
    }
    this.startTime = null;
    this.currentPlayer = null;
  }

  public getRemainingTime(player: Player) {
    const remainingTime = this.remainingTime.get(player) ?? null;
    if (remainingTime === null) {
      return -1;
    }
    if (remainingTime <= 0) {
      return 0;
    }
    if (player === this.currentPlayer && this.startTime !== null) {
      return remainingTime - (Date.now() - this.startTime);
    }
    return remainingTime;
  }
}
