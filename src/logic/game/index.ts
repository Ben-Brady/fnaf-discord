import type {
  GameplayInput,
  GameplayState,
  GameState,
  JumpscareType,
} from "../state";
import { cloneDeep } from "lodash";
import { tickBonnie, tickChica, tickFoxy, tickFreddy } from "./ai";
import { TICKS_PER_SECOND } from "..";
import { BONNIE_TIMER, CHICA_TIMER, FOXY_HALL_TIMEOUT, FOXY_TIMER, FOXY_TRAVEL_TIME, FREDDY_TIMER, MAX_POWER, NIGHT_DURATION } from "../constants";

export const gameTick = (state: GameplayState, input: GameplayInput): GameState => {
  state = cloneDeep(state);

  if (state.time > NIGHT_DURATION) {
    return { type: "victory" };
  }

  state.time += 1;

  if (state.power > MAX_POWER) {
    return {
      type: "powerout",
      progress: "blackout",
      remaining_minimum_ticks: 0,
      ticks_since_started: 0,
      time: state.time,
    };
  }

  state.power += calculatePower(state);
  state = handleInput(state, input);

  try {
    state.bonnie = tickBonnie(state);
    state.chica = tickChica(state);
    state.foxy = tickFoxy(state);
    state.freddy = tickFreddy(state);
  } catch (e) {
    if (e instanceof JumpscareError) return { type: "jumpscare", jumpscare: e.type };
    throw e;
  }

  return state;
};

const handleInput = (state: GameplayState, input: GameplayInput): GameplayState => {
  if (!input) return state;

  const inCamera = state.view === "camera";
  const inOffice = state.view === "office";

  if (input.type === "open-camera" && state.view === "office") {
    state.view = "camera";
    state.left_light = false;
    state.right_light = false;
  }
  if (input.type === "close-camera" && state.view === "camera") {
    state.view = "office";
  }

  if (inCamera && input.type === "swap-camera") {
    if (input.camera === "1a") state.camera = { location: "1a" };
    if (input.camera === "1b") state.camera = { location: "1b" };
    if (input.camera === "1c") state.camera = { location: "1c", variant: "normal" };
    if (input.camera === "2a") state.camera = { location: "2a", variant: "lights" };
    if (input.camera === "2b") state.camera = { location: "2b", variant: "normal" };
    if (input.camera === "3") state.camera = { location: "3" };
    if (input.camera === "4a") state.camera = { location: "4a", variant: "normal" };
    if (input.camera === "4b") state.camera = { location: "4b", variant: "normal" };
    if (input.camera === "5") state.camera = { location: "5", variant: "normal" };
    if (input.camera === "6") state.camera = { location: "6" };
    if (input.camera === "7") state.camera = { location: "7" };
  }

  if (inOffice && input.type === "left-door") {
    state.left_door = !state.left_door;
  }
  if (inOffice && input.type === "right-door") {
    state.right_door = !state.right_door;
  }

  if (inOffice && input.type === "left-light") {
    state.right_light = false;
    state.left_light = !state.left_light;
  }
  if (inOffice && input.type === "right-light") {
    state.left_light = false;
    state.right_light = !state.right_light;
  }

  return state;
};

const calculatePower = (state: GameplayState): number => {
  let power = 1;

  if (state.left_door) power += 1;
  if (state.right_door) power += 1;
  if (state.left_light) power += 1;
  if (state.right_light) power += 1;
  if (state.view === "camera") power += 1;

  return power;
};

export class JumpscareError extends Error {
  type: JumpscareType;
  constructor(type: JumpscareType) {
    super();
    this.type = type;
  }
}

type AiLevels = {
  bonnie: number;
  chica: number;
  foxy: number;
  freddy: number;
};
export const createGame = (difficulty: AiLevels): GameState => ({
  type: "gameplay",
  left_door: false,
  left_light: false,
  right_door: false,
  right_light: false,
  power: 0,
  time: 0,
  camera: { location: "1a" },
  view: "office",

  bonnie: {
    difficulty: difficulty.bonnie,
    timer: BONNIE_TIMER,
    position: { location: "1a" },
  },
  chica: {
    difficulty: difficulty.chica,
    timer: CHICA_TIMER,
    position: { location: "1a" },
  },
  freddy: {
    difficulty: difficulty.freddy,
    timer: FREDDY_TIMER,
    position: { location: "1a" },
  },
  foxy: {
    difficulty: difficulty.foxy,
    timer: FOXY_TIMER,
    position: { location: "1c", variant: "0" },
    attempt_count: 0,
    hall_timeout: FOXY_HALL_TIMEOUT,
    hall_travel_time: FOXY_TRAVEL_TIME,
    running: false,
    reamining_lockout: 0,
  },
});

export const createNight = (night: number): GameState => {
  const nightDifficulties: Record<number, AiLevels> = {
    1: { freddy: 0, bonnie: 0, chica: 0, foxy: 0 },
    2: { freddy: 0, bonnie: 3, chica: 1, foxy: 1 },
    3: { freddy: 1, bonnie: 0, chica: 5, foxy: 2 },
    4: { freddy: 2, bonnie: 2, chica: 4, foxy: 6 },
    5: { freddy: 3, bonnie: 5, chica: 7, foxy: 5 },
    6: { freddy: 4, bonnie: 10, chica: 12, foxy: 16 },
  };

  if (!(night in nightDifficulties)) throw new Error("Invalid Night");

  // TODO: add scaling difficulty
  let difficulty = nightDifficulties[night];
  difficulty = {
    freddy: difficulty.freddy,
    bonnie: difficulty.bonnie + 3,
    chica: difficulty.chica + 2,
    foxy: difficulty.foxy + 2,
  };

  return createGame(difficulty);
};
