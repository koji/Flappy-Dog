import {
  getRandomNumber,
  getCssProp,
  detectCollision,
  roundNum,
} from "./utils/util.js";

let game,
  block,
  hole,
  character,
  score,
  gameoverScreen,
  star,
  gameStopped,
  isJumping,
  scoreTotal,
  gameSpeed,
  gravityStopped;

const getElements = () => {
  game = document.querySelector("#game");
  block = document.querySelector("#block");
  hole = document.querySelector("#hole");
  character = document.querySelector("#character");
  score = document.querySelector("#score");
  gameoverScreen = document.querySelector("#gameoverscreen");
  star = document.querySelector("#star");
};

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
      const jumpSound = new Audio("./sounds/fly.wav");
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
    const getStarSound = new Audio("./sounds/star.wav");
    getStarSound.volume = 0.2;
    getStarSound.play();
    scoreTotal += 150;
    hideStar();
    changeScoreUi();
  }
};

const handleGameSpeed = () => {
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

const handleCharacterAnimation = (direction) => {
  if (direction === "down") {
    character.classList.remove("go-up");
    character.classList.add("go-down");
  } else if (direction === "up") {
    character.classList.add("go-up");
    character.classList.remove("go-down");
  }
};

let numOfHoles = 0;
let soundCount = 0;

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
      const holeSound = new Audio("./sounds/hole.wav");
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
  const gameOverSound = new Audio("./sounds/gameover.wav");
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

const gameSpeedConfig = {
  slow: 150,
  normal: 250,
  fast: 350,
  superfast: 450,
  ridiculoust: 550,
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

const initRandomHoles = () => {
  hole.addEventListener("animationiteration", (_) => {
    const fromHeight = (60 * window.innerHeight) / 100;
    const toHeight = (95 * window.innerHeight) / 100;
    const randomTop = getRandomNumber(fromHeight, toHeight);
    // console.log(randomTop);
    hole.style.top = `-${randomTop}px`;
  });
};

const resetAllAnimations = () => {
  // const seconds = 2;
  const seconds = roundNum(window.innerWidth / gameSpeedConfig[gameSpeed]);
  const blockAnimationCss = `blockAnimation ${seconds}s infinite linear`;
  block.style.animation = blockAnimationCss;
  hole.style.animation = blockAnimationCss;

  if (star.style.display !== "none") return;

  const num = getRandomNumber(1, 5);
  const starAnimationCss = `starAnimation${num} ${seconds}s infinite linear`;
  star.style.animation = starAnimationCss;
};

const stopBlockAnimation = () => {
  const blockLeft = block.getBoundingClientRect().x;
  block.style.animation = "";
  hole.style.animation = "";
  block.style.left = `${blockLeft}px`;
  hole.style.left = `${blockLeft}px`;
};

const startBgAnimation = () => {
  game.style.animation = "backgroundAnimation 5s infinite linear";
};

const stopBgAnimation = () => {
  game.style.animation = "";
};

const showGameoverscreen = () => {
  gameoverScreen.style.display = "";
};

const hideGameoverscreen = () => {
  gameoverScreen.style.display = "none";
};

const showStar = () => {
  if (star.style.display !== "none") return;

  star.style.display = "";
  star.style.top = `${getRandomNumber(20, 70)}%`;
};

const hideStar = () => {
  star.style.display = "none";
};

const resetCharacterPosition = () => {
  character.style.top = `30vh`;
  character.style.left = `25vw`;
};

const gameInit = () => {
  getElements();
  setInitialValues();
  beginGravity();
  initRandomHoles();
  setEventListeners();
  resetAllAnimations();
  startBgAnimation();
};

gameInit();
