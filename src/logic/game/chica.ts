import { jumpToJumpscare } from "../jumps";
import type { ChicaLocation, ChicaState, GameplayState } from "../state";
import { createStateRandom } from "./random";

const INTERVAL = 4.98;

export const createChica = (difficulty: number): ChicaState => {
  return {
    difficulty: difficulty,
    timer: INTERVAL,
    position: "1a",
  };
};

export const tickChica = (state: GameplayState, dt: number) => {
  const { chica } = state;
  const { choose, movementOpportunity } = createStateRandom(state);

  if (chica.position === "office" && state.view === "camera") {
    jumpToJumpscare("chica");
  }

  if (chica.timer > 0) {
    chica.timer -= dt;
    return;
  }

  chica.timer += INTERVAL;
  const success = movementOpportunity(chica.difficulty);
  if (success) {
    const nextPositionLookup: Record<ChicaLocation, () => ChicaLocation> = {
      "1a": () => "1b",
      "1b": () => choose("4a", "6", "7"),
      "4a": () => choose("1b", "4b"),
      "6": () => choose("1b", "7"),
      "7": () => choose("4a", "6"),
      "4b": () => choose("4b", "door"),
      door: () => (!state.right_door ? "office" : "4a"),
      office: () => "office",
    };
    chica.position = nextPositionLookup[chica.position]();
  }
};
