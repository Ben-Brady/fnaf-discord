import { createStateRandom } from "./game/random";
import type { GameplayState } from "./state";

const ENDO_FACING = 1;
const BROKEN_FREDDY_POSTER = 3;
const NEWSPAPER_1 = 4;
const NEWSPAPER_2 = 5;
const NEWSPAPER_3 = 5;
const NEWSPAPER_4 = 6;
const CRYING_CHILD_POSTER = 7;

const createCamRNGFunc = (eventId: number) => (state: GameplayState) =>
  state.camera_rng === eventId;

export const showFoxyItsMeSign = (state: GameplayState) => state.camera_rng < 10;

export const showFreddyPoster = createCamRNGFunc(BROKEN_FREDDY_POSTER);
export const showCryingChildPosters = createCamRNGFunc(CRYING_CHILD_POSTER);
export const showNewspaperClipping1 = createCamRNGFunc(NEWSPAPER_1);
export const showNewspaperClipping2 = createCamRNGFunc(NEWSPAPER_2);
export const showNewspaperClipping3 = createCamRNGFunc(NEWSPAPER_3);
export const showNewspaperClipping4 = createCamRNGFunc(NEWSPAPER_4);
export const showMaintenanceEndo = createCamRNGFunc(ENDO_FACING);
