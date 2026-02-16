import type { GameplayState } from "../state";
import { createInterval } from "./timers";

export const applyPowerUsage = (state: GameplayState, dt: number) => {
  applyActiveUsage(state, dt);
  applyPassiveDrain(state, dt);
};

const applyActiveUsage = (state: GameplayState, dt: number) => {
  let bars = 0;
  if (state.left_door) bars += 1;
  if (state.right_door) bars += 1;
  if (state.left_light) bars += 1;
  if (state.right_light) bars += 1;
  if (state.view === "camera") bars += 1;

  const interval = createInterval(state, "power:apply", 1);
  if (interval.didPass(dt)) {
    state.power -= bars * 0.1;
  }
};

const applyPassiveDrain = (state: GameplayState, dt: number) => {
  const { night } = state;

  let drainInterval = null;
  if (night === 2) drainInterval = 6;
  if (night === 3) drainInterval = 5;
  if (night === 4) drainInterval = 4;
  if (night === 5) drainInterval = 3;
  if (night === 6) drainInterval = 3;
  if (night === 7) drainInterval = 3;

  if (!drainInterval) return;

  const interval = createInterval(state, "power:passive-drain", drainInterval);
  if (interval.didPass(dt)) {
    state.power -= 0.1;
  }
};
