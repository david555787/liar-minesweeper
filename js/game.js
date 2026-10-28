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
};

/** Reset a session without generating mines before the player's first reveal. */
export function newGame() {
  // TODO: Reset gameState to its defaults, create an empty board with
  // createEmptyBoard, and clear flags, verification markers, and the result.
  // Keep isBoardGenerated false until handleReveal receives an eligible cell.
}

/** Coordinate reveals so board mechanics do not need lives or victory state. */
export function handleReveal(row, column) {
  // TODO: Ignore ended games; route verify-mode clicks to handleVerify.
  // In reveal mode, ignore flagged/revealed cells. On the first eligible reveal,
  // place mines avoiding it, compute true values, and choose the persistent liar
  // before calling revealCell. Support a fixed debug layout at this same boundary.
  // Deduct one life for each newly hit mine; the fifth distinct hit loses.
  // Win when all safe cells are revealed. On either result, end interactions and
  // expose remaining mines and the liar's true and original displayed values.
}

/** Treat flags as player notes rather than a correctness or victory check. */
export function handleFlag(row, column) {
  // TODO: Ignore ended games and revealed cells; toggle the covered cell's
  // isFlagged field and update flagCount without checking whether it is a mine.
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
