import type { Image } from "./files";
import type { GameplayState, GameState } from "../fnaf.js/state";
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
    if (state.stage === "blackout") return "powerout";
    if (state.stage === "freddy") return "powerout-freddy";
    if (state.stage === "lights_off") return "powerout-freddy";
    return assertNever(state.stage);
  }
  if (state.view == "office") return renderOffice(state);

  if (state.camera === "1a") return camera_1a(state);
  if (state.camera === "1b") return camera_1b(state);
  if (state.camera === "1c") return camera_1c(state);
  if (state.camera === "2a") return camera_2a(state);
  if (state.camera === "2b") return camera_2b(state);
  if (state.camera === "3") return camera_3(state);
  if (state.camera === "4a") return camera_4a(state);
  if (state.camera === "4b") return camera_4b(state);
  if (state.camera === "5") return camera_5(state);
  if (state.camera === "6") return camera_6();
  if (state.camera === "7") return camera_7(state);

  return assertNever(state.camera);
};
