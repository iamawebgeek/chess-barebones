---
sidebar_position: 3
---

# Philosophy

The core philosophy behind Chess barebones is to provide a flexible and extensible foundation for creating chess games and their variations. The library is designed to be modular and easy to use, allowing developers to create their own custom game logic, pieces, and even new board games from scratch.

## Isomorphic Design

One of the key goals of Chess barebones is to enable the creation of chess games that can run on both the server and the client. The core library (`@chess-barebones/core`) has no dependencies on the DOM, making it possible to run the same game logic in a Node.js environment or in a web browser.

This isomorphic design allows for a wide range of applications, from simple client-side chess games to complex server-authoritative multiplayer experiences.

## Extensibility

Chess barebones is designed to be highly extensible. The library provides a set of core building blocks that can be used to create new game variants, custom pieces, and unique game mechanics. The use of handlers and decorators makes it easy to add new functionality without modifying the core library.

## Separation of Concerns

The Chess barebones monorepo is divided into three distinct packages, each with its own clear responsibility:

-   `@chess-barebones/core`: The heart of the library, providing the core game logic.
-   `@chess-barebones/chess`: A concrete implementation of the rules of chess.
-   `@chess-barebones/chess-react`: A set of React components for rendering a chess game.

This separation of concerns makes the library easy to understand, maintain, and extend.
