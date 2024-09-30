export const assertNever = (value: never): never => {
    throw new Error("Didn't expect to get here: " + value);
};
