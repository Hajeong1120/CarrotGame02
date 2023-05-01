"use strict";
import PopUp from "./popup.js";
import { GameBuilder, Reason } from "./game.js";
import * as sound from "./sound.js";

const gameFinishBanner = new PopUp();

const game = new GameBuilder()
  .gameDuration(5) //
  .carrotCount(1) //
  .bugCount(1) //
  .trashCount(1)
  .build();

game.setGameStopListener((reason) => {
  let message;
  switch (reason) {
    case Reason.cancel:
      message = "Replay🤔";
      sound.playAlert();
      game.getGameStatus(Reason.cancel);
      break;
    case Reason.nextLevel:
      message = "Go to Next Level👌";
      game.getGameStatus(Reason.nextLevel);
      sound.playWin();
      break;
    case Reason.win:
      message = "YOU WON🎉";
      sound.playWin();
      game.getGameStatus(Reason.win);
      break;

    case Reason.lose:
      message = "YOU LOST😶‍🌫️";
      sound.playBug();
      game.getGameStatus(Reason.lose);
      break;
    default:
      throw new Error("not valid reason");
  }
  gameFinishBanner.showWithText(message);
});
gameFinishBanner.setClickListener(() => {
  game.start();
});
