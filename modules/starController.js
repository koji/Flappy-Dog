import { star } from "./elements.js";
import { getRandomNumber } from "../utils/util.js";

export const showStar = () => {
  if (star.style.display !== "none") return;

  star.style.display = "";
  star.style.top = `${getRandomNumber(20, 70)}%`;
};

export const hideStar = () => {
  star.style.display = "none";
};
