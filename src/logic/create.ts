import { TOTAL_POWER } from "./constants";
import type { GameState, NightNumber } from "./state";
import { createBonnie } from "./game/bonnie";
import { createChica } from "./game/chica";
import { createFoxy } from "./game/foxy";
import { createFreddy } from "./game/freddy";

type AiLevels = {
  bonnie: number;
  chica: number;
  foxy: number;
  freddy: number;
};

export const createNight = (options: {
  difficulties: AiLevels;
  night?: NightNumber;
  seed?: number;
}): GameState => {
  let { difficulties, night, seed } = options;
  night ??= 7;
  seed ??= Math.random();

  return {
    night: 1,
    type: "gameplay",
    left_door: false,
    left_light: false,
    right_door: false,
    right_light: false,
    timers: {},
    power: TOTAL_POWER,
    time: 0,
    seed: seed,

    camera_rng: 0,
    camera: "1a",
    view: "office",

    bonnie: createBonnie(difficulties.bonnie),
    chica: createChica(difficulties.chica),
    freddy: createFreddy(difficulties.freddy),
    foxy: createFoxy(difficulties.foxy),
  };
};

type NormalNight = 1 | 2 | 3 | 4 | 5 | 6;
export const createNumberedNight = (night: NormalNight): GameState => {
  const nightDifficulties = {
    1: { bonnie: 0, chica: 0, foxy: 0, freddy: 0 },
    2: { bonnie: 3, chica: 1, foxy: 1, freddy: 0 },
    3: { bonnie: 0, chica: 5, foxy: 2, freddy: 1 },
    4: { bonnie: 2, chica: 4, foxy: 6, freddy: Math.random() < 0.5 ? 1 : 2 },
    5: { bonnie: 5, chica: 7, foxy: 5, freddy: 3 },
    6: { bonnie: 10, chica: 12, foxy: 16, freddy: 4 },
  } satisfies Record<NormalNight, AiLevels>;

  let difficulties = nightDifficulties[night];
  difficulties = {
    freddy: difficulties.freddy,
    bonnie: difficulties.bonnie,
    chica: difficulties.chica,
    foxy: difficulties.foxy,
  };

  return createNight({ difficulties, night });
};
