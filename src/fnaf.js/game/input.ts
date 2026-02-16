import type { GameplayInput, GameplayState } from "../state";
import { createStateRandom } from "./random";

export const applyUserInput = (state: GameplayState, input: GameplayInput) => {
  const { randomBetween: randint } = createStateRandom(state);
  if (!input) return;

  const inCamera = state.view === "camera";
  const inOffice = state.view === "office";

  if (inOffice && input.type === "open-camera") {
    state.view = "camera";
    state.left_light = false;
    state.right_light = false;
    state.camera_rng = randint(0, 1000);
  }

  if (inCamera && input.type === "close-camera") {
    state.view = "office";
  }

  if (inCamera && input.type === "swap-camera") {
    state.camera = input.camera;
  }

  if (inOffice && input.type === "left-door") {
    state.left_door = !state.left_door;
  }
  if (inOffice && input.type === "right-door") {
    state.right_door = !state.right_door;
  }

  if (inOffice && input.type === "left-light") {
    state.right_light = false;
    state.left_light = !state.left_light;
  }
  if (inOffice && input.type === "right-light") {
    state.left_light = false;
    state.right_light = !state.right_light;
  }
};
