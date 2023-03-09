import { Flavors } from "./types/constants.js";
import {
  checkAndCreateDirectory,
  createCSV,
  createBasicCSVContent,
  createVersusCSVContent,
} from "./file/csvBuild.js";
import { testTwo } from "../napi-rs-dice/index.js";

const makeTheCompleteCSVTable = (
  simulations: number,
  diceFaces: number,
  targetNumber: number,
  flavor: Flavors
) => {
  console.log(`*** ${flavor} - TN:${targetNumber} ***`);
  const dir = `./build/out/${flavor}/`;
  const file = `${flavor}_d${diceFaces}_unified.csv`;

  checkAndCreateDirectory(dir);

  const table = createBasicCSVContent(
    simulations,
    diceFaces,
    targetNumber,
    flavor,
    4
  );
  const csvContent = table.map((e) => e.join(",")).join("\n");

  createCSV(dir, file, "\n" + csvContent);
};

const simulations = 1_000_000;
const diceFaces = 10;

const runAllFlavors = () => {
  Object.values({ ...Flavors }).forEach((flavor: Flavors) => {
    for (let targetN = 3; targetN < 10; targetN++) {
      makeTheCompleteCSVTable(simulations, diceFaces, targetN, flavor);
    }
  });
};

const runSingleFlavor = (flavor: Flavors = Flavors.STD) => {
  const startTN = 3;
  const maxTN = 9;

  for (let targetN = startTN; targetN <= maxTN; targetN++) {
    makeTheCompleteCSVTable(simulations, diceFaces, targetN, flavor);
  }
};

const makeTheCompleteVersusCSVTable = (
  simulations: number,
  diceFaces: number,
  homeTargetNumber: number,
  awayTargetNumber: number,
  flavorHome: Flavors,
  flavorAway: Flavors
) => {
  console.log(
    `*** hTN:${homeTargetNumber} (${flavorHome}) vs aTN:${awayTargetNumber} (${flavorAway}) ***`
  );
  const dir = `./build/out/${flavorHome}-${flavorAway}/`;
  const file = `_d${diceFaces}_versus.csv`;

  checkAndCreateDirectory(dir);

  const table = createVersusCSVContent(
    simulations,
    diceFaces,
    homeTargetNumber,
    awayTargetNumber,
    flavorHome,
    flavorAway
  );
  const csvContent = table.map((e) => e.join(",")).join("\n");

  createCSV(dir, file, "\n" + csvContent);
};

const runVersus = () => {
  const simulations = 1_000_000;
  const diceFaces = 10;

  for (let homeTN = 5; homeTN <= 8; homeTN++) {
    for (let awayTN = 5; awayTN <= 8; awayTN++) {
      makeTheCompleteVersusCSVTable(
        simulations,
        diceFaces,
        homeTN,
        awayTN,
        Flavors.STD,
        Flavors.STD
      );
    }
  }
};

// testTwo()
runSingleFlavor(Flavors.STD_WITH_CRITS);
// runAllFlavors()
// runVersus()
