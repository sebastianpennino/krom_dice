import { FlavorMapFnRecord, Flavors } from "../types/constants.js";
import { DiceRollAggregatorFn } from "../types/validValues.js";
import { aggregator } from "./solverFn.js";
import { generateDiceFacesWithWeightValues } from "./diceFaces.js";

export const randomIntFromInterval = (min = 1, max = 6) => {
  return Math.floor(Math.random() * (max - min + 1) + min); // min and max included
};

export const getRandomValueFromArray = <T>(facesArr: Array<T>) => {
  const i = randomIntFromInterval(0, facesArr.length - 1);
  return facesArr[i];
};

export const diceRoll = <T>(numDice: number, diceFaces: Array<T>) => {
  const results = [];
  for (let i = 0; i < numDice; i++) {
    results[i] = getRandomValueFromArray(diceFaces);
  }
  return results;
};

export const simulateRollGroup: DiceRollAggregatorFn = (
  rolls,
  numDice,
  diceFaces,
  targetNumber,
  requiredSuccesses,
  flavor = Flavors.STD
) => {
  console.log(
    `** Simulating ${rolls} of ${numDice}d${diceFaces} ** [TN: ${targetNumber}] (R: ${requiredSuccesses}) **`
  );
  const mappingFn = FlavorMapFnRecord[flavor];
  const faces = generateDiceFacesWithWeightValues(
    diceFaces,
    targetNumber,
    mappingFn
  );
  const { miss, botch, hit } = aggregator(
    rolls,
    numDice,
    faces,
    requiredSuccesses,
    flavor
  );
  return [
    Number(botch / rolls).toFixed(3),
    Number(hit / rolls).toFixed(3),
    Number(miss / rolls).toFixed(3),
  ];
};
