---
sidebar_position: 2
---

# Game

`Game<FigureName extends string, Move extends object, PlayerColor extends string = string>`

The `Game` class is the main orchestrator of the game loop. It manages the players, the board, and the moves.

## Constructor

`constructor(board: AbstractBoard<FigureName>, serializer: MoveSerializer<FigureName, Move>, handler: Handler = {})`

-   `board`: An instance of `AbstractBoard` that represents the game board.
-   `serializer`: An instance of `MoveSerializer` that is responsible for serializing and deserializing moves.
-   `handler`: An object that implements the `Handler` interface, which allows you to hook into various game events.

## Properties

-   `board: AbstractBoard<FigureName>`: The game board.
-   `serializer: MoveSerializer<FigureName, Move>`: The move serializer.
-   `handler: Handler`: The game handler.
-   `state: GameState<PlayerColor>`: The current state of the game.

## Methods

-   `addPlayer(player: Player<PlayerColor>): void`: Adds a player to the game.
-   `getPlayers(): Player<PlayerColor>[]`: Returns an array of all the players in the game.
-   `getPlayerToMove(): Player<PlayerColor> | null`: Returns the next player to move.
-   `start(): void`: Starts the game.
-   `move(move: string): void`: Makes a move in the game.
