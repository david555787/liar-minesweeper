# Liar Minesweeper

## What this is

Liar Minesweeper is a browser game written in plain HTML, CSS, and JavaScript with no third-party dependencies. Exactly one safe cell initially shows a number off by exactly 1; verification can replace that misleading clue with its true value.

## How to run

From the repository folder, run:

```sh
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000). Serve the files over HTTP: the browser uses ES modules, so double-clicking `index.html` is not a supported way to run it. The default configuration is 9 by 9 with 10 mines, generated on the first eligible reveal.

### Debug mode

Open [http://localhost:8000/?debug=1](http://localhost:8000/?debug=1). The UI code puts `trueValue`, `displayedValue`, `isMine`, and `isLiar` in each cell's hover tooltip and accessible label. Before generation, these describe empty cells. Browser tooltip behavior is **not verified** by the Node tests.

Fixed-layout format:

```text
http://localhost:8000/?debug=1&mines=ROW,COL;ROW,COL&liar=ROW,COL&shown=VALUE
```

Example with two mines and a true-0 liar displaying 1:

```text
http://localhost:8000/?debug=1&mines=0,0;1,1&liar=4,4&shown=1
```

Coordinates are zero-based, from 0 through 8. Supply `mines`, `liar`, and `shown` together; `mines=` permits an empty mine list. Mines must be distinct, the liar must be safe, and `shown` must be 0 through 8 and differ from its true value by exactly 1. Custom fixtures can have a different mine count; the counter uses the supplied count.

The fixture loads on the first safe reveal. Clicking a fixture mine first leaves the board ungenerated and asks for a safe cell. New Game retains the URL configuration and defers generation again. URL parsing and browser loading are **not verified** by the committed tests; the underlying fixed-layout builder is tested.

### Tests

```sh
node js/board.test.js
node js/game.test.js
```

Both suites passed during this handoff: 16 board tests and 26 game tests, using Node v26.8.2 and built-in `assert`. Other Node versions are **not verified**. These suites test logic and state, not browser rendering or browser events.

## Controls

- **Left-click:** reveal a covered, unflagged cell in reveal mode. The first reveal is safe; neighboring cells are not protected.
- **Right-click:** toggle a flag on a covered cell. Flags are notes, not checked answers. The UI handler suppresses the board's context menu.
- **Verify:** toggle verification mode, then click a revealed, unverified safe cell to spend one of 3 uses and show its true value with a permanent check mark. A successful check returns to reveal mode. Clicking Verify again cancels for free; invalid targets consume nothing and keep verify mode on. Verification does not expand neighbors.
- **New Game:** reset lives to 5, verifications to 3, flags, verified markers, and the result. Mines and the liar are generated on the next eligible reveal.

## Acceptance criteria status

No author self-check results or observed-bug list accompanied the handoff request. Therefore no criterion is marked Done. **Not verified** below means author acceptance is unconfirmed, even where the automated logic checks pass; it does not mean the feature is absent. Notes describe coverage in the committed tests.

| # | Criterion | Status | Evidence / remaining check |
|---|---|---|---|
| 1 | Debug values and fixed layouts | Not verified | Fixed-layout builder tested; URL parsing and browser tooltips not covered. |
| 2 | 81 covered cells; 10 mines after generation | Not verified | Cell structure and repeated mine counts tested; visible grid not covered. |
| 3 | Safe first reveal at corner, edge, interior | Not verified | Each position tested on 300 generated boards. |
| 4 | Reveal, flag, blocked flagged reveals, no context menu | Not verified | State operations tested; mouse events and menu suppression not covered. |
| 5 | Correct true values at edges and diagonals | Not verified | A hand-made 3-by-4 layout checks expected counts. |
| 6 | Exactly one safe liar off by 1; all safe cells eligible | Not verified | 500 generated boards plus controlled selection draws; natural occurrence frequencies not measured. |
| 7 | Boundary offsets and persistent liar | Not verified | 0/8 offsets, both branches for 1–7, identity, and original clue tested. |
| 8 | True-zero flood fill skips mines and flags | Not verified | Expected region/boundary and a blocking flag tested. |
| 9 | True-0 liar expands; true-1 liar does not; explicit zero | Not verified | Expansion behavior tested; explicit-zero browser rendering not covered. |
| 10 | Verification use, marker, cancellation, invalid targets, zero limit | Not verified | State transitions tested; visible marker and disabled button not covered. |
| 11 | Verify liar without replacing it or expanding neighbors | Not verified | Identity, original clue, corrected clue, and unchanged reveal mask tested. |
| 12 | Five distinct mine hits; repeated hits free; clues stable | Not verified | Four continuing hits, fifth-hit defeat, repeat hits, and clue stability tested. |
| 13 | All safe cells wins; flags alone do not | Not verified | Last-cell/flood-fill wins and flag-only non-victory tested. |
| 14 | End locks actions, exposes mines and both liar values | Not verified | Locks, mine exposure, unopened liar, and verified-liar result data tested; browser highlight not covered. |
| 15 | New Game clears state and defers generation | Not verified | Resets after both outcomes and subsequent safe generation tested. |
| 16 | Rules and all status fields match state | Not verified | Summary tested through an action sequence; browser text, layout, and DOM updates not covered. |

## Code map

| File | Responsibility and key functions |
|---|---|
| `SPEC.md` | Author's intended rules, acceptance criteria, priorities, and optional extensions. |
| `index.html` | Board container, counters, controls, result message, and collapsible rules. Loads the module entry point. |
| `style.css` | Layout, clue colors, covered/flagged/revealed states, verified marker, and end-game liar highlight. |
| `js/board.js` | DOM-free cell model and mechanics: `createEmptyBoard`, `placeMinesAvoidingCell`, `computeTrueValues`, `chooseLiar`, `computeDisplayedValue`, `revealCell` (true-value flood fill), and `createBoardFromFixedLayout`. |
| `js/game.js` | Shared `gameState`; `newGame`; first-reveal generation, lives, and victory/defeat in `handleReveal`; flags in `handleFlag`; verification in `handleVerify`; private `finishGame` exposes mines/liar and records both clue values; `getStatusSummary` returns current status fields. |
| `js/ui.js` | `renderGame`, `renderBoard`, and `renderStatus` update the page; `attachEventHandlers` connects controls. Debug cell tooltips are built in `renderBoard`. |
| `js/main.js` | Parses debug URL parameters. `runAction` calls a state action and then renders; startup and all connected controls use it. |
| `js/board.test.js` | Random-generation, controlled-layout, clue, liar, flood-fill, flag, and repeat-mine-hit tests. |
| `js/game.test.js` | Controlled-board tests for lives, outcomes, action locks, reset, verification, preserved liar values, and status summaries. Some fixtures set reveal state directly to isolate the behavior under test. |
| `README.md` | Phase 2 handoff and verification limits. |

Cells retain separate `trueValue`, `displayedValue`, and `originalDisplayedValue` fields. Verification changes the displayed value but preserves liar identity and the original clue. Status summaries are derived from state rather than stored as another set of counters.

## Next steps in priority order

1. Validate criteria 1–9 in the browser first, following SPEC.md's highest priority. Check fixed debug URLs, the initial grid, left/right clicks, context-menu suppression, blank versus explicit-zero clues, and true-value expansion. Record author self-check results and fix any observed failures before marking criteria Done.
2. Validate criteria 10–15 next: verification controls/markers, five distinct hits, winning from the final safe reveal, locked end-game controls, both liar values, and New Game. Repeat the end-screen checks with an unopened liar and an already verified liar.
3. Validate criterion 16: read the collapsed rules, then compare every visible counter, mode, and status with state through the action sequence. The summary test does not validate the DOM.
4. Only after core acceptance, consider SPEC.md's optional extensions in order: difficulty selection, informational elapsed time, sound/mute, suspicious markers, then a guaranteed-solvable generator. None is implemented in the current code.

## Known bugs and shortcuts

No observed bugs were supplied in the handoff request; this is not a claim that the game is bug-free. No TODO comments were found in `index.html`, `style.css`, or `js/*.js`. Browser behavior remains **not verified** by the committed test suites.

The random board generator can produce boards that require guessing. No solver or guaranteed-solvable generator exists; SPEC.md explicitly treats that generator as an optional extension.

## Source of truth

`SPEC.md` is the source of truth for intended behavior. This README describes the current code, test coverage, and unconfirmed acceptance status.
