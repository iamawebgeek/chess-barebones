import {
  ChessBoard8x8,
  ChessFigureFactory,
  Color,
  Figure as FigureName,
} from '@chess-barebones/chess';
import { useObservablesState } from '@chess-barebones/chess-react';
import {
  AbstractFigure,
  BaseFigure,
  checkCoordinatesEquality,
  Coordinate,
  Direction,
  Player,
} from '@chess-barebones/core';
import useIsBrowser from '@docusaurus/useIsBrowser';
import Layout from '@theme/Layout';
import {
  Board as UIBoard,
  Capture as UICapture,
  Figure as UIFigure,
  Highlight as UIHighlight,
} from 'chess-barebones-ui-components';
import * as React from 'react';
import styled from 'styled-components';

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: stretch;
`;

const Output = styled.textarea`
  width: 100%;
  min-height: 220px;
  padding: 12px;
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace;
  font-size: 0.95rem;
  line-height: 1.5;
  border-radius: 10px;
  border: 1px solid var(--ifm-color-emphasis-300);
  background: var(--ifm-background-surface-color);
  color: var(--ifm-font-color-base);
  box-shadow: var(--ifm-global-shadow-lw);
  resize: vertical;
`;

const ButtonsRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  & > button {
    flex: 1;
  }
`;

const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(380px, 1fr) minmax(360px, 520px);
  gap: 24px;
  align-items: start;

  @media (max-width: 996px) {
    grid-template-columns: 1fr;
  }
`;

const BoardArea = styled.div`
  display: grid;
  justify-items: center;
  gap: 16px;
`;

const Sidebar = styled.aside`
  position: sticky;
  top: calc(var(--ifm-navbar-height) + 16px);
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--ifm-color-emphasis-300);
  background: var(--ifm-background-surface-color);
  box-shadow: var(--ifm-global-shadow-lw);
`;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

const white = new Player(Color.WHITE, Direction.SOUTH);
const black = new Player(Color.BLACK, Direction.NORTH);

const createNewBoard = () => new ChessBoard8x8(new ChessFigureFactory());

export default function ChessBuilderPage() {
  const [board, setBoard] = React.useState(createNewBoard);
  const [dragging, setDragging] =
    React.useState<AbstractFigure<FigureName> | null>(null);
  const [hoveredSquare, setHoveredSquare] = React.useState<Coordinate | null>(
    null,
  );
  const [output, setOutput] = React.useState('');

  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const getSquareFromEvent = React.useCallback(
    (e: PointerEvent | React.PointerEvent): Coordinate | null => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return null;
      const shell = wrapper.firstElementChild as HTMLElement | null;
      const boardEl = shell?.children?.[1] as HTMLElement | undefined;
      if (!boardEl) return null;
      const rect = boardEl.getBoundingClientRect();
      const size = rect.width;
      const sx = (e.clientX - rect.left) / size;
      const syFromTop = (e.clientY - rect.top) / size;
      const x = clamp(Math.floor(sx * 8) + 1, 1, 8);
      const y = clamp(8 - Math.floor(syFromTop * 8), 1, 8);
      return { x, y };
    },
    [],
  );

  React.useEffect(() => {
    if (!dragging) return;

    const onMove = (e: PointerEvent) => {
      const sq = getSquareFromEvent(e);
      setHoveredSquare(sq);
    };

    const onUp = () => {
      setHoveredSquare((square) => {
        if (square) {
          if (dragging.state.captured) {
            const atSquare = board.getFigure(square);
            if (atSquare) {
              board.replaceFigure(atSquare, dragging.name);
            } else {
              board.createFigure(dragging.name, dragging.owner, square);
            }
          } else if (
            !checkCoordinatesEquality(dragging.state.coordinate, square)
          ) {
            dragging.move(square);
          }
        }
        return null;
      });
      setDragging(null);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [board, dragging, getSquareFromEvent]);

  const isBrowser = useIsBrowser();

  if (!isBrowser) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const boardState = useObservablesState(board);

  const serialize = () => {
    setOutput(board.serializePosition());
  };

  const loadFromFEN = () => {
    try {
      board.loadPosition(output, {
        white,
        black,
      });
      setOutput(board.serializePosition());
    } catch (e) {
      // Basic alert for now; in docs context it's acceptable
      alert((e as Error).message);
    }
  };

  // Render helpers
  const renderBoardFigures = () =>
    boardState.activeFigures.map((p) => (
      <UIFigure
        key={p.id}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragging(p);
        }}
        onSelect={() => {}}
        name={p.name}
        color={p.owner.color}
        location={p.state.coordinate}
      />
    ));

  const renderMoves = () => {
    if (!dragging || !hoveredSquare) return null;
    const curr = dragging.state.coordinate;
    if (curr && curr.x === hoveredSquare.x && curr.y === hoveredSquare.y)
      return null;
    return [
      <UIHighlight
        key={`hover-${hoveredSquare.x}-${hoveredSquare.y}`}
        move={hoveredSquare}
      />,
    ];
  };

  const renderCaptures = (player: Player) =>
    [
      FigureName.PAWN,
      FigureName.KNIGHT,
      FigureName.BISHOP,
      FigureName.ROOK,
      FigureName.QUEEN,
      FigureName.KING,
    ].map((name) => (
      <div
        key={name}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          const figure = new BaseFigure(name, player, board, { x: 0, y: 0 });
          figure.captureBy(player, 0);
          setDragging(figure);
        }}
      >
        <UICapture
          style={{
            width: '48px',
            height: '48px',
          }}
          name={name}
          color={player.color}
        />
      </div>
    ));

  return (
    <Layout title="Chess Builder" description="Build custom chess positions">
      <main className="container margin-vert--lg">
        <h1 style={{ textAlign: 'center', marginBottom: 24 }}>Chess Builder</h1>
        <p style={{ textAlign: 'center' }}>
          Drag and drop figures to reorganize them
        </p>
        <LayoutGrid>
          <BoardArea>
            <div ref={wrapperRef}>
              <UIBoard
                boardFigures={renderBoardFigures()}
                moves={renderMoves()}
                promotionMenu={null}
                capturesTop={renderCaptures(black)}
                capturesBottom={renderCaptures(white)}
                timerTop={null}
                timerBottom={null}
              />
            </div>
          </BoardArea>
          <Sidebar>
            <h2 style={{ margin: 0 }}>Controls</h2>
            <Controls>
              <button
                className="button button--primary button--lg"
                onClick={() => {
                  setBoard(createNewBoard());
                  setOutput('');
                }}
              >
                Reset Board
              </button>
              <ButtonsRow style={{ marginTop: 8 }}>
                <button
                  className="button button--secondary button--lg"
                  onClick={serialize}
                >
                  Serialize
                </button>
                <button
                  className="button button--secondary button--lg"
                  onClick={loadFromFEN}
                >
                  Load from FEN
                </button>
              </ButtonsRow>
            </Controls>

            <div>
              <h3 style={{ marginTop: 8, marginBottom: 8 }}>FEN / Position</h3>
              <Output
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                placeholder="Use this box to paste a FEN (piece placement only or full FEN) or view the serialized position"
              />
            </div>
          </Sidebar>
        </LayoutGrid>
      </main>
    </Layout>
  );
}
