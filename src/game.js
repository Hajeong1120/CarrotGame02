import { Field, ItemType } from "./field.js";
import * as sound from "./sound.js";

const MaxLevel = 5;

export const Reason = Object.freeze({
  nextLevel: "nextLevel",
  win: "win",
  lose: "lose",
  cancel: "cancel",
});

//Builder Pattern
export class GameBuilder {
  gameDuration(duration) {
    this.gameDuration = duration;
    return this;
  }

  carrotCount(num) {
    this.carrotCount = num;
    return this;
  }

  bugCount(num) {
    this.bugCount = num;
    return this;
  }

  trashCount(num) {
    this.trashCount = num;
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

    //레벨
    this.level = 1;
  }

  //게임 승리 여부 받아오기
  getGameStatus(status) {
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
      this.updateLevel();
      if (this.score === this.carrotCount && this.level === MaxLevel) {
        this.stop(Reason.win);
        console.log(this.level + "끝끝");
      } else if (this.score === this.carrotCount && this.level < MaxLevel) {
        this.stop(Reason.nextLevel);
        console.log(this.level);
      }
    } else if (item === ItemType.bug) {
      this.stop(Reason.lose);
    }
  };

  updateLevel() {
    this.level++;
  }

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
    this.gameScore.innerText = this.carrotCount;
    this.gameField.init();

    //게임 시작 시 레벨 초기화 여부
    console.log(this.status);
    if (this.status === Reason.nextLevel) {
      this.level;
    } else {
      this.level = 1;
    }
    this.gameLevel.innerText = "LV." + this.level;
  }

  updateScoreBoard() {
    this.gameScore.innerText = this.carrotCount - this.score;
  }
}
