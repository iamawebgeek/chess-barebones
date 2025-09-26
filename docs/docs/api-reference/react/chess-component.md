---
sidebar_position: 2
---

# Chess Component

`Chess: React.FC<ChessProps>`

## Props

-   `chessInstance: Game<FigureName, any>`
-   `boardInstance: AbstractBoard<FigureName>`
-   `components: { Board: React.ComponentType<BoardProps>, Figure: React.ComponentType<FigureProps>, Capture: React.ComponentType<Pick<FigureProps, 'name' | 'color'>>, MoveHighlight: React.ComponentType<MoveHighlightProps>, PawnPromotionMenu: React.ComponentType<PawnPromotionMenuProps>, Timer?: React.ComponentType<TimerProps> }`
-   `flipped?: boolean`
-   `playingFor?: string`
-   `timer?: Timer`
