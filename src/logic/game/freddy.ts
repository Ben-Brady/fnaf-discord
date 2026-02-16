import { jumpToJumpscare } from "../jumps";
import type { FreddyLocation, FreddyState, GameplayState } from "../state";
import { createStateRandom } from "./utils";

export const FREDDY_TIMER = 3.02;

export const createFreddy = (difficulty: number): FreddyState => {
  return {
    difficulty: difficulty,
    timer: FREDDY_TIMER,
    position: "1a",
  };
};

export const tickFreddy = (state: GameplayState, dt: number) => {
  const { freddy } = state;
  const { movementOpportunity } = createStateRandom(state);

  if (freddy.position === "office" && state.view === "camera") {
    jumpToJumpscare("freddy-office");
  }

  if (freddy.timer > 0) {
    freddy.timer -= dt;
    return;
  }
  freddy.timer += FREDDY_TIMER;

  const success = movementOpportunity(freddy.difficulty);
  if (!success) return;

  if (freddy.position === "office") throw new JumpscareError("freddy-office");

  const atStart = freddy.position === "1a";
  const bonnieAtStart = state.bonnie.position === "1a";
  const chicaAtStart = state.chica.position === "1a";
  // Can't move unti all other animatronics move
  if (atStart && (bonnieAtStart || chicaAtStart)) return;

  // Freddy on cam4b is blocked by cams
  if (state.view === "camera" && freddy.position === "4b") {
    return;
  }

  const nextPositionLookup: Record<FreddyLocation, FreddyLocation> = {
    "1a": "1b",
    "1b": "7",
    "7": "6",
    "6": "4a",
    "4a": "4b",
    "4b": "door",
    door: state.right_door ? "4a" : "office",
    office: "office",
  };
  freddy.position = nextPositionLookup[freddy.position];
};
