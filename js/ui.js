/** Keep page updates separate so rendering cannot alter the game's deductions. */
export function renderGame(gameState) {
  renderBoard(gameState);
  renderStatus(gameState);
  // TODO: Present friendly result feedback and both liar values when the game ends.
}

/** Preserve visible evidence, including explicit liar zeroes and verification. */
export function renderBoard(gameState) {
  const boardElement = document.getElementById('board');
  const focusedCell = boardElement.contains(document.activeElement)
    ? document.activeElement : null;
  const focusedRow = focusedCell?.dataset.row;
  const focusedColumn = focusedCell?.dataset.column;
  const fragment = document.createDocumentFragment();

  for (const cell of gameState.board.flat()) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cell';
    button.dataset.row = cell.row;
    button.dataset.column = cell.column;
    let description = 'covered';
    if (cell.isRevealed) {
      button.classList.add('is-revealed');
      if (cell.isMine) {
        button.classList.add('is-mine');
        button.textContent = '✹';
        description = 'revealed mine';
      } else {
        button.dataset.value = cell.displayedValue;
        // A displayed zero is evidence of a lie, unlike an honest blank zero.
        const isBlank = cell.trueValue === 0 && !cell.isLiar;
        button.textContent = isBlank ? '' : String(cell.displayedValue);
        description = isBlank ? 'blank' : `clue ${cell.displayedValue}`;
      }
    } else if (cell.isFlagged) {
      button.classList.add('is-flagged');
      button.textContent = '⚑';
      description = 'flagged';
    } else {
      button.classList.add('is-covered');
    }
    const accessibleLabel = `Row ${cell.row + 1}, column ${cell.column + 1}: ${description}`;
    button.setAttribute('aria-label', accessibleLabel);
    // Hidden values belong only in explicit debug mode, including tooltips/labels.
    if (gameState.debugMode) {
      const debugDetails = `trueValue=${cell.trueValue}; displayedValue=${cell.displayedValue}; ` +
        `isMine=${cell.isMine}; isLiar=${cell.isLiar}`;
      button.title = gameState.isBoardGenerated
        ? debugDetails : `Not generated yet; empty cell: ${debugDetails}`;
      button.setAttribute('aria-label', `${accessibleLabel}. Debug: ${button.title}`);
    }
    fragment.append(button);
  }
  boardElement.replaceChildren(fragment);
  // Preserve keyboard focus across a redraw instead of returning it to the page.
  if (focusedCell) {
    boardElement.querySelector(`[data-row="${focusedRow}"][data-column="${focusedColumn}"]`)?.focus();
  }
  // TODO: Render permanent verified markers and true values after verification.
  // TODO: Show remaining mines and both liar values after victory or defeat.
}

/** Reflect state consistently so counters never imply a different ruleset. */
export function renderStatus(gameState) {
  document.getElementById('lives').textContent = gameState.lives;
  document.getElementById('verifications-left').textContent = gameState.verificationsLeft;
  document.getElementById('mines').textContent = gameState.mineCount;
  document.getElementById('flags').textContent = gameState.flagCount;
  document.getElementById('mode').textContent = gameState.debugMode ? 'Reveal (debug)' : 'Reveal';
  document.getElementById('status').textContent = gameState.status;
  const verifyButton = document.getElementById('verify-button');
  verifyButton.disabled = true;
  verifyButton.title = 'Verification is coming in a later step.';
  // TODO: Enable verification mode, sync aria-pressed, and disable at zero uses.
  // TODO: Disable board interactions after victory or defeat.
}

/**
 * Inject callbacks so DOM events do not own game rules.
 * @param {object} handlers Reveal, flag, verify, and new-game callbacks.
 */
export function attachEventHandlers(handlers) {
  const boardElement = document.getElementById('board');
  // Delegation survives cell replacement; assigning handlers avoids duplicates.
  boardElement.onclick = (event) => {
    const cell = event.target.closest('button.cell');
    if (cell && boardElement.contains(cell)) {
      handlers.onReveal(Number(cell.dataset.row), Number(cell.dataset.column));
    }
  };
  boardElement.oncontextmenu = (event) => {
    event.preventDefault();
    const cell = event.target.closest('button.cell');
    if (cell && boardElement.contains(cell)) {
      handlers.onFlag(Number(cell.dataset.row), Number(cell.dataset.column));
    }
  };
  document.getElementById('new-game-button').onclick = () => handlers.onNewGame();
  // TODO: Connect #verify-button to handlers.onVerify when verification is added.
}
