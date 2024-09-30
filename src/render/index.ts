import type { Image } from "./files";
import type { GameplayState, GameState } from "../logic/state";
import {
  camera_1a,
  camera_1b,
  camera_1c,
  camera_2a,
  camera_2b,
  camera_3,
  camera_4a,
  camera_4b,
  camera_5,
  camera_6,
  camera_7,
} from "./cameras";
import { renderOffice } from "./office";
import { assertNever } from "../utils";
export { getImage } from "./files";

export const render = (state: GameState): Image => {
  if (state.type === "jumpscare") {
    if (state.jumpscare === "bonnie") return "jumpscare-bonnie";
    if (state.jumpscare === "chica") return "jumpscare-chica";
    if (state.jumpscare === "foxy") return "jumpscare-foxy";
    if (state.jumpscare === "freddy-office") return "jumpscare-freddy-office";
    if (state.jumpscare === "freddy-powerout") return "jumpscare-freddy-powerout";
    return assertNever(state.jumpscare);
  }

  if (state.type === "victory") return "victory";
  if (state.type === "powerout") {
    if (state.progress === "blackout") return "powerout";
    if (state.progress === "freddy") return "powerout-freddy";
    if (state.progress === "lights_off") return "powerout-freddy";
    return assertNever(state.progress);
  }
  if (state.view === "office") return renderOffice(state);

  if (state.camera.location === "1a") return camera_1a(state);
  if (state.camera.location === "1b") return camera_1b(state);
  if (state.camera.location === "1c") return camera_1c(state);
  if (state.camera.location === "2a") return camera_2a(state);
  if (state.camera.location === "2b") return camera_2b(state);
  if (state.camera.location === "3") return camera_3(state);
  if (state.camera.location === "4a") return camera_4a(state);
  if (state.camera.location === "4b") return camera_4b(state);
  if (state.camera.location === "5") return camera_5(state);
  if (state.camera.location === "6") return camera_6();
  if (state.camera.location === "7") return camera_7(state);

  return assertNever(state.camera);
};
