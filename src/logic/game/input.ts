import type { GameplayInput, GameplayState } from "../state";

export const applyUserInput = (state: GameplayState, input: GameplayInput) => {
  if (!input) return;

  const inCamera = state.view === "camera";
  const inOffice = state.view === "office";

  if (input.type === "open-camera" && state.view === "office") {
    state.view = "camera";
    state.left_light = false;
    state.right_light = false;
  }
  if (input.type === "close-camera" && state.view === "camera") {
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
