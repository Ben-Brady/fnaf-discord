import { createPoweroutState } from "./powerout";
import type { GameplayState, GameState, JumpscareType } from "./state";

export class ChangeStateError extends Error {
  state: GameState;
  constructor(state: GameState) {
    super();
    this.state = state;
  }
}

export const jumpToState = (state: GameState) => {
  throw new ChangeStateError(state);
};

export const jumpToJumpscare = (jumpscare: JumpscareType) => {
  jumpToState({ type: "jumpscare", jumpscare });
};

export const jumpToPowerout = (state: GameplayState) => {
  jumpToState(createPoweroutState(state));
};

export const jumpToVictory = () => {
  jumpToState({ type: "victory" });
};
