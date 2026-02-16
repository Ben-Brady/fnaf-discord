import { NIGHT_DURATION, TICKS_PER_SECOND } from "./constants";
import type { GameplayState, JumpscareState, PoweroutState, VictoryState } from "./state";
import { JumpscareError } from "./game";
import { createStateRandom } from "./game/utils";
import { jumpToJumpscare, jumpToVictory } from "./jumps";

const FREDDY_WAIT = 5;
const POWEROUT_WAIT = 5;

export const createPoweroutState = (state: GameplayState): PoweroutState => {
  return {
    type: "powerout",
    progress: "blackout",
    seed: state.seed,
    remaining_minimum: 0,
    ticks_since_started: 0,
    time: state.time,
  };
};

export const runPoweroutTick = (state: PoweroutState, dt: number) => {
  const { randomBetween, choose } = createStateRandom(state);
  state.time += dt;
  if (state.time > NIGHT_DURATION) jumpToVictory();

  state.ticks_since_started += dt;

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
