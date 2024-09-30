import { random, sample } from "lodash";
import type { GameplayState } from "../state";

export const stateRandom = (state: GameplayState) => random();
export const randomChoice = <T>(state: GameplayState, options: T[]) => sample(options)!;

export const movementOpportunity = (state: GameplayState, difficulty: number) => {
    return difficulty > stateRandom(state) * 20;
};
