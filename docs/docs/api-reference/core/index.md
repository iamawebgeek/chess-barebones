---
sidebar_position: 1
---

# Core API Reference

The `@chess-barebones/core` package provides the fundamental building blocks for creating turn-based, board-centric games.

## Key Exports

-   **`Game`**: The main game loop orchestrator.
-   **`AbstractBoard`**: An abstract class for representing a game board.
-   **`Board8x8`**: A concrete implementation of `AbstractBoard` for an 8x8 board.
-   **`AbstractFigure`**: An abstract class for representing a game piece.
-   **`BaseFigure`**: A concrete implementation of `AbstractFigure` with no moves.
-   **`Player`**: Represents a participant in the game.
-   **`Handler`**: An interface for hooking into game events.
-   **`combineHandlers`**: A function for combining multiple handlers.
-   **`MoveSerializer`**: An abstract class for serializing and deserializing moves.
-   **`Timer`**: A simple chess-like clock.
-   **`PuzzleProcessor`**: A handler for creating interactive puzzles.
