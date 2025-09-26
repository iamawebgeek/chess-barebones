import { Player } from './player';

export type Handler = Partial<{
  onStart(): Promise<void> | void;
  onEnd(): Promise<void> | void;
  onMove(
    move: string,
    player: Player,
    nextPlayer: Player,
  ): Promise<void> | void;
  onPlayerAdded(player: Player): Promise<void> | void;
}>;

export const combineHandlers = (handlers: Handler[]): Handler => {
  return {
    onMove(...args: Parameters<NonNullable<Handler['onMove']>>) {
      handlers.forEach((handler) => {
        void handler.onMove?.(...args);
      });
    },
    onStart() {
      handlers.forEach((handler) => {
        void handler.onStart?.();
      });
    },
    onEnd() {
      handlers.forEach((handler) => {
        void handler.onEnd?.();
      });
    },
    onPlayerAdded(...args: Parameters<NonNullable<Handler['onPlayerAdded']>>) {
      handlers.forEach((handler) => {
        void handler.onPlayerAdded?.(...args);
      });
    },
  };
};
