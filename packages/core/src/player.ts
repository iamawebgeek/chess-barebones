import { InvalidStateError } from './errors';
import { ObservableState } from './observable';
import { Direction } from './types';

export type PlayerState = {
  score: number | null;
};

export class Player<
  T extends string = string,
> extends ObservableState<PlayerState> {
  public constructor(
    public readonly color: T,
    public readonly flank: Direction,
  ) {
    super();
  }

  public getInitialState(): PlayerState {
    return { score: null };
  }

  public assignScore(score: number) {
    if (this.state.score !== null) {
      throw new InvalidStateError(this, 'Score has already been assigned');
    }
    this.state = { score };
  }
}
