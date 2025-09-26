---
sidebar_position: 1
---

# Core Concepts

This guide explains the core concepts of the Chess barebones library.

## The Game Loop

The `Game` class from `@chess-barebones/core` is the heart of the library. It orchestrates the game loop, manages players, and handles moves. The `Game` class is a generic class that can be used to create any turn-based, board-centric game.

## The Board

The `AbstractBoard` class represents the game board. It is responsible for managing the state of the board, including the positions of all the pieces. The `@chess-barebones/core` package includes one concrete implementation: `Board8x8`.

## Figures

The `AbstractFigure` class represents a piece on the board. It is an abstract class that must be extended to create a specific type of figure. The `@chess-barebones/chess` package provides concrete implementations of `AbstractFigure` for all the standard chess pieces.

## Players

The `Player` class represents a participant in the game. A `Player` is initialized with a `color` and a `flank`.

## Handlers

Handlers are objects that implement the `Handler` interface, which allows you to hook into various game events, such as `onStart`, `onMove`, and `onEnd`. You can use handlers to implement custom game logic, such as checking for checkmate or stalemate.

## Serializers

Serializers are responsible for serializing and deserializing moves. The `@chess-barebones/chess` package includes an `AlgebraicNotationSerializer` that can serialize and deserialize moves in standard algebraic notation.

## Observable State

The `ObservableState` class is a base class for creating stateful, subscribable objects. The `Game`, `AbstractBoard`, `AbstractFigure`, and `Player` classes all extend `ObservableState`.

This allows you to subscribe to changes in the state of these objects and react accordingly. For example, you can subscribe to the `Game` object to be notified when the game starts or ends, or you can subscribe to a `Player` object to be notified when the player's score changes.

The `@chess-barebones/chess-react` package provides the `useObservablesState` hook, which makes it easy to subscribe to `ObservableState` instances in a React component.
