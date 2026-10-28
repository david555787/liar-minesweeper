import {
  createEmptyBoard,
  placeMinesAvoidingCell,
  computeTrueValues,
  chooseLiar,
  revealCell,
  createBoardFromFixedLayout,
} from './board.js';

// Keep state independent of the DOM so controlled boards can test the rules later.
export const gameState = {
  rows: 9,
  columns: 9,
  mineCount: 10,
  board: [],
  isBoardGenerated: false,
  lives: 5,
  verificationsLeft: 3,
  flagCount: 0,
  mode: 'reveal',
  status: 'ready',
  debugMode: false,
  fixedLayout: null,
  debugError: '',
};

/** Reset a session without generating mines before the player's first reveal. */
export function newGame() {
  // Preserve debug configuration so New Game can reproduce the same fixture.
  Object.assign(gameState, {
    rows: 9,
    columns: 9,
    mineCount: gameState.debugMode && gameState.fixedLayout
      ? gameState.fixedLayout.mineCoordinates.length : 10,
    board: createEmptyBoard(9, 9),
    isBoardGenerated: false,
    lives: 5,
    verificationsLeft: 3,
    flagCount: 0,
    mode: 'reveal',
    status: gameState.debugError || 'Ready — choose a cell.',
  });
}

/** Coordinate reveals so board mechanics do not need lives or victory state. */
export function handleReveal(row, column) {
  const cell = gameState.board[row]?.[column];
  if (!cell || cell.isFlagged || cell.isRevealed || gameState.debugError) return;

  if (!gameState.isBoardGenerated) {
    if (gameState.debugMode && gameState.fixedLayout) {
      const { mineCoordinates, liarCoordinate, liarDisplayedValue } = gameState.fixedLayout;
      let fixedBoard;
      try {
        fixedBoard = createBoardFromFixedLayout(
          mineCoordinates, liarCoordinate, liarDisplayedValue, 9, 9,
        );
      } catch (error) {
        gameState.status = `Invalid debug layout: ${error.message}`;
        return;
      }
      // A fixed fixture must stay exact while still honoring a safe first reveal.
      if (fixedBoard[row][column].isMine) {
        gameState.status = 'Debug layout: choose a safe cell for the first reveal.';
        return;
      }
      for (const fixedCell of fixedBoard.flat()) {
        fixedCell.isFlagged = gameState.board[fixedCell.row][fixedCell.column].isFlagged;
      }
      gameState.board = fixedBoard;
    } else {
      placeMinesAvoidingCell(gameState.board, gameState.mineCount, row, column);
      computeTrueValues(gameState.board);
      chooseLiar(gameState.board);
    }
    gameState.isBoardGenerated = true;
  }

  const newlyRevealedCells = revealCell(gameState.board, row, column);
  gameState.status = newlyRevealedCells.some((revealedCell) => revealedCell.isMine)
    ? 'Mine revealed — keep exploring.' : 'Exploring — one clue is mischievous.';
  // TODO: Route verify-mode clicks to handleVerify when verification is added.
  // TODO: Deduct lives only for newly revealed mines; the fifth distinct hit loses.
  // TODO: Detect victory after every safe cell is revealed; on either result,
  // stop interactions, show remaining mines, and expose both original liar values.
}

/** Treat flags as player notes rather than a correctness or victory check. */
export function handleFlag(row, column) {
  const cell = gameState.board[row]?.[column];
  if (!cell || cell.isRevealed) return;
  cell.isFlagged = !cell.isFlagged;
  gameState.flagCount += cell.isFlagged ? 1 : -1;
  // TODO: Ignore flag actions after victory or defeat is implemented.
}

/**
 * Use one entry point for verification mode and verification targets.
 * Omit coordinates to toggle mode; provide both to attempt a verification.
 */
export function handleVerify(row, column) {
  // TODO: Ignore ended games. With no coordinates, toggle reveal/verify mode
  // only when verificationsLeft > 0. For a target in verify mode, accept only a
  // revealed, unverified safe cell; invalid targets consume nothing.
  // On success, decrement verificationsLeft, set isVerified, show trueValue,
  // preserve originalDisplayedValue, and return to reveal mode. Never flood fill.
}
