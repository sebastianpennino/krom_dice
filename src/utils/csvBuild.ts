import { appendFileSync, existsSync, mkdirSync, rmSync } from "fs";
import { Flavors } from "../types/constants.js";
import { simulateRolls } from "./diceRoll.js";

const getBaseRowsOriginal = (targetNumber: number, flavor?: Flavors) => {
  return [
    [`${flavor}`, "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
    [
      "TN:",
      "Botch",
      "1R",
      "1R",
      "2R",
      "2R",
      "3R",
      "3R",
      "4R",
      "4R",
      "5R",
      "5R",
    ],
    [
      `${targetNumber}`,
      "%",
      "Hit",
      "Miss",
      "Hit",
      "Miss",
      "Hit",
      "Miss",
      "Hit",
      "Miss",
      "Hit",
      "Miss",
    ],
  ];
};

const getBaseRows = (targetNumber: number, flavor?: Flavors) => {
  return [
    [`${flavor}`, "*", "*", "*", "-", "-", "-", "*", "*", "*", "-", "-", "-"],
    [
      "TN:",
      "1R",
      "1R",
      "1R",
      "2R",
      "2R",
      "2R",
      "3R",
      "3R",
      "3R",
      "4R",
      "4R",
      "4R",
    ],
    [
      `${targetNumber}`,
      "Botch",
      "Hit",
      "Miss",
      "Botch",
      "Hit",
      "Miss",
      "Botch",
      "Hit",
      "Miss",
      "Botch",
      "Hit",
      "Miss",
    ],
  ];
};

const getDataRows = (faces: number) => {
  return [
    [`1d${faces}`],
    [`2d${faces}`],
    [`3d${faces}`],
    [`4d${faces}`],
    [`5d${faces}`],
    [`6d${faces}`],
    [`7d${faces}`],
    [`8d${faces}`],
    [`9d${faces}`],
  ];
};

export const createCSVContent = (
  simulations: number,
  diceFaces: number,
  targetNumber: number,
  flavor: Flavors
) => {
  const filledRows = getDataRows(diceFaces).map((row, idx) => {
    const maxLoops = 4; // 1 to 4 required successes (hardcoded)

    for (let requiredSuccesses = 1; requiredSuccesses <= maxLoops; requiredSuccesses++) {
      const [botchPercent, sucessPercent, failPercent] = simulateRolls(
        simulations,
        idx + 1,
        diceFaces,
        targetNumber,
        requiredSuccesses,
        flavor
      );

      row.push(botchPercent, sucessPercent, failPercent);
    }

    return row;
  });

  return getBaseRows(targetNumber, flavor).concat(filledRows);
};

export const checkAndCreateDirectory = (dir: string) => {
  try {
    if (!existsSync(dir)) {
      mkdirSync(dir);
      return true;
    }
  } catch (err) {
    console.error("Error on checkAndCreateDirectory");
    console.error(err);
    return false;
  }
  return false;
};

export const checkForFileAndRemoveIt = (dir: string, file: string) => {
  try {
    if (!existsSync(dir + file)) {
      rmSync(dir + file);
    }
  } catch (err) {
    console.error("Error on checkForFileAndRemoveIt");
    console.error(err);
  }
};

export const createCSV = (dir: string, file: string, csvContent: string) => {
  try {
    appendFileSync(dir + file, csvContent);
  } catch (err) {
    console.error("Error on createCSV");
    console.error(err);
  }
};
