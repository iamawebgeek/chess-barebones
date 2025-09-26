---
sidebar_position: 1
---

# Chess API Reference

The `@chess-barebones/chess` package provides a concrete implementation of the rules of chess, built on top of `@chess-barebones/core`.

## Key Exports

-   **`RegularChess`**: A ready-to-use `Game` subclass with the rules of chess.
-   **`Figure`**: An enum of all the chess pieces.
-   **`ChessFigureFactory`**: A `FigureFactory` that creates decorated chess figures.
-   **`StandardChessInitializer`**: A `Handler` that sets up the standard initial position.
-   **Processors**: A set of `Handler`s that implement the rules of chess (e.g., `CheckmateProcessor`, `StalemateProcessor`).
-   **`AlgebraicNotationSerializer`**: A `MoveSerializer` for standard algebraic notation.
-   **Decorators**: `applyCheckDecorator` and `applyPinDecorator` for adding check and pin logic to figures.
