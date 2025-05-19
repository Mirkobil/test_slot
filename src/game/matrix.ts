import { IPoint } from '../interface/IPoint';

const gameTypes: number[] = [0, 1, 2, 2, 1, 2, 1, 2, 1, 0, 1, 2];
export function randomType(): number {
  return gameTypes[Math.floor(Math.random() * gameTypes.length)];
}

// const stripes: number[][] = [
//     [0,2,1,2,1,1,2,0,0,2,2,1,0],
//     [1,2,1,0,2,2,0,2,1,0,1,1,0],
//     [2,0,1,2,1,0,2,0,0,1,0,1,0],
// ];

const stripes: number[][] = [
  [0, 0, 0, 1, 1, 1, 2, 2, 2, 1, 2, 0, 1],
  [0, 0, 0, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1],
  [0, 0, 0, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1],
];

function rng(reel: number[][]): number[] {
  return reel.map((reel) => Math.floor(Math.random() * reel.length));
}

export function matrix(
  grid: { x: number; y: number },
  random: number[] | undefined = undefined
): number[][] {
  return matrixGenerate(grid, stripes, random);
}

function matrixGenerate(
  grid: IPoint,
  reel: number[][],
  random: number[] | undefined = undefined
): number[][] {
  const r = random ?? rng(reel);
  console.log(r);
  return r.map((v, i) => {
    const length = reel[i].length;
    return Array.from({ length: grid.y }, (_, a) => reel[i][(v + a) % length]);
  });
}
