import type { Image } from "./files";
import type { GameplayState } from "../logic/state";

export const renderOffice = (state: GameplayState): Image => {
  const chica = state.chica.position.location === "office";
  const bonnie = state.chica.position.location === "office";
  const { left_light, right_light, left_door, right_door } = state;

  if (left_light && !left_door && !right_door) return "office-ll";
  if (left_light && !left_door && right_door) return "office-ll-rd";
  if (left_light && left_door && !right_door) return "office-ll-ld";
  if (left_light && left_door && right_door) return "office-ll-ld-rd";
  if (left_light && !left_door && !right_door && bonnie) return "office-ll-bonnie";
  if (left_light && !left_door && right_door && bonnie) return "office-ll-rd-bonnie";
  if (left_light && left_door && !right_door && bonnie) return "office-ll-ld-bonnie";
  if (left_light && left_door && right_door && bonnie) return "office-ll-ld-rd-bonnie";

  if (right_light && !left_door && !right_door) return "office-rl";
  if (right_light && !left_door && right_door) return "office-rl-rd";
  if (right_light && left_door && !right_door) return "office-rl-ld";
  if (right_light && left_door && right_door) return "office-rl-ld-rd";
  if (right_light && !left_door && !right_door && chica) return "office-rl-chica";
  if (right_light && !left_door && right_door && chica) return "office-rl-rd-chica";
  if (right_light && left_door && !right_door && chica) return "office-rl-ld-chica";
  if (right_light && left_door && right_door && chica) return "office-rl-ld-rd-chica";

  if (left_door && right_door) return "office-ld-rd";
  if (left_door && !right_door) return "office-ld";
  if (!left_door && right_door) return "office-rd";

  return "office";
};
