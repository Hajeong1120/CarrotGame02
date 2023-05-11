"use strict";
import PopUp from "./popup.js";
import { GameBuilder, Reason } from "./game.js";
import * as sound from "./sound.js";

const gameFinishBanner = new PopUp();

const GAME_DURATION = 5;
const CARROT_COUNT = 2;
const BUG_COUNT = 1;
const TRASH_COUNT = 1;

const game = new GameBuilder()
  .gameDuration(GAME_DURATION) //
  .carrotCount(CARROT_COUNT) //
  .bugCount(BUG_COUNT) //
  .trashCount(TRASH_COUNT)
  .build();

game.setGameStopListener((reason) => {
  let message;

  switch (reason) {
    case Reason.cancel:
      message = "Replay🤔";
      sound.playAlert();
      game.setGameStatus(Reason.cancel);
      game.setInitItemCount(
        GAME_DURATION,
        CARROT_COUNT,
        BUG_COUNT,
        TRASH_COUNT
      );
      break;
    case Reason.next:
      message = "Go to Next Level👌";
      game.setGameStatus(Reason.next);
      sound.playWin();
      break;
    case Reason.win:
      message = "YOU WON🎉";
      sound.playWin();
      game.setGameStatus(Reason.win);
      game.setInitItemCount(
        GAME_DURATION,
        CARROT_COUNT,
        BUG_COUNT,
        TRASH_COUNT
      );
      break;

    case Reason.lose:
      message = "YOU LOST😶‍🌫️";
      sound.playBug();
      game.setGameStatus(Reason.lose);
      game.setInitItemCount(
        GAME_DURATION,
        CARROT_COUNT,
        BUG_COUNT,
        TRASH_COUNT
      );
      break;
    default:
      throw new Error("not valid reason");
  }
  gameFinishBanner.showWithText(message);
});

gameFinishBanner.setClickListener(() => {
  game.start();
});
