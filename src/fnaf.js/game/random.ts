import type { GameplayState } from "../state";

export const createStateRandom = (state: { seed: number }) => {
  const M = 2 ** 35 - 31;
  const A = 185852;
  state.seed = state.seed % M;

  const random = () => {
    state.seed = (state.seed * A) % M;
    return state.seed / M;
  };

  const randomBetween = (min: number, max: number) => {
    const range = max - min;
    return min + random() * range;
  };

  const choose = <T extends any>(...options: T[]): T => {
    const index = Math.floor(random() * options.length);
    return options[index];
  };

  const movementOpportunity = (difficulty: number) => {
    return random() * 20 <= difficulty;
  };

  return { random, randomBetween, choose, movementOpportunity };
};
