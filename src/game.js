import { Field, ItemType } from "./field.js";
import * as sound from "./sound.js";

const MAX_LEVEL = 5;
const INIT_LEVEL = 1;

export const Reason = Object.freeze({
  next: "next",
  win: "win",
  lose: "lose",
  cancel: "cancel",
});

//Builder Pattern
export class GameBuilder {
  gameDuration(duration) {
    this.gameDuration = duration;
    this.INIT_DURATION = duration;
    return this;
  }

  carrotCount(carrot) {
    this.carrotCount = carrot;
    this.Init_Carrot = carrot;
    return this;
  }

  bugCount(bug) {
    this.bugCount = bug;
    this.Init_Bug = bug;
    return this;
  }

  trashCount(trash) {
    this.trashCount = trash;
    return this;
  }

  build() {
    return new Game(
      this.gameDuration, //
      this.carrotCount, //
      this.bugCount, //
      this.trashCount
    );
  }
}

class Game {
  constructor(gameDuration, carrotCount, bugCount, trashCount) {
    this.gameDuration = gameDuration;
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;
    this.trashCount = trashCount;
    this.timerIndicator = document.querySelector(".game__timer");
    this.gameScore = document.querySelector(".game__score");
    this.gameLevel = document.querySelector(".game__level");
    this.gameBtn = document.querySelector(".game__button");
    this.gameBtn.addEventListener("click", () => {
      if (this.started) {
        this.stop(Reason.cancel);
      } else {
        this.start();
      }
    });
    this.gameField = new Field(carrotCount, bugCount, trashCount);
    this.gameField.setClickListener(this.onItemClick);
    this.started = false;
    this.score = 0;
    this.timer = undefined;
    this.status = { start: "start" };
  }

  setGameStatus(status) {
    this.status = status;
  }

  setGameStopListener(onGameStop) {
    this.onGameStop = onGameStop;
  }

  start() {
    this.started = true;
    this.initGame();
    this.showStopButton();
    this.showTimerAndScoreAndLevel();
    this.startGameTimer();
    sound.playBackground();
  }

  stop(reason) {
    this.started = false;
    this.stopGameTimer();
    this.hideGameButton();
    sound.stopBackground();
    this.onGameStop && this.onGameStop(reason);
  }

  onItemClick = (item) => {
    if (!this.started) {
      return;
    }
    if (item === ItemType.carrot) {
      this.score++;
      this.updateScoreBoard();
      if (this.score === this.carrotCount && this.level === MAX_LEVEL) {
        this.stop(Reason.win);
        this.initGame(); //🙌🙌🙌 승리하면 승리 스토리로 넘어가도록 만들기
        console.log(this.level + "끝끝");
      } else if (this.score === this.carrotCount && this.level < MAX_LEVEL) {
        this.stop(Reason.next);
        this.level++;
        this.nextLevel(this.level);
        this.gameField.setItemsCount(
          this.carrotCount,
          this.bugCount,
          this.trashCount
        );
        console.log(this.level);
      }
    } else if (item === ItemType.bug) {
      this.stop(Reason.lose);
    }
  };

  showStopButton() {
    const icon = this.gameBtn.querySelector(".fas");
    icon.classList.add("fa-stop");
    icon.classList.remove("fa-play");
    this.gameBtn.style.visibility = "visible";
  }

  hideGameButton() {
    this.gameBtn.style.visibility = "hidden";
  }

  showTimerAndScoreAndLevel() {
    this.timerIndicator.style.visibility = "visible";
    this.gameScore.style.visibility = "visible";
    this.gameLevel.style.visibility = "visible";
  }

  startGameTimer() {
    let remainingTimeSec = this.gameDuration;
    this.updateTimerText(remainingTimeSec);
    this.timer = setInterval(() => {
      if (remainingTimeSec <= 0) {
        clearInterval(this.timer);
        this.stop(this.score === this.carrotCount ? Reason.win : Reason.lose);
        return;
      }
      this.updateTimerText(--remainingTimeSec);
    }, 1000);
  }

  stopGameTimer() {
    clearInterval(this.timer);
  }

  updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    this.timerIndicator.innerText = `${minutes}:${seconds}`;
  }

  initGame() {
    this.score = 0;
    //게임 시작 시 레벨 초기화 여부
    console.log(this.status);
    if (this.status === Reason.next) {
      this.level;
    } else {
      this.setInitItemCount(
        this.gameDuration,
        this.carrotCount,
        this.bugCount,
        this.trashCount
      ); //🙌🙌🙌
    }
    this.score = 0;
    this.updateScoreBoard();
    this.gameLevel.innerText = "LV." + this.level;
    this.gameScore.innerText = this.carrotCount;
    this.gameField.init();
  }

  //모든 수치 초기화
  setInitItemCount(gameDuration, carrotCount, bugCount, trashCount) {
    this.level = INIT_LEVEL;
    this.gameDuration = gameDuration;
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;
    this.trashCount = trashCount;
    this.gameField.setItemsCount(
      this.carrotCount,
      this.bugCount,
      this.trashCount
    );
  }

  updateScoreBoard() {
    this.gameScore.innerText = this.carrotCount - this.score;
  }

  // Level Scailing
  nextLevel(level) {
    switch (level) {
      case 1:
        this.carrotCount = this.level;
        this.bugCount = this.level;
        this.trashCount = this.level;
        break;
      case 2:
        this.gameDuration += 2;
        this.carrotCount = 4;
        this.bugCount = 3;
        this.trashCount = 3;
        break;
      case 3:
        this.gameDuration += 3;
        this.carrotCount = 5;
        this.bugCount = 4;
        this.trashCount = 4;
        break;
      case 4:
        this.gameDuration += 4;
        this.carrotCount = 6;
        this.bugCount = 5;
        this.trashCount = 5;
        break;
      case 5:
        this.gameDuration += 5;
        this.carrotCount = 6;
        this.bugCount = 6;
        this.trashCount = 6;
        break;
      default:
        throw new Error("not valid level");
    }
  }
}
