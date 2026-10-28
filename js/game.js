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
  status: 'playing',
  message: 'Ready — choose a cell.',
  result: null,
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
    status: 'playing',
    message: gameState.debugError || 'Ready — choose a cell.',
    result: null,
  });
}

/** Coordinate reveals so board mechanics do not need lives or victory state. */
export function handleReveal(row, column) {
  if (gameState.status !== 'playing') return;
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
        gameState.message = `Invalid debug layout: ${error.message}`;
        return;
      }
      // A fixed fixture must stay exact while still honoring a safe first reveal.
      if (fixedBoard[row][column].isMine) {
        gameState.message = 'Debug layout: choose a safe cell for the first reveal.';
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
  const newlyHitMines = newlyRevealedCells.filter((revealedCell) => revealedCell.isMine).length;
  // Only this reveal's hits cost lives; exposing mines at the end costs nothing.
  gameState.lives -= newlyHitMines;
  if (gameState.lives === 0) {
    finishGame('lost');
  } else if (gameState.board.flat().every((boardCell) => boardCell.isMine || boardCell.isRevealed)) {
    finishGame('won');
  } else {
    gameState.message = newlyHitMines > 0
      ? 'A little bump! You can keep exploring.' : 'One clue is mischievous. Take your time.';
  }
  // TODO: Route verify-mode clicks to handleVerify when verification is added.
}

/** Treat flags as player notes rather than a correctness or victory check. */
export function handleFlag(row, column) {
  if (gameState.status !== 'playing') return;
  const cell = gameState.board[row]?.[column];
  if (!cell || cell.isRevealed) return;
  cell.isFlagged = !cell.isFlagged;
  gameState.flagCount += cell.isFlagged ? 1 : -1;
}

/**
 * Use one entry point for verification mode and verification targets.
 * Omit coordinates to toggle mode; provide both to attempt a verification.
 */
export function handleVerify(row, column) {
  if (gameState.status !== 'playing') return;
  // TODO: With no coordinates, toggle reveal/verify mode
  // only when verificationsLeft > 0. For a target in verify mode, accept only a
  // revealed, unverified safe cell; invalid targets consume nothing.
  // On success, decrement verificationsLeft, set isVerified, show trueValue,
  // preserve originalDisplayedValue, and return to reveal mode. Never flood fill.
}

/** Preserve the original clue so an eventual verification cannot erase the punchline. */
function finishGame(status) {
  gameState.status = status;
  gameState.mode = 'reveal';
  const liar = gameState.board.flat().find((cell) => cell.isLiar);
  gameState.result = {
    liarRow: liar.row,
    liarColumn: liar.column,
    trueValue: liar.trueValue,
    originalDisplayedValue: liar.originalDisplayedValue,
  };
  for (const cell of gameState.board.flat()) {
    if (cell.isMine || cell.isLiar) cell.isRevealed = true;
  }
  gameState.message = status === 'won'
    ? 'Lovely detective work! Every safe cell is clear.'
    : 'Out of lives — the mischievous clue has been unmasked. Fancy another round?';
}
