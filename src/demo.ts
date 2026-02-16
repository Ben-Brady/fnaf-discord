import { runTick } from "./fnaf.js/tick";
import { getImage, render } from "./render";
import { sleep } from "bun";
import type { GameState, GameplayInput, GameplayState } from "./fnaf.js/state";
import { sample } from "lodash";
import { logMap, logState } from "./debug";
import { createNight, createNumberedNight } from "./fnaf.js";

// let state: GameState = createNumberedNight(5);
let state: GameState = createNight({ difficulties: { bonnie: 20 } });

const randomAction = () =>
  sample<GameplayInput>([
    undefined,
    { type: "left-door" },
    { type: "left-light" },
    { type: "right-door" },
    { type: "right-light" },
    { type: "open-camera" },
    { type: "close-camera" },
    { type: "swap-camera", camera: "1a" },
    { type: "swap-camera", camera: "1b" },
    { type: "swap-camera", camera: "1c" },
    { type: "swap-camera", camera: "2a" },
    { type: "swap-camera", camera: "2b" },
    { type: "swap-camera", camera: "3" },
    { type: "swap-camera", camera: "4a" },
    { type: "swap-camera", camera: "4b" },
    { type: "swap-camera", camera: "5" },
    { type: "swap-camera", camera: "6" },
    { type: "swap-camera", camera: "7" },
  ]);

const createGuardAI = () => {
  let reactionTime = 0;
  let lastCheckedFoxy = 0;
  function nextAction(state: GameplayState): GameplayInput {
    reactionTime--;
    if (reactionTime > 0) return;
    reactionTime = 20;

    const { left_door, left_light, right_door, right_light, bonnie, chica } = state;
    const inOffice = state.view === "office";
    const inCamera = state.view === "camera";

    if (inCamera) {
      lastCheckedFoxy--;
      if (reactionTime <= 0) {
        reactionTime = lastCheckedFoxy;
      }
      return { type: "swap-camera", camera: "1c" };
    }

    if (inOffice) {
      if (!left_door && left_light && bonnie.position === "door") {
        return { type: "left-door" };
      }

      if (!right_door && right_light && chica.position === "door") {
        return { type: "left-door" };
      }

      if (left_light) return { type: "left-light" };
      if (right_light) return { type: "left-light" };

      if (!state.left_light && state.view === "office" && state.chica.position === "door") {
        return { type: "left-door" };
      }
    }
  }
  return { nextAction };
};

while (state.type === "gameplay") {
  if (state.type !== "gameplay") break;

  console.clear();
  logMap(state);
  // logState(state);

  const action: GameplayInput = state.left_door ? undefined : { type: "left-door" };
  state = runTick(state, action, 0.05);
  await sleep(5);
}

console.log(`Jumpscare: ${getImage(render(state))}`);
