import { NIGHT_DURATION } from "./fnaf.js";
import type { GameplayState } from "./fnaf.js";

export const logState = (state: GameplayState) => {
  const { bonnie, chica, foxy, freddy } = state;
  console.log(`Freddy (${freddy.position}): ${freddy.difficulty} | ${freddy.timer.toFixed(1)}`);
  console.log(`Bonnie (${bonnie.position}): ${bonnie.difficulty} | ${bonnie.timer.toFixed(1)}`);
  console.log(`Chica (${chica.position}): ${chica.difficulty} | ${chica.timer.toFixed(1)}`);
  console.log(`Foxy (${foxy.position}): ${foxy.difficulty} | ${foxy.timer.toFixed(1)}`);
  console.log(`  Running: ${foxy.running}`);
  console.log(`  Hall Timeout: ${foxy.hall_timeout}`);
  console.log(`  Hall Travel: ${foxy.hall_travel_time}`);
  console.log(`  Lockout: ${foxy.remaining_lockout}`);
  console.log();
  console.log(`Left Door: ${state.left_door}`);
  console.log(`Right Door: ${state.right_door}`);
  console.log(`Left Light: ${state.left_light}`);
  console.log(`Right Light: ${state.right_light}`);
  console.log(`Camera: ${state.camera}`);
  console.log(`View: ${state.view}`);

  console.log(`${state.time.toFixed(1)} / ${NIGHT_DURATION} (${getAM(state.time)})`);
};

export const logMap = (state: GameplayState) => {
  const { bonnie, chica, foxy, freddy } = state;
  const bonnie_pos = bonnie.position;
  const chica_pos = chica.position;
  const freddy_pos = freddy.position;
  const foxy_pos = foxy.position;
  let map = `
                  ____________
                 |            |
 _____ __________| SB  SC  SF |__________
|     |                                  |   ___
| 5B  |                                  |__|   |
|     |             1bF                      7C |
|_____|                                   __ 7F |
      |                                  |  |   |
  ____|            1bC                   |  |   |
 |    |                   1bB            |  |   |
 | 1cF|                                  |  |   |
 |    |                                  |  |   |
 |____|                                  |  |___|
      |_____       __________       __  _|
            | 2aB |          | 4aC | | |________
    _____   | 2aF |          | 4aF | |          |
   |     |  |     |          |     | |   6C     |
   |  3B |__|     |          |     | |          |
   |      __      |  ______  |     | |__________|
   |_____|  |     | |  CAM | |     |
            |     |_|      |_|     |
            |  BD DL        DR CD  |
            |      _        _  FD  |
            |     | |BOCOFO| | 4bC |
            | 2bB | |______| | 4bF |
            |_____|          |_____|
`;

  map = map.replace("SB", bonnie_pos === "1a" ? "B " : "  ");
  map = map.replace("SC", chica_pos === "1a" ? "C " : "  ");
  map = map.replace("SF", freddy_pos === "1a" ? "F " : "  ");

  map = map.replace("1bF", freddy_pos === "1b" ? " F " : "   ");
  map = map.replace("1bC", chica_pos === "1b" ? " C " : "   ");
  map = map.replace("1bB", bonnie_pos === "1b" ? " B " : "   ");

  map = map.replace("1cF", foxy_pos === "1c" ? `F-${foxy.progress}` : "   ");

  map = map.replace("2aB", bonnie_pos === "2a" ? " B " : "   ");
  map = map.replace("2aF", foxy_pos === "2a" ? " F " : "   ");

  map = map.replace("2bB", bonnie_pos === "2b" ? " B " : "   ");

  map = map.replace("3B", bonnie_pos === "3" ? "B " : "  ");

  map = map.replace("4aC", chica_pos === "4a" ? " C " : "   ");
  map = map.replace("4aF", freddy_pos === "4a" ? " F " : "   ");

  map = map.replace("4bC", chica_pos === "4b" ? " C " : "   ");
  map = map.replace("4bF", freddy_pos === "4b" ? " F " : "   ");

  map = map.replace("5B", bonnie_pos === "5" ? "B " : "  ");

  map = map.replace("6C", chica_pos === "6" ? "C " : "  ");

  map = map.replace("7C", chica_pos === "7" ? "C " : "  ");
  map = map.replace("7F", freddy_pos === "7" ? "F " : "  ");

  map = map.replace("CD", chica_pos === "door" ? " C" : "  ");
  map = map.replace("BD", bonnie_pos === "door" ? "B " : "  ");
  map = map.replace("FD", freddy_pos === "door" ? "F " : "  ");

  map = map.replace("DR", state.right_door ? "| " : "  ");
  map = map.replace("DL", state.left_door ? " |" : "  ");

  map = map.replace("CAM", state.view === "camera" ? state.camera.padEnd(3, " ") : "   ");

  map = map.replace("BO", bonnie_pos === "office" ? " B" : "  ");
  map = map.replace("CO", chica_pos === "office" ? " C" : "  ");
  map = map.replace("FO", freddy_pos === "office" ? " F" : "  ");
  console.log(map);
};

const getAM = (time: number) => {
  const second = time;
  if (second < 60) return "12AM";
  if (second < 119) return "1AM";
  if (second < 178) return "2AM";
  if (second < 237) return "3AM";
  if (second < 296) return "4AM";
  if (second < 355) return "5AM";
  return "6AM";
};
