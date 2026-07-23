export const CH7_HEIGHT_VH = 200;

export const title = { start: 0.05, end: 0.2 };
export const stats = { start: 0.2, end: 0.45 };
export const projectCard = (i: number) => {
  const start = 0.45 + i * 0.12;
  return { start, end: start + 0.15 };
};
