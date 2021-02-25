import { character, score, gameoverScreen } from "./elements.js";

export const handleCharacterAnimation = (direction) => {
  if (direction === "down") {
    character.classList.remove("go-up");
    character.classList.add("go-down");
  } else if (direction === "up") {
    character.classList.add("go-up");
    character.classList.remove("go-down");
  }
};
