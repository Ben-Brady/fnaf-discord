import type { Image } from "./files";
import type { GameplayState, CameraName } from "../logic/state";

export const camera_1a = (state: GameplayState): Image => {
    const { bonnie, chica, freddy } = getAnimatronicOnCamera(state, "1a");

    if (bonnie && chica && freddy) return "cam-1a-b-c-f";
    if (!bonnie && chica && freddy) return "cam-1a-c-f";
    if (bonnie && !chica && freddy) return "cam-1a-b-f";
    if (!bonnie && !chica && freddy) return "cam-1a-f";

    return "cam-1a";
};

export const camera_1b = (state: GameplayState): Image => {
    const { bonnie, chica, freddy } = getAnimatronicOnCamera(state, "1b");

    if (bonnie && chica && freddy) return "cam-1b-b-c-f";
    if (bonnie && chica && !freddy) return "cam-1b-b-c";
    if (bonnie && !chica && freddy) return "cam-1b-b-f";
    if (bonnie && !chica && !freddy) return "cam-1b-b";
    if (!bonnie && chica && freddy) return "cam-1b-c-f";
    if (!bonnie && chica && !freddy) return "cam-1b-c";
    if (!bonnie && !chica && freddy) return "cam-1b-f";

    return "cam-1b";
};

export const camera_1c = (state: GameplayState): Image => {
    const { foxy } = state;

    if (foxy.position.location === "1c") {
        if (foxy.position.variant === "0") return "cam-1c-0";
        if (foxy.position.variant === "1") return "cam-1c-1";
        if (foxy.position.variant === "2") return "cam-1c-2";
    }

    return "cam-1c-3";
};

export const camera_2a = (state: GameplayState): Image => {
    const { bonnie, foxy } = state;

    if (bonnie.position.location === "2a") return "cam-2a-b";
    if (foxy.position.location === "2a") return "cam-2a-f";
    return "cam-2a";
};

export const camera_2b = (state: GameplayState): Image => {
    const { bonnie } = state;

    if (bonnie.position.location === "2b") return "cam-2b-b";
    return "cam-2b";
};

export const camera_3 = (state: GameplayState): Image => {
    const { bonnie } = state;

    if (bonnie.position.location === "3") return "cam-3-b";
    return "cam-3";
};

export const camera_4a = (state: GameplayState): Image => {
    const { chica, freddy } = getAnimatronicOnCamera(state, "4a");
    if (chica && freddy) return "cam-4a-c-f";
    if (freddy) return "cam-4a-f";
    if (chica) return "cam-4a-c";
    return "cam-4a";
};

export const camera_4b = (state: GameplayState): Image => {
    const { chica, freddy } = getAnimatronicOnCamera(state, "4b");
    if (freddy) return "cam-4b-f";
    if (chica) return "cam-4b-c";
    return "cam-4b";
};

export const camera_5 = (state: GameplayState): Image => {
    const { bonnie } = state;

    if (bonnie.position.location === "5") {
        if (bonnie.position.variant === "camera") return "cam-5-b-camera";
        return "cam-5-b-door";
    }
    return "cam-5";
};

export const camera_6 = (): Image => {
    return "cam-static";
};

export const camera_7 = (state: GameplayState): Image => {
    const { chica, freddy } = getAnimatronicOnCamera(state, "7");

    if (chica && freddy) return "cam-7-c-f";
    if (freddy) return "cam-7-f";
    if (chica) return "cam-7-c";

    return "cam-7";
};

const getAnimatronicOnCamera = (
    state: GameplayState,
    position: CameraName,
): { freddy: boolean; chica: boolean; bonnie: boolean } => {
    return {
        bonnie: state.bonnie.position.location === position,
        chica: state.chica.position.location === position,
        freddy: state.freddy.position.location === position,
    };
};
