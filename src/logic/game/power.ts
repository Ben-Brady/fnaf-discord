import type { GameplayState } from "../state";

export const applyPowerUsage = (state: GameplayState, dt: number) => {
  // TODO: Only apply at second's end

  let usage = 0;
  if (state.left_door) usage += 1;
  if (state.right_door) usage += 1;
  if (state.left_light) usage += 1;
  if (state.right_light) usage += 1;
  if (state.view === "camera") usage += 1;

  state.power -= dt;
};
