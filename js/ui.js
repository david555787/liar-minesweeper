/** Keep page updates separate so rendering cannot alter the game's deductions. */
export function renderGame(gameState) {
  // TODO: Render the board and status through renderBoard and renderStatus.
  // Present friendly result feedback and both liar values when the game ends.
}

/** Preserve visible evidence, including explicit liar zeroes and verification. */
export function renderBoard(gameState) {
  // TODO: Populate #board with accessible cell buttons identified by row/column.
  // Render covers, flags, mine hits, clues, and permanent verified markers.
  // Leave honest true-zero clues blank; show an explicit 0 for an unverified
  // liar displaying zero. Verified cells show trueValue. At the end, expose
  // remaining mines and highlight the liar with trueValue/originalDisplayedValue.
  // Add debug presentation of every cell's true/displayed values and mine/liar
  // markers when debug mode is enabled; keep hidden information out of normal UI.
}

/** Reflect state consistently so counters never imply a different ruleset. */
export function renderStatus(gameState) {
  // TODO: Update #lives, #verifications-left, #mines, #flags, #mode, and #status.
  // Sync #verify-button's aria-pressed state; disable it at zero verifications
  // or after a result. Disable board interactions after victory or defeat.
}

/**
 * Inject callbacks so DOM events do not own game rules.
 * @param {object} handlers Reveal, flag, verify, and new-game callbacks.
 */
export function attachEventHandlers(handlers) {
  // TODO: Delegate #board left-clicks to handlers.onReveal(row, column).
  // Prevent the board's contextmenu default and pass right-clicked cell
  // coordinates to handlers.onFlag. Ignore events without a cell target.
  // Connect #verify-button to handlers.onVerify() and #new-game-button to
  // handlers.onNewGame(); rerender after callbacks and attach listeners only once.
}
