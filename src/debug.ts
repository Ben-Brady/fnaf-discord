import type { GameplayState } from "./logic/state";

export const logState = (state: GameplayState) => {
  const { bonnie, chica, foxy, freddy } = state;
  console.clear();
  console.log(`Freddy (${freddy.position.location}): ${freddy.difficulty} | ${freddy.timer}`);
  console.log(`Bonnie (${bonnie.position.location}): ${bonnie.difficulty} | ${bonnie.timer}`);
  console.log(`Chica (${chica.position.location}): ${chica.difficulty} | ${chica.timer}`);
  console.log(`Foxy (${foxy.position.location}): ${foxy.difficulty} | ${foxy.timer}`);
  console.log(`  Running: ${foxy.running}`);
  console.log(`  Hall Timeout: ${foxy.hall_timeout}`);
  console.log(`  Hall Travel: ${foxy.hall_travel_time}`);
  console.log(`  Lockout: ${foxy.reamining_lockout}`);
  console.log();
  console.log(`Left Door: ${state.left_door}`);
  console.log(`Right Door: ${state.right_door}`);
  console.log(`Left Light: ${state.left_light}`);
  console.log(`Right Light: ${state.right_light}`);
  console.log(`Camera: ${state.camera.location}`);
  console.log(`View: ${state.view}`);
};

export const logMap = (state: GameplayState) => {
  const { bonnie, chica, foxy, freddy } = state;
  const bonnie_pos = bonnie.position.location;
  const chica_pos = chica.position.location;
  const freddy_pos = freddy.position.location;
  const foxy_pos = foxy.position.location;
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
   |_____|  |     | |      | |     |
            |     |_|      |_|     |
            |                      |
            |      _        _      |
            |     | |      | | 4bC |
            | 2bB | |______| | 4bF |
            |_____|          |_____|
`;

  map = map.replace("SB", bonnie_pos === "1a" ? "B " : "  ");
  map = map.replace("SC", chica_pos === "1a" ? "C " : "  ");
  map = map.replace("SF", freddy_pos === "1a" ? "F " : "  ");

  map = map.replace("1bF", freddy_pos === "1b" ? " F " : "   ");
  map = map.replace("1bC", chica_pos === "1b" ? " C " : "   ");
  map = map.replace("1bB", bonnie_pos === "1b" ? " B " : "   ");

  map = map.replace("1cF", foxy_pos === "1c" ? " F " : "   ");

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

  console.clear();
  console.log(map);
};
