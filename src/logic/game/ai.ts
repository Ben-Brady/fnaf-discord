import type {
  BonniePosition,
  BonnieState,
  ChicaLocation,
  ChicaPosition,
  ChicaState,
  FoxyState,
  FreddyPosition,
  FreddyState,
  GameplayState,
} from "../state";
import { random } from "lodash";
import { JumpscareError } from ".";
import { movementOpportunity, randomChoice } from "./utils";
import { BONNIE_TIMER, CHICA_TIMER, FOXY_HALL_TIMEOUT, FOXY_TIMER, FOXY_TRAVEL_TIME, FREDDY_TIMER, TICKS_PER_SECOND } from "../constants";


export const tickFoxy = (state: GameplayState): FoxyState => {
  const { foxy } = state;

  foxy.timer -= 1;
  if (foxy.reamining_lockout > 0) foxy.reamining_lockout -= 1;

  // Foxy is locked for 0.83s - 16.67s
  if (state.view === "camera") {
    const seconds = random(0.83, 16.67, true);
    const lockout = Math.round(seconds * TICKS_PER_SECOND);
    foxy.reamining_lockout = lockout;
  }

  if (foxy.position.location === "1c") {
    if (foxy.timer > 0) return foxy;
    foxy.timer = FOXY_TIMER;

    const success = movementOpportunity(state, foxy.difficulty);
    if (!success) return foxy;

    if (foxy.position.variant == "0") {
      foxy.position = { location: "1c", variant: "1" };
    } else if (foxy.position.variant == "1") {
      foxy.position = { location: "1c", variant: "2" };
    } else if (foxy.position.variant == "2") {
      foxy.position = {
        location: "2a",
      };
      foxy.hall_timeout = FOXY_HALL_TIMEOUT;
      foxy.hall_travel_time = FOXY_TRAVEL_TIME;
      foxy.running = false;
    }
  }

  if (foxy.position.location === "2a") {
    if (foxy.running) {
      foxy.hall_travel_time -= 1;
      if (foxy.hall_travel_time > 0) return foxy;

      if (!state.left_door) throw new JumpscareError("foxy");

      foxy.attempt_count += 1;
      foxy.position = { location: "1c", variant: "0" };
      foxy.running = false;
    } else {
      foxy.hall_timeout -= 1;

      if (foxy.hall_timeout <= 0 || (state.view === "camera" && state.camera.location === "2a")) {
        foxy.running = true;
        foxy.hall_travel_time = FOXY_TRAVEL_TIME;
      }
    }
  }

  return foxy;
};

export const tickFreddy = (state: GameplayState): FreddyState => {
  const { freddy } = state;

  freddy.timer -= 1;
  if (freddy.timer > 0) return freddy;

  freddy.timer = FREDDY_TIMER;
  const success = movementOpportunity(state, freddy.difficulty);
  if (!success) return freddy;

  if (freddy.position.location === "office") throw new JumpscareError("freddy-office");

  const nextPositionLookup: Record<FreddyPosition["location"], FreddyPosition> = {
    "1a": { location: "1b" },
    "1b": { location: "7" },
    "7": { location: "4a" },
    "4a": { location: "4b" },
    "4b": { location: "door" },
    door: { location: state.right_door ? "4b" : "office" },
    office: { location: "office" },
  };
  freddy.position = nextPositionLookup[freddy.position.location];

  return freddy;
};

export const tickBonnie = (state: GameplayState): BonnieState => {
  const bonnie = state.bonnie;

  const nextPositionLookup: Record<BonniePosition["location"], BonniePosition> = {
    "1a": { location: "1b" },
    "1b": randomChoice<BonniePosition>(state, [
      { location: "5", variant: "door" },
      { location: "2a" },
    ]),
    "5": randomChoice<BonniePosition>(state, [
      { location: "5", variant: "door" },
      { location: "2a" },
    ]),
    "2a": { location: "3" },
    "3": { location: "2b", variant: "normal" },
    "2b": { location: "door" },
    door: state.left_door ? { location: "2a" } : { location: "office" },
    office: { location: "office" },
  };

  if (bonnie.timer > 0) return { ...bonnie, timer: bonnie.timer - 1 };

  bonnie.timer = BONNIE_TIMER;
  const success = movementOpportunity(state, bonnie.difficulty);

  if (success) {
    bonnie.position = nextPositionLookup[bonnie.position.location];
  } else {
    if (bonnie.position.location === "2b")
      bonnie.position.variant = randomChoice(state, ["normal", "open_mouth", "tweaking"]);
    if (bonnie.position.location === "5")
      bonnie.position.variant = randomChoice(state, ["camera", "door"]);
  }

  if (success && bonnie.position.location === "office") throw new JumpscareError("chica");

  return bonnie;
};

export const tickChica = (state: GameplayState): ChicaState => {
  const chica = state.chica;

  const nextPositionLookup: Record<ChicaLocation, ChicaPosition> = {
    "1a": { location: "1b" },
    "1b": randomChoice<ChicaPosition>(state, [
      { location: "4a", variant: "far" },
      { location: "6" },
      { location: "7", variant: "far" },
    ]),
    "4a": { location: "4b", variant: "normal" },
    "6": { location: "1b" },
    "7": { location: "1b" },
    "4b": { location: "door" },
    door: !state.right_door ? { location: "office" } : { location: "4a", variant: "close" },
    office: { location: "office" },
  };

  if (chica.timer > 0) return { ...chica, timer: chica.timer - 1 };

  chica.timer = CHICA_TIMER;
  const success = movementOpportunity(state, chica.difficulty);
  if (success) {
    chica.position = nextPositionLookup[chica.position.location];
  } else {
    if (chica.position.location === "7")
      chica.position.variant = randomChoice(state, ["close", "far"]);
    if (chica.position.location === "4a")
      chica.position.variant = randomChoice(state, ["close", "far"]);
    if (chica.position.location === "4b")
      chica.position.variant = randomChoice(state, ["normal", "open_mouth", "tweaking"]);
  }

  if (success && chica.position.location === "office") throw new JumpscareError("chica");

  return chica;
};
