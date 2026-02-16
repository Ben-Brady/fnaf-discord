import type { GameplayState } from "../state";
import { createStateRandom } from "./random";
import { createInterval } from "./timers";

export const applyGoldenFreddyChance = (state: GameplayState, dt: number) => {
  const interval = createInterval(state, "golden_freddy_appeared", 1);
  const random = createStateRandom(state);

  if (interval.didPass(dt)) {
    if (random.chance(32_768)) {
      state.golden_freddy_appeared = true;
    }
  }
};
