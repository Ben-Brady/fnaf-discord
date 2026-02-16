import type { FreddyState } from "./game/freddy";
import type { PoweroutState } from "./powerout";

export type TimerState = { value: null | number };
export type GameState = GameplayState | JumpscareState | PoweroutState | VictoryState;

export type VictoryState = {
  type: "victory";
};

export type JumpscareType = "freddy-powerout" | "freddy-office" | "foxy" | "bonnie" | "chica";
export type JumpscareState = {
  type: "jumpscare";
  jumpscare: JumpscareType;
};

export type GameplayInput =
  | undefined
  | { type: "left-door" }
  | { type: "left-light" }
  | { type: "right-light" }
  | { type: "right-door" }
  | { type: "open-camera" }
  | { type: "close-camera" }
  | {
      type: "swap-camera";
      camera: CameraName;
    };

export type NightNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type GameplayState = {
  type: "gameplay";
  night: NightNumber;

  timers: Record<string, number>;
  seed: number;
  time: number;
  power: number;
  view: "camera" | "office";
  camera: CameraName;

  camera_rng: number;
  golden_freddy_appeared: boolean;

  left_door: boolean;
  right_door: boolean;
  left_light: boolean;
  right_light: boolean;

  foxy: FoxyState;
  chica: ChicaState;
  bonnie: BonnieState;
  freddy: FreddyState;
};

export type Difficulty = {
  bonnie: number;
  chica: number;
  foxy: number;
  freddy: number;
};

export type CameraName = "1a" | "1b" | "1c" | "2a" | "2b" | "3" | "4a" | "4b" | "5" | "6" | "7";

export type ChicaLocation = "1a" | "1b" | "4a" | "4b" | "6" | "7" | "door" | "office";
export type FreddyLocation = "1a" | "1b" | "4a" | "4b" | "6" | "7" | "door" | "office";
export type BonnieLocation = "1a" | "1b" | "2a" | "2b" | "3" | "5" | "door" | "office";
export type FoxyLocation = "1c" | "2a";

export type AnimatronicPosition = CameraName | "office" | "door";

export type FoxyState = {
  timer: number;
  difficulty: number;
  position: FoxyLocation;

  progress: number;
  attempt_count: number;
  remaining_lockout: number;
  running: boolean;
  hall_timeout: number;
  hall_travel_time: number;
};

export type ChicaState = {
  timer: number;
  difficulty: number;
  position: ChicaLocation;
};

export type BonnieState = {
  timer: number;
  difficulty: number;
  position: BonnieLocation;
};
