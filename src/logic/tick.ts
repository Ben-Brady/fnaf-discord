import type { GameplayInput, GameState } from "./state";
import { runPoweroutTick } from "./powerout";
import { runGameTick } from "./game";
import { ChangeStateError } from "./jumps";

export const runTick = (state: GameState, input: GameplayInput, dt: number): GameState => {
  state = structuredClone(state);

  try {
    if (state.type === "gameplay") {
      runGameTick(state, input, dt);
    }
    if (state.type === "powerout") {
      runPoweroutTick(state, dt);
    }
  } catch (e) {
    if (!(e instanceof ChangeStateError)) throw e;
    return e.state;
  }

  return state;
};
