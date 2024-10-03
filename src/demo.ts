import { tick } from "./logic";
import { createGame } from "./logic/game";
import { getImage, render } from "./render";
import { sleepSync } from "bun";
import type { GameState, GameplayInput } from "./logic/state";
import { sample } from "lodash";
import { logMap, logState } from "./debug";

let state: GameState = createGame({
  bonnie: 0,
  chica: 0,
  foxy: 10,
  freddy: 0,
});

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

while (state.type === "gameplay") {
  if (state.type !== "gameplay") break;

  // console.clear();
  // logMap(state);

  const action = randomAction();
  state = tick(state, action);
  sleepSync(33);
}

console.log();
console.log(`Jumpscare: ${getImage(render(state))}`);
