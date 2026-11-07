/** Incur takes a command string and splits quoted segments without backslash escapes. */
export const clientRegistrationCommandText = (command) => command.map((argument) => `'${argument.replaceAll("'", `'"'"'`)}'`).join(" ");
