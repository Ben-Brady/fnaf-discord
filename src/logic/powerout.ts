import { NIGHT_DURATION } from "./constants";
import type { GameplayState, PoweroutState } from "./state";
import { createStateRandom } from "./game/random";
import { jumpToJumpscare, jumpToVictory } from "./jumps";

const FREDDY_WAIT = 5;
const POWEROUT_WAIT = 5;

export const createPoweroutState = (state: GameplayState): PoweroutState => {
  return {
    type: "powerout",
    progress: "blackout",
    seed: state.seed,
    remaining_minimum: 0,
    time: state.time,
  };
};

export const runPoweroutTick = (state: PoweroutState, dt: number) => {
  const { randint: randomBetween, choose } = createStateRandom(state);
  state.time += dt;
  if (state.time > NIGHT_DURATION) jumpToVictory();

  if (state.remaining_minimum > 0) {
    state.remaining_minimum -= dt;
    return;
  }

  if (state.progress === "blackout") {
    if (randomBetween(0, 100) < 1) return;
    state.progress = choose("freddy", "lights_off");
    state.remaining_minimum = FREDDY_WAIT;
  }

  if (state.progress === "freddy") {
    if (randomBetween(0, 100) < 1) return;
    state.progress = "lights_off";
    state.remaining_minimum = POWEROUT_WAIT;
  }

  if (state.progress === "lights_off") {
    if (randomBetween(0, 100) < 1) return;
    jumpToJumpscare("freddy-powerout");
  }
};
