export type GameState = GameplayState | JumpscareState | PoweroutState | VictoryState;

export type VictoryState = {
  type: "victory";
};

export type JumpscareState = {
  type: "jumpscare";

  jumpscare: "freddy-powerout" | "freddy-office" | "foxy" | "bonnie" | "chica";
};

export type JumpscareType = JumpscareState["jumpscare"];

export type PoweroutState = {
  type: "powerout";

  time: number;
  ticks_since_started: number;
  remaining_minimum_ticks: number;

  progress: "lights_off" | "freddy" | "blackout";
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

export type GameplayState = {
  type: "gameplay";

  time: number;
  power: number;
  view: "camera" | "office";
  camera: CameraView;

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

export type CameraView =
  | Position<"1a">
  | Position<"1b">
  | Position<"1c", "normal" | "its_me">
  | Position<"2a", "lights" | "no_lights">
  | Position<"2b", "normal" | "warped_freddy" | "golden_freddy">
  | Position<"3">
  | Position<"4a", "normal" | "its_me" | "crying_child">
  | Position<"4b", "normal" | "paper_1" | "paper_2" | "paper_3" | "paper_4">
  | Position<"5", "normal" | "possessed">
  | Position<"6">
  | Position<"7">;

export type ChicaLocation = ChicaPosition["location"];
export type ChicaPosition =
  | Position<"1a">
  | Position<"1b">
  | Position<"7", "close" | "far">
  | Position<"6">
  | Position<"4a", "close" | "far">
  | Position<"4b", "normal" | "open_mouth" | "tweaking">
  | Position<"door">
  | Position<"office">;

export type FreddyLocation = FreddyPosition["location"];
export type FreddyPosition =
  | Position<"1a">
  | Position<"1b">
  | Position<"7">
  | Position<"4a">
  | Position<"4b">
  | Position<"door">
  | Position<"office">;

export type BonnieLocation = BonniePosition["location"];
export type BonniePosition =
  | Position<"1a">
  | Position<"1b">
  | Position<"5", "door" | "camera">
  | Position<"3">
  | Position<"2a">
  | Position<"2b", "normal" | "open_mouth" | "tweaking">
  | Position<"door">
  | Position<"office">;

export type AnimatronicPosition = CameraName | "office" | "door";

export type FoxyState = {
  timer: number;
  difficulty: number;
  position: Position<"1c", "0" | "1" | "2"> | Position<"2a">;

  attempt_count: number;
  reamining_lockout: number;
  running: boolean;
  hall_timeout: number;
  hall_travel_time: number;
};

export type ChicaState = {
  timer: number;
  difficulty: number;
  position: ChicaPosition;
};

export type BonnieState = {
  timer: number;
  difficulty: number;
  position: BonniePosition;
};

export type FreddyState = {
  timer: number;
  difficulty: number;
  position: FreddyPosition;
};

export type Position<
  TLocation extends AnimatronicPosition,
  TVariant extends string | undefined = undefined,
> =
  TVariant extends undefined ?
    {
      location: TLocation;
      variant?: TVariant;
    }
  : {
      location: TLocation;
      variant: TVariant;
    };
