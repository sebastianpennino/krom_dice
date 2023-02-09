import { Flavors } from "./types/constants.js";
import {
  checkAndCreateDirectory,
  createCSV,
  createCSVContent,
} from "./utils/csvBuild.js";

const makeTheCompleteCSVTable = (
  simulations: number,
  diceFaces: number,
  targetNumber: number,
  flavor: Flavors
) => {
  console.log(`*** ${flavor} - TN:${targetNumber} ***`);
  const dir = `./build/${flavor}/`;

  const direction: Record<number, string> = {
    3: "Left",
    4: "Right",
    5: "Left",
    6: "Right",
    7: "Left",
    8: "Right",
    9: "Right",
  };

  // const file = `${flavor}_d${diceFaces}_${direction[targetNumber]}.csv`;
  const file = `${flavor}_d${diceFaces}_unified.csv`;

  checkAndCreateDirectory(dir);

  const table = createCSVContent(simulations, diceFaces, targetNumber, flavor);
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

runSingleFlavor(Flavors.STD)
// runAllFlavors()
