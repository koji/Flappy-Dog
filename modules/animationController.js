import { game, block, hole } from "./elements.js";

export const stopBlockAnimation = () => {
  const blockLeft = block.getBoundingClientRect().x;
  block.style.animation = "";
  hole.style.animation = "";
  block.style.left = `${blockLeft}px`;
  hole.style.left = `${blockLeft}px`;
};

export const startBgAnimation = () => {
  game.style.animation = "backgroundAnimation 5s infinite linear";
};

export const stopBgAnimation = () => {
  game.style.animation = "";
};
