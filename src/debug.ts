import type { GameplayState } from "./logic/state";

export const printState = (state: GameplayState) => {
  console.log(`Bonnie: ${state.bonnie.position.location} | ${state.bonnie.timer}`);
  console.log(`Chica: ${state.chica.position.location} | ${state.chica.timer}`);
  console.log(`Foxy: ${state.foxy.position.location} | ${state.foxy.timer}`);
  console.log(`  Running: ${state.foxy.running}`);
  console.log(`  Hall Timeout: ${state.foxy.hall_timeout}`);
  console.log(`  Hall Travel: ${state.foxy.hall_travel_time}`);
  console.log(`  Lockout: ${state.foxy.reamining_lockout}`);
  console.log(`Freddy: ${state.freddy.position.location} | ${state.freddy.timer}`);
  console.log();
  console.log(`Left Door: ${state.left_door}`);
  console.log(`Right Door: ${state.right_door}`);
  console.log(`Left Light: ${state.left_light}`);
  console.log(`Right Light: ${state.right_light}`);
  console.log(`Camera: ${state.camera.location}`);
  console.log(`View: ${state.view}`);
};
