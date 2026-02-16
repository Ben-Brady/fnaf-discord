import type { GameplayState } from "../state";

export const createInterval = (
  state: { timers: Record<string, number> },
  id: string,
  duration: number
) => {
  if (!(id in state.timers)) {
    state.timers[id] = duration;
  }

  const didPass = (dt: number) => {
    state.timers[id] -= dt;
    const didPass = state.timers[id] < 0;
    if (didPass) state.timers[id] += duration;
    return didPass;
  };

  return { didPass };
};

export const createTimeout = (
  state: { timers: Record<string, number> },
  id: string,
  duration: number
) => {
  if (!(id in state.timers)) {
    state.timers[id] = duration;
  }

  const reset = () => {
    state.timers[id] = duration;
  };

  const didPass = (dt: number) => {
    state.timers[id] -= dt;
    return state.timers[id] < 0;
  };

  return { reset, didPass };
};
