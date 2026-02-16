import { jumpToJumpscare } from "../jumps";
import type { FreddyLocation, GameplayState } from "../state";
import { createStateRandom } from "./random";

export const INTERVAL = 3.02;

export type FreddyState = {
  timer: number;
  difficulty: number;
  position: FreddyLocation;
  moveDelay: number | null;
};

export const createFreddy = (difficulty: number): FreddyState => {
  return {
    difficulty: difficulty,
    timer: INTERVAL,
    position: "1a",
    moveDelay: null,
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
  freddy.timer += INTERVAL;

  const isCameraBlocked = state.view === "camera" && freddy.position === state.camera;

  if (freddy.moveDelay === null) {
    // Can't move unti all other animatronics move
    const atStart = freddy.position === "1a";
    const bonnieAtStart = state.bonnie.position === "1a";
    const chicaAtStart = state.chica.position === "1a";
    if (atStart && (bonnieAtStart || chicaAtStart)) return;

    const success = movementOpportunity(freddy.difficulty);
    if (!success) return;

    if (isCameraBlocked) return;
    freddy.moveDelay = calcMoveDelay(freddy.difficulty);
  } else {
    // Freddy on cam4b is blocked by cams
    freddy.moveDelay -= 1;
    if (freddy.moveDelay > 0) return;
    if (isCameraBlocked) return;

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
  }
};

const calcMoveDelay = (difficulty: number) => 1000 - 100 * difficulty;
