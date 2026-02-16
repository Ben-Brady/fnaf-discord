import type { GameplayInput, GameplayState } from "../state";
import { TOTAL_POWER, NIGHT_DURATION } from "../constants";
import { tickBonnie } from "./bonnie";
import { tickChica } from "./chica";
import { tickFoxy } from "./foxy";
import { tickFreddy } from "./freddy";
import { applyPowerUsage } from "./power";
import { applyUserInput } from "./input";
import { jumpToPowerout, jumpToVictory } from "../jumps";
import { applyDifficultyIncreases } from "./difficulites";

export const runGameTick = (state: GameplayState, input: GameplayInput, dt: number) => {
  state.time += dt;
  if (state.time > NIGHT_DURATION) jumpToVictory();
  if (state.power > TOTAL_POWER) jumpToPowerout(state);

  applyDifficultyIncreases(state, dt);
  applyPowerUsage(state, dt);
  applyUserInput(state, input);

  tickBonnie(state, dt);
  tickChica(state, dt);
  tickFoxy(state, dt);
  tickFreddy(state, dt);
};
