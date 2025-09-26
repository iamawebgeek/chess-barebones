---
sidebar_position: 4
---

# Figure

## `AbstractFigure<T extends string, S extends Captured | NotCaptured = Captured | NotCaptured>`

### Properties

-   `name: T`
-   `owner: Player`
-   `id: string`
-   `initialCoordinate: Coordinate`
-   `state: S`

### Methods

-   `captureBy(player: Player, as?: number): void`
-   `move(to: Coordinate | string): void`
-   `reset(): void`
-   `getAvailableMoves(): Move[]`
-   `getAllMoves(): Move[]`
-   `getReach(): Coordinate[]`

## `BaseFigure<T extends string>`

This class extends `AbstractFigure` and provides a base implementation with no moves.
