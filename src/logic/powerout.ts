import { cloneDeep, random, sample } from "lodash";
import { NIGHT_DURATION, TICKS_PER_SECOND } from "./constants";
import type { JumpscareState, PoweroutState, VictoryState } from "./state";

export const poweroutTick = (
  state: PoweroutState,
): PoweroutState | JumpscareState | VictoryState => {
  state = cloneDeep(state);
  state.time += 1;
  state.ticks_since_started += 1;

  if (state.time > NIGHT_DURATION) return { type: "victory" };

  if (state.remaining_minimum_ticks > 0) {
    state.remaining_minimum_ticks -= 1;
    return state;
  }

  if (state.progress === "blackout") {
    if (random(0, 100) !== 1) return state;
    state.progress = sample(["freddy", "lights_off"]);
    state.remaining_minimum_ticks = TICKS_PER_SECOND * 5;
    return state;
  }

  if (state.progress === "freddy") {
    if (random(0, 100) !== 1) return state;
    state.progress = "lights_off";
    state.remaining_minimum_ticks = TICKS_PER_SECOND * 5;
    return state;
  }

  if (state.progress === "lights_off") {
    if (random(0, 100) !== 1) return state;
    return { type: "jumpscare", jumpscare: "freddy-powerout" };
  }

  return state;
};
