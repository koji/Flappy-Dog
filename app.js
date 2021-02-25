import {
  getRandomNumber,
  getCssProp,
  detectCollision,
  roundNum,
} from "./utils/util.js";

import {
  game,
  block,
  hole,
  character,
  score,
  gameoverScreen,
  star,
  initRandomHoles,
} from "./modules/elements.js";

import {
  jumpSound,
  getStarSound,
  holeSound,
  gameOverSound,
} from "./modules/sound.js";

import {
  showGameoverscreen,
  hideGameoverscreen,
} from "./modules/gameScreenController.js";

import { showStar, hideStar } from "./modules/starController.js";
import { gameSpeedConfig } from "./modules/config.js";
import {
  stopBlockAnimation,
  startBgAnimation,
  stopBgAnimation,
} from "./modules/animationController.js";

import { handleCharacterAnimation } from "./modules/actionHandler.js";

let gameStopped, isJumping, scoreTotal, gameSpeed, gravityStopped;
let numOfHoles = 0;
let soundCount = 0;

const setInitialValues = () => {
  gameStopped = false;
  isJumping = false;
  scoreTotal = 0;
  gameSpeed = "slow";
  gravityStopped = false;
};

const setEventListeners = () => {
  window.addEventListener("resize", (_) => {
    if (gameStopped) return;
    resetAllAnimations();
  });
  gameoverScreen.querySelector("button").addEventListener("click", (_) => {
    gameSpeed = "slow";
    hideGameoverscreen();
    startGravity();
    resetAllAnimations();
    resetCharacterPosition();
    resetScore();
    changeScoreUi();
    startBgAnimation();
    setTimeout((_) => {
      gameStopped = false;
    });
  });

  document.body.parentElement.addEventListener("click", (_) => {
    if (gameStopped) return;
    characterJump();
  });
  document.onkeypress = (e) => {
    e = e || window.event;

    if (e.keyCode === 32) {
      if (gameStopped) return;
      characterJump();
    }
  };
};

const characterJump = () => {
  isJumping = true;
  let jumpCount = 0;
  const jumpInterval = setInterval((_) => {
    changeGameState({ diff: -3, direction: "up" });

    if (jumpCount > 20) {
      jumpSound.volume = 0.2;
      jumpSound.play();
      clearInterval(jumpInterval);
      isJumping = false;
      jumpCount = 0;
    }
    jumpCount++;
  }, 10);
};

const changeGameState = ({ diff, direction }) => {
  handleStarDetection();
  handleGameSpeed();
  handleCharacterAnimation(direction);
  handleCharacterCollisions();
  handleCharacterPosition(diff);
};

const handleStarDetection = () => {
  if (star.style.display === "none") return;
  if (detectCollision(character, star)) {
    getStarSound.volume = 0.2;
    getStarSound.play();
    scoreTotal += 10;
    hideStar();
    changeScoreUi();
  }
};

const handleGameSpeed = (score) => {
  let doReset = false;
  if (scoreTotal > 5000) {
    gameSpeed = "ridiculous";
    doReset = true;
  } else if (scoreTotal > 2000) {
    gameSpeed = "superfast";
    doReset = true;
  } else if (scoreTotal > 750) {
    gameSpeed = "fast";
    doReset = true;
  } else if (scoreTotal > 250) {
    gameSpeed = "normal";
    doReset = true;
  }

  if (doReset) {
    const timeoutLength = gameSpeedConfig[gameSpeed];
    setTimeout((_) => {
      if (gameStopped) return;
      resetAllAnimations();
    }, timeoutLength);
  }
};

const handleCharacterCollisions = () => {
  const collisionBlock = detectCollision(character, block);
  const collisionHole = detectCollision(character, hole, { y1: -46, y2: 47 });

  if (collisionBlock && !collisionHole) {
    changeScoreUi();
    return gameOver();
  } else if (collisionHole) {
    scoreTotal++;
    soundCount++;
    if (soundCount > 35) {
      holeSound.volume = 0.2;
      holeSound.play();
      soundCount = 0;
    }

    changeScoreUi();

    if (gameStopped) return;

    numOfHoles++;
    if (numOfHoles > 150) {
      numOfHoles = 0;

      // start handling
      showStar();
      setTimeout((_) => hideStar(), 1500);
    }
  }
};

const handleCharacterPosition = (diff) => {
  const characterTop = parseInt(getCssProp(character, "top"));
  const changeTop = characterTop + diff;

  if (changeTop < 0) {
    return;
  }
  if (changeTop > window.innerHeight) {
    return gameOver();
  }
  character.style.top = `${changeTop}px`;
};

const gameOver = () => {
  gameOverSound.volume = 0.2;
  gameOverSound.play();
  // console.log("game over");
  gameStopped = true;
  showGameoverscreen();
  stopBlockAnimation();
  stopGravity();
  hideStar();
  stopBgAnimation();
};

const resetScore = () => {
  scoreTotal = 0;
};

const changeScoreUi = () => {
  score.innerText = `Score ${scoreTotal.toString()}`;
  gameoverScreen.querySelector(".score").innerText = score.innerText;
};

const beginGravity = () => {
  setInterval((_) => {
    if (isJumping || gameStopped) return;
    changeGameState({ diff: 5, direction: "down" });
  }, 20);
};

const startGravity = () => {
  gravityStopped = false;
};

const stopGravity = () => {
  gravityStopped = true;
};

const resetAllAnimations = () => {
  const seconds = roundNum(window.innerWidth / gameSpeedConfig[gameSpeed]);
  const blockAnimationCss = `blockAnimation ${seconds}s infinite linear`;
  block.style.animation = blockAnimationCss;
  hole.style.animation = blockAnimationCss;

  if (star.style.display !== "none") return;

  const num = getRandomNumber(1, 5);
  const starAnimationCss = `starAnimation${num} ${seconds}s infinite linear`;
  star.style.animation = starAnimationCss;
};

const resetCharacterPosition = () => {
  character.style.top = `30vh`;
  character.style.left = `25vw`;
};

const gameInit = () => {
  setInitialValues();
  beginGravity();
  initRandomHoles();
  setEventListeners();
  resetAllAnimations();
  startBgAnimation();
};

gameInit();
