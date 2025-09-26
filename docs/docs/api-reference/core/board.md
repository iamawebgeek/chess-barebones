---
sidebar_position: 3
---

# Board

## `AbstractBoard<T extends string>`

An abstract class for representing a game board.

### Properties

-   `lastMoved: AbstractFigure<T, NotCaptured> | null`: The last figure that was moved.

### Methods

-   `createFigure(name: T, owner: Player, coordinate: Coordinate | string): AbstractFigure<T, NotCaptured>`: Creates a figure and adds it to the board.
-   `replaceFigure(figure: AbstractFigure<T, NotCaptured>, name: T): AbstractFigure<T, NotCaptured>`: Replaces a figure with a new one (e.g., for pawn promotion).
-   `getFigure(coordinate: Coordinate | string): AbstractFigure<T, NotCaptured> | null`: Returns the figure at a given coordinate.
-   `getAllFigures(): AbstractFigure<T, Captured | NotCaptured>[]`: Returns all figures on the board, including captured ones.
-   `getPlayerFigures(player: Player): AbstractFigure<T, Captured | NotCaptured>[]`: Returns all figures belonging to a specific player.
-   `getPlayerFiguresByName(player: Player, figureName: T): AbstractFigure<T, Captured | NotCaptured>[]`: Returns all figures of a specific type belonging to a specific player.
-   `getFiguresReachCoordinate(coordinate: Coordinate): AbstractFigure<T, NotCaptured>[]`: Returns all figures that can reach a given coordinate.
-   `getPathBetweenCoordinates(base: Coordinate, end: Coordinate): Coordinate[]`: Returns the path between two coordinates.
-   `serializePosition(): string`: Serializes the entire board position to a string.
-   `loadPosition(serializedPosition: string, players: Record<string, Player>): void`: Loads a board position from a serialized string.
-   `getCoordinateWithVector(coordinate: Coordinate, vector: [number, number]): Coordinate | null`: Returns a new coordinate by applying a vector to an existing coordinate.
-   `serializeCoordinate(coordinate: Coordinate): string`: Serializes a coordinate to a string.
-   `deserializeCoordinate(coordinate: string): Coordinate`: Deserializes a string to a coordinate.

## `Board8x8<T extends string>`

This class extends `AbstractBoard` and provides an implementation for a standard 8x8 board. It uses algebraic-like coordinates (e.g., "e4") for serialization and deserialization.
