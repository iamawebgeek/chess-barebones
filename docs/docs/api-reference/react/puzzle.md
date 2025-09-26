---
sidebar_position: 4
---

# Puzzle Component

`Puzzle: React.FC<PuzzleProps>`

Renders a Chess game configured with the PuzzleProcessor for interactive puzzle flows.

## Props

Accepts all the props of the `Chess` component except for `chessInstance` and `boardInstance`.

Additional props:

- `playingFor: Color` — Which side the user plays for.
- `initialPosition: string` — Serialized board position the puzzle starts from (Board8x8 serialization).
- `autoFirstMove: boolean` — If true, the first expected move from the puzzle sequence is played automatically.
- `movesGenerator: AsyncGeneratorFunction | GeneratorFunction` — A generator that yields expected moves in algebraic notation (e.g., 'e4', 'Nf3', etc.).
- `handler?: Handler` — Optional handler to observe game events.
- `chessRef?: React.RefObject<Game>` — Ref to access the underlying Game instance.
