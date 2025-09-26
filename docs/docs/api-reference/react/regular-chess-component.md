---
sidebar_position: 3
---

# RegularChess Component

`RegularChess: React.FC<RegularChessProps>`

## Props

Accepts all the props of the `Chess` component except for `chessInstance` and `boardInstance`. It also accepts an optional `handler` and `timer` which are integrated internally.

-   `handler?: Handler`
-   `timer?: Timer`
-   `chessRef?: React.RefObject<RegularChessGame>`
