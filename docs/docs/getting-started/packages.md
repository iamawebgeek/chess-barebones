---
sidebar_position: 2
---

# Packages

Chess barebones is a monorepo that consists of three packages:

-   **`@chess-barebones/core`**: The core library that provides the fundamental building blocks for creating turn-based, board-centric games. This package includes the `Game` loop, `AbstractBoard`, `AbstractFigure`, `Player`, and other essential components.

-   **`@chess-barebones/chess`**: A concrete implementation of the rules of chess, built on top of `@chess-barebones/core`. This package includes classes for all the standard chess pieces, as well as handlers for checkmate, stalemate, and other game-ending conditions.

-   **`@chess-barebones/chess-react`**: A set of React components for rendering a chess game in a React application. This package provides a `Chess` component that can be used to render any game created with the `@chess-barebones/core` library, as well as a `RegularChess` component that is pre-configured for a standard game of chess.
