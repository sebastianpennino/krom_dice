import { Flavors } from "./types/constants.js";
import {
  checkAndCreateDirectory,
  createCSV,
  createCSVContent,
} from "./utils/csvBuild.js";

const simulations = 1_000_000;
const diceFaces = 10;
const targetNumber = 3;
const flavor = Flavors.KANECRIS;

const makeTheCompleteCSVTable = (
  simulations: number,
  diceFaces: number,
  targetNumber: number,
  flavor: Flavors
) => {
  const dir = `./build/${flavor}/`;
  const file = `${flavor}_d${diceFaces}_TN${targetNumber}.csv`;

    checkAndCreateDirectory(dir)

    const table = createCSVContent(
      simulations,
      diceFaces,
      targetNumber,
      flavor
    );
    const csvContent = table.map((e) => e.join(",")).join("\n");

    createCSV(dir, file, csvContent);
};

// makeTheCompleteCSVTable(simulations, diceFaces, targetNumber, flavor);

for (let jj = 3; jj < 10; jj++) {
  makeTheCompleteCSVTable(simulations, diceFaces, jj, flavor);
}
