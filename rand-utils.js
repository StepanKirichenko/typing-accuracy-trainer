export function randNumber(n) {
  return Math.floor(Math.random() * n);
}

export function shuffle(array) {
  const res = [...array];
  const len = res.length;
  for (let i = 0; i < len; i++) {
    const rand = Math.floor(Math.random() * len);
    [res[i], res[rand]] = [res[rand], res[i]];
  }
  return res;
}

export function getRandomElements(array, count) {
  const res = [];
  const len = array.length;
  for (let i = 0; i < count; i++) {
    const rand = Math.floor(Math.random() * len);
    res.push(array[rand]);
  }
  return res;
}

