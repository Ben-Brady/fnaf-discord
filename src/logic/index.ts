import type { GameplayInput, GameState } from "./state";
import { poweroutTick } from "./powerout";
import { gameTick } from "./game";
import { assertNever } from "../utils";
export { createGame } from "./game";
export { MAX_POWER, NIGHT_DURATION, TICKS_PER_SECOND } from "./constants";

export const tick = (state: GameState, input: GameplayInput): GameState => {
  if (state.type === "gameplay") return gameTick(state, input);
  if (state.type === "powerout") return poweroutTick(state);
  if (state.type === "jumpscare") return state;
  if (state.type === "victory") return state;

  return assertNever(state);
};
export * from "./state";
