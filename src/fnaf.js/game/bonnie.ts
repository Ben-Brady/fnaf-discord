import { jumpToJumpscare } from "../jumps";
import type { BonnieLocation, BonnieState, GameplayState } from "../state";
import { createStateRandom } from "./random";

export const INTERVAL = 4.97;

export const createBonnie = (difficulty: number): BonnieState => {
  return {
    difficulty: difficulty,
    timer: INTERVAL,
    position: "1a",
  };
};

export const tickBonnie = (state: GameplayState, dt: number) => {
  const { bonnie } = state;
  const { movementOpportunity, choose } = createStateRandom(state);

  if (bonnie.position === "office" && state.view === "camera") {
    jumpToJumpscare("bonnie");
  }

  if (bonnie.timer > 0) {
    bonnie.timer -= dt;
    return;
  }
  bonnie.timer += INTERVAL;

  const nextPositionLookup: Record<BonnieLocation, BonnieLocation> = {
    "1a": choose("1b", "5"),
    "1b": choose("5", "2a"),
    "5": choose("1b", "2a"),
    "2a": choose("2b", "3"),
    "3": choose("door", "2a"),
    "2b": choose("door", "3"),
    door: state.left_door ? "1b" : "office",
    office: "office",
  };

  const success = movementOpportunity(bonnie.difficulty);
  if (success) {
    bonnie.position = nextPositionLookup[bonnie.position];
  }
};
