import { createPoweroutState } from "./powerout";
import type { GameplayState, GameState, JumpscareType } from "./state";

export class ChangeStateError extends Error {
  state: GameState;
  constructor(state: GameState) {
    super();
    this.state = state;
  }
}

export const jumpToStateChange = (state: GameState) => {
  throw new ChangeStateError(state);
};

export const jumpToJumpscare = (jumpscare: JumpscareType) => {
  jumpToStateChange({ type: "jumpscare", jumpscare });
};

export const jumpToPowerout = (state: GameplayState) => {
  jumpToStateChange(createPoweroutState(state));
};

export const jumpToVictory = () => {
  jumpToStateChange({ type: "victory" });
};
