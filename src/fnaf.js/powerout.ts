import type { GameplayState } from "./state";
import { createStateRandom } from "./game/random";
import { jumpToJumpscare, jumpToVictory } from "./jumps";
import { createInterval } from "./game/timers";
import { NIGHT_DURATION } from "./time";

export type PoweroutState = {
  type: "powerout";
  timers: Record<string, number>;
  seed: number;
  time: number;
  stage: "lights_off" | "freddy" | "blackout";
};

export const createPoweroutState = (state: GameplayState): PoweroutState => {
  return {
    type: "powerout",
    seed: state.seed,
    time: state.time,
    timers: {},

    stage: "blackout",
  };
};

export const runPoweroutTick = (state: PoweroutState, dt: number) => {
  const { randomBetween } = createStateRandom(state);

  state.time += dt;
  if (state.time > NIGHT_DURATION) jumpToVictory();

  if (state.stage === "blackout") {
    const interval = createInterval(state, "powerout:blackout-interval", 5);
    const timeout = createInterval(state, "powerout:blackout-timeout", 20);
    if (timeout.didPass(dt)) {
      state.stage = "freddy";
    }

    if (interval.didPass(dt)) {
      if (randomBetween(0, 5) < 1) {
        state.stage = "freddy";
      }
    }
  }

  if (state.stage === "freddy") {
    const interval = createInterval(state, "powerout:freddy-interval", 5);
    const timeout = createInterval(state, "powerout:freddy-timeout", 20);
    if (timeout.didPass(dt)) {
      state.stage = "lights_off";
    }

    if (interval.didPass(dt)) {
      if (randomBetween(0, 5) < 1) {
        state.stage = "lights_off";
      }
    }
  }

  if (state.stage === "lights_off") {
    const interval = createInterval(state, "powerout:jumpscare", 2);
    if (interval.didPass(dt) && randomBetween(0, 5) < 1) {
      jumpToJumpscare("freddy-powerout");
    }
  }
};
