export const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const getCssProp = (elem, cssProp) => {
  return window.getComputedStyle(elem).getPropertyValue(cssProp);
};

export const detectCollision = (elm1, elm2, extra) => {
  const rect1 = elm1.getBoundingClientRect();
  const rect2 = elm2.getBoundingClientRect();

  extra = extra || {
    y1: 0,
    y2: 0,
  };

  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height + extra.y1 &&
    rect1.y + rect1.height > rect2.y + extra.y2
  );
};

export const roundNum = (num, decimals = 2) => {
  return Math.round((num + Number.EPSILON) * 10 ** decimals) / 10 ** decimals;
};
