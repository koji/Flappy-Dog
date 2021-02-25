import { getRandomNumber } from "../utils/util.js";

// elements
export const game = document.querySelector("#game");
export const block = document.querySelector("#block");
export const hole = document.querySelector("#hole");
export const character = document.querySelector("#character");
export const score = document.querySelector("#score");
export const gameoverScreen = document.querySelector("#gameoverscreen");
export const star = document.querySelector("#star");

export const initRandomHoles = () => {
  hole.addEventListener("animationiteration", (_) => {
    const fromHeight = (60 * window.innerHeight) / 100;
    const toHeight = (95 * window.innerHeight) / 100;
    const randomTop = getRandomNumber(fromHeight, toHeight);
    // console.log(randomTop);
    hole.style.top = `-${randomTop}px`;
  });
};
