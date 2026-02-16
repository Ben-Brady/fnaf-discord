import { jumpToJumpscare } from "../jumps";
import type { FoxyState, GameplayState } from "../state";
import { createStateRandom } from "./random";

const INTERVAL = 5.01;
const FOXY_TRAVEL_TIME = 3;
const FOXY_HALL_TIMEOUT = 10;

export const createFoxy = (difficulty: number): FoxyState => {
  return {
    difficulty: difficulty,
    timer: INTERVAL,
    position: "1c",
    progress: 0,
    attempt_count: 0,
    hall_timeout: FOXY_HALL_TIMEOUT,
    hall_travel_time: FOXY_TRAVEL_TIME,
    running: false,
    remaining_lockout: 0,
  };
};

export const tickFoxy = (state: GameplayState, dt: number) => {
  const { randomBetween: randomBetween, movementOpportunity } = createStateRandom(state);
  const { foxy } = state;

  if (foxy.remaining_lockout > 0) foxy.remaining_lockout -= dt;

  if (state.view === "camera") {
    foxy.remaining_lockout = randomBetween(0.83, 17.48);
  }

  if (foxy.position === "1c") {
    foxy.timer -= dt;
    if (foxy.timer > 0) return;
    foxy.timer += INTERVAL;

    if (foxy.remaining_lockout > 0) return;

    const success = movementOpportunity(foxy.difficulty);
    if (!success) return foxy;
    foxy.progress += 1;

    if (foxy.progress === 3) {
      foxy.progress = 0;
      foxy.position = "2a";
      foxy.hall_timeout = FOXY_HALL_TIMEOUT;
      foxy.hall_travel_time = FOXY_TRAVEL_TIME;
      foxy.running = false;
    }
  }

  if (foxy.position === "2a") {
    if (!foxy.running) {
      foxy.hall_timeout -= dt;
      const isViewingCamera = state.view === "camera" && state.camera === "2a";
      if (foxy.hall_timeout <= 0 || isViewingCamera) {
        foxy.running = true;
        foxy.hall_travel_time = FOXY_TRAVEL_TIME;
      }
    } else {
      foxy.hall_travel_time -= dt;
      if (foxy.hall_travel_time >= 0) return;

      if (!state.left_door) {
        jumpToJumpscare("foxy");
      }

      state.power -= 1 + foxy.attempt_count * 5;

      foxy.attempt_count += 1;
      foxy.position = "1c";
      foxy.progress = 0;
      foxy.running = false;
    }
  }
};
