import './board.js';
import {
  gameState,
  newGame,
  handleReveal,
  handleFlag,
  handleVerify,
} from './game.js';
import { attachEventHandlers, renderGame } from './ui.js';

// TODO: Configure optional ?debug=1 and fixed-layout input before initialization
// so later rule checks can reproduce a board without exposing it in normal play.
newGame();
renderGame(gameState);
attachEventHandlers({
  onReveal: handleReveal,
  onFlag: handleFlag,
  onVerify: handleVerify,
  onNewGame: newGame,
});
