import type { GameplayState } from "../state";

export const applyDifficultyIncreases = (state: GameplayState, dt: number) => {
  const MARK_2AM = 90 + 89 * 2;
  const MARK_3AM = 90 + 89 * 3;
  const MARK_4AM = 90 + 89 * 4;

  const nextTime = state.time + dt;

  const passedMark = (mark: number) => state.time < mark && nextTime > mark;
  if (passedMark(MARK_2AM)) {
    state.bonnie.difficulty += 1;
  }
  if (passedMark(MARK_3AM)) {
    state.bonnie.difficulty += 1;
    state.chica.difficulty += 1;
    state.foxy.difficulty += 1;
  }
  if (passedMark(MARK_4AM)) {
    state.bonnie.difficulty += 1;
    state.chica.difficulty += 1;
    state.foxy.difficulty += 1;
  }
};
