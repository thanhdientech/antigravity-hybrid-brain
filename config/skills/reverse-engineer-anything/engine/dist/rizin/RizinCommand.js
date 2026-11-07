import { absoluteCallerPath } from "../filesystem/callerPath.js";
/** Default one-shot presentation to plain text while retaining plugin availability. */
export const rizinCommand = (input) => [
    "-N",
    "-q",
    "-e",
    "scr.color=0",
    "-c",
    input.command,
    absoluteCallerPath(input.path),
];
