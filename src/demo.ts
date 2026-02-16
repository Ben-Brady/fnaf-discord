import { runTick, TICKS_PER_SECOND } from "./logic/tick";
import { createGame } from "./logic/game";
import { getImage, render } from "./render";
import { sleep, sleepSync } from "bun";
import type { GameState, GameplayInput } from "./logic/state";
import { sample } from "lodash";
import { logMap, logState } from "./debug";

let state: GameState = createGame({
  bonnie: 10,
  chica: 10,
  foxy: 10,
  freddy: 10,
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

  console.clear();
  logMap(state);

  const action = randomAction();
  state = runTick(state, action);
  console.log("foo");
  await sleep(10);
}

console.log(`Jumpscare: ${getImage(render(state))}`);
