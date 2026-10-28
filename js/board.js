/**
 * Create cells without generating a layout, so the first reveal can stay safe.
 * @param {number} rows
 * @param {number} columns
 * @returns {Array<Array<object>>} The future two-dimensional cell array.
 */
export function createEmptyBoard(rows, columns) {
  // TODO: Return distinct cells with row, column, trueValue, displayedValue,
  // originalDisplayedValue, isLiar, isMine, isRevealed, isFlagged, and isVerified.
  // Initialize numeric values to 0 and boolean markers to false; do not place mines.
}

/** Place mines only after a first-click position is known. */
export function placeMinesAvoidingCell(board, mineCount, safeRow, safeColumn) {
  // TODO: Randomly place exactly mineCount distinct mines, excluding only the
  // first-clicked cell; its neighbors must remain eligible for mine placement.
}

/** Keep neighboring mine counts independent of misleading clues and mine hits. */
export function computeTrueValues(board) {
  // TODO: Set each safe cell's trueValue to its adjacent mine count, including
  // diagonals and respecting board edges; revealed mines must still count.
}

/** Fix one liar before resolving the first reveal, including any flood fill. */
export function chooseLiar(board) {
  // TODO: Choose exactly one safe cell uniformly, including true-zero cells and
  // the first-clicked cell. Set isLiar, assign all safe displayedValue fields via
  // computeDisplayedValue, and preserve originalDisplayedValue for the end screen.
  // Keep this choice and its original clue fixed for the entire game.
}

/**
 * Separate clue generation from verification so the original lie can be retained.
 * @param {number} trueValue
 * @param {boolean} isLiar
 * @returns {number} The future clue value.
 */
export function computeDisplayedValue(trueValue, isLiar) {
  // TODO: Return trueValue for honest cells. For the liar, map true 0 to 1 and
  // true 8 to 7; otherwise choose trueValue + 1 or trueValue - 1 equally at random.
}

/** Reveal using true values so a misleading zero cannot change expansion. */
export function revealCell(board, row, column) {
  // TODO: Ignore flagged or already revealed cells. Reveal the target; if its
  // trueValue is zero and it is safe, flood fill connected unflagged true-zero
  // cells and their unflagged safe boundary. Never expand into mines or flags.
  // Return newly revealed cells so game state can count distinct mine hits.
}
