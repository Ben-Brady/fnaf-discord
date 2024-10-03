import { random, sample } from "lodash";
import type { GameplayState } from "../state";

export const stateRandom = (state: GameplayState) => Math.random();
export const randomChoice = <T>(state: GameplayState, options: T[]) => sample(options)!;

export const movementOpportunity = (state: GameplayState, difficulty: number) => {
  return stateRandom(state) * 20 <= difficulty;
};
