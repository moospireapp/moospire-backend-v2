import { fileURLToPath } from "url";
import path from "path";

/**
 * Returns the equivalent of __dirname in ES modules.
 * @param metaUrl - The `import.meta.url` value from the current module.
 * @returns The directory name of the current module.
 */
export const getFileDir = (metaUrl: string): string => {
  const __filename = fileURLToPath(metaUrl);
  return path.dirname(__filename);
};

export const convertToMilliseconds = (input: string) => {
  const timeValue = parseInt(input); // Get the numeric value
  const timeUnit = input.slice(-1); // Get the last character (unit)

  let milliseconds;

  switch (timeUnit) {
    case "d": // Days
      milliseconds = timeValue * 24 * 60 * 60 * 1000;
      break;
    case "h": // Hours
      milliseconds = timeValue * 60 * 60 * 1000;
      break;
    case "m": // Minutes
      milliseconds = timeValue * 60 * 1000;
      break;
    case "s": // Seconds
      milliseconds = timeValue * 1000;
      break;
    default:
      throw new Error('Invalid time format. Use "d", "h", "m", or "s".');
  }

  return milliseconds;
};
