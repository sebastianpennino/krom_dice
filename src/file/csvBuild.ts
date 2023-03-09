import {
  simulateVersusRollGroup,
  simulateRollGroup,
} from "../dice/diceRoll.js";
import { existsSync, mkdirSync, rmSync, appendFileSync } from "fs";
import { Flavors } from "../types/constants.js";
import { defaultVersusCfg } from "../types/validValues.js";

type BaseRows = (
  titleElements: {
    targetNumber: number;
    flavor?: Flavors;
    botchLabel?: string;
    hitLabel?: string;
    missLabel?: string;
  },
  requiredSuccessesToDisplay?: number
) => string[][];

const buildBaseRows: BaseRows = (
  {
    targetNumber = 3,
    flavor = Flavors.STD,
    botchLabel = "Botch",
    hitLabel = "Hit",
    missLabel = "Miss",
  },
  requiredSuccessesToDisplay = 4
) => {
  const firstRow = [`${flavor}`];
  const secondRow = ["TN:"];
  const thirdRow = [`${targetNumber}`];
  if (flavor === Flavors.STD_CRITS || flavor === Flavors.STD_CRITS_STRICT) {
    for (let i = 1; i <= requiredSuccessesToDisplay; i++) {
      if (i % 2 === 0) {
        firstRow.push("*", "*", ".", ".", ".", "*");
      } else {
        firstRow.push("-", "-", ".", ".", ".", "-");
      }
      secondRow.push(`${i}R`, `${i}R`, `${i}R`, `${i}R`, `${i}R`, `${i}R`);
      thirdRow.push(botchLabel, hitLabel, "(1C)", "(2C)", "(C+)", missLabel);
    }
  } else {
    for (let i = 1; i <= requiredSuccessesToDisplay; i++) {
      if (i % 2 === 0) {
        firstRow.push("*", "*", "*");
      } else {
        firstRow.push("-", "-", "-");
      }
      secondRow.push(`${i}R`, `${i}R`, `${i}R`);
      thirdRow.push(botchLabel, hitLabel, missLabel);
    }
  }

  return [firstRow, secondRow, thirdRow];
};

type DataRows = (
  faces?: number,
  numDiceToDisplay?: number,
  startsAt?: number
) => string[][];

const buildDataRows: DataRows = (
  faces = 10,
  numDiceToDisplay = 10,
  startsAt = 2
) => {
  const dataRows = [];
  // We start at two deliberately
  for (let i = startsAt; i <= numDiceToDisplay; i++) {
    dataRows.push([`${i}d${faces}`]);
  }
  return dataRows;
};

type VersusDataRows = (
  config: {
    homeTN?: number;
    awayTN?: number;
    flavor?: Flavors;
    diceFaces?: number;
  },
  loops?: number,
  startAt?: number
) => string[][];

const buildVersusBaseRows: VersusDataRows = (
  { homeTN = 3, awayTN = 3, flavor = Flavors.STD, diceFaces = 10 },
  loops = 8,
  startAt = 2
) => {
  const firstRow = [`${flavor}`];
  const secondRow = [`${homeTN} VS ${awayTN}`];
  const thirdRow = [`At/Repl`];
  for (let i = startAt; i <= loops; i++) {
    if (i % 2 === 0) {
      firstRow.push("*", "*", "*");
    } else {
      firstRow.push("-", "-", "-");
    }
    secondRow.push(`At`, `Repl`, `Otro`);
    thirdRow.push(
      `${i}d${diceFaces}`,
      `${i}d${diceFaces}`,
      `${i}d${diceFaces}`
    );
  }

  return [firstRow, secondRow, thirdRow];
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
  const filledRows = buildDataRows(diceFaces).map((row, idx) => {
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
  });

  return buildVersusBaseRows({
    homeTN: targetNumberHome,
    awayTN: targetNumberAway,
    diceFaces,
  }).concat(filledRows);
};

type BuildCVS = (
  simulations: number,
  diceFaces: number,
  targetNumber: number,
  flavor: Flavors,
  requiredSuccessesToDisplay: number
) => string[][];

export const createBasicCSVContent: BuildCVS = (
  simulations,
  diceFaces,
  targetNumber,
  flavor,
  requiredSuccessesToDisplay
) => {
  const filledRows = buildDataRows(diceFaces, 10).map((row, idx) => {
    for (
      let requiredSuccesses = 1;
      requiredSuccesses <= requiredSuccessesToDisplay;
      requiredSuccesses++
    ) {
      const [botchPercent, sucessPercent, failPercent, ...rest] =
        simulateRollGroup(simulations, {
          numDice: idx + 2, // we start at 2d10
          diceFaces,
          targetNumber,
          requiredSuccesses,
          flavor,
        });

      if (
        rest[0] !== "" &&
        (flavor === Flavors.STD_CRITS || flavor === Flavors.STD_CRITS_STRICT)
      ) {
        row.push(
          botchPercent,
          sucessPercent,
          rest[0],
          rest[1],
          rest[2],
          failPercent
        );
      } else {
        row.push(botchPercent, sucessPercent, failPercent);
      }
    }

    return row;
  });

  return buildBaseRows(
    { targetNumber, flavor },
    requiredSuccessesToDisplay
  ).concat(filledRows);
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
