import { simulateVersusRollGroup, simulateRollGroup } from "../dice/diceRoll.js";
import { existsSync, mkdirSync, rmSync, appendFileSync } from "fs";
import { Flavors } from "../types/constants.js";
import { defaultVersusCfg } from "../types/validValues.js";


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
      "5R",
      "5R",
      "5R",
      "6R",
      "6R",
      "6R",
      "7R",
      "7R",
      "7R",
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

const getVersusBaseRows = (baseTN: number, TN: number, faces: number) => {
  return [
    ["-", "*", "*", "-", "-", "*", "*", "-", "-", "*", "*", "-", "-", "*", "*"],
    [
      `${baseTN} VS ${TN}`,
      `At`,
      `Repl`,
      `Otro`,
      `At`,
      `Repl`,
      `Otro`,
      `At`,
      `Repl`,
      `Otro`,
      `At`,
      `Repl`,
      `Otro`,
      `At`,
      `Repl`,
      `Otro`,
      `At`,
      `Repl`,
      `Otro`,
      `At`,
      `Repl`,
      `Otro`,
    ],
    [
      `At/Repl`,
      `2d${faces}`,
      `2d${faces}`,
      `2d${faces}`,
      `3d${faces}`,
      `3d${faces}`,
      `3d${faces}`,
      `4d${faces}`,
      `4d${faces}`,
      `4d${faces}`,
      `5d${faces}`,
      `5d${faces}`,
      `5d${faces}`,
      `6d${faces}`,
      `6d${faces}`,
      `6d${faces}`,
      `7d${faces}`,
      `7d${faces}`,
      `7d${faces}`,
      `8d${faces}`,
      `8d${faces}`,
      `8d${faces}`,
    ],
  ];
};

const getVersusDataRows = (faces: number, targetNumber: number) => {
  return [
    [`2d${faces}`],
    [`3d${faces}`],
    [`4d${faces}`],
    [`5d${faces}`],
    [`6d${faces}`],
    [`7d${faces}`],
    [`8d${faces}`],
  ];
};

const getDataRows = (faces: number) => {
  return [
    [`2d${faces}`],
    [`3d${faces}`],
    [`4d${faces}`],
    [`5d${faces}`],
    [`6d${faces}`],
    [`7d${faces}`],
    [`8d${faces}`],
    [`9d${faces}`],
    [`10d${faces}`],
    [`11d${faces}`],
    [`12d${faces}`],
    [`13d${faces}`],
    [`14d${faces}`],
    [`15d${faces}`],
  ];
};

export const createVersusCSVContent = (
  simulations: number,
  diceFaces: number,
  targetNumberHome: number,
  targetNumberAway: number,
  flavorHome: Flavors,
  flavorAway: Flavors,
  config = defaultVersusCfg
) => {
  const filledRows = getVersusDataRows(diceFaces, targetNumberHome).map(
    (row, idx) => {
      const maxColumns = 8;

      for (let col = 2; col <= maxColumns; col++) {
        const [homeWin, awayWin, others] = simulateVersusRollGroup(
          simulations,
          {
            numDice: idx + 2, // we start at 2d10 (home, left)
            diceFaces,
            targetNumber: targetNumberHome,
            requiredSuccesses: 1,
            flavor: flavorHome,
          },
          {
            numDice: col, // we start at 2d10 (away, top)
            diceFaces,
            targetNumber: targetNumberAway,
            requiredSuccesses: 1,
            flavor: flavorAway,
          },
          config
        );

        row.push(homeWin, awayWin, others);
      }

      return row;
    }
  );

  return getVersusBaseRows(
    targetNumberHome,
    targetNumberAway,
    diceFaces
  ).concat(filledRows);
};

export const createBasicCSVContent = (
  simulations: number,
  diceFaces: number,
  targetNumber: number,
  flavor: Flavors
) => {
  const filledRows = getDataRows(diceFaces).map((row, idx) => {
    //const maxLoops = 4; // 1 to 4 required successes (hardcoded)

    const maxLoops = 7; // 1 to 7 required successes (hardcoded)

    for (
      let requiredSuccesses = 1;
      requiredSuccesses <= maxLoops;
      requiredSuccesses++
    ) {
      const [botchPercent, sucessPercent, failPercent] = simulateRollGroup(
        simulations,
        {
          numDice: idx + 2, // we start at 2d10
          diceFaces,
          targetNumber,
          requiredSuccesses,
          flavor,
        }
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
