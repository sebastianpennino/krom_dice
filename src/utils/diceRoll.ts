import {
  FlavorMapFnAggregator,
  FlavorMapFnRecord,
  Flavors,
} from "../types/constants.js";
import { DiceRollAggregatorFn } from "../types/validValues.js";
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

export const reduceNumericDiceRoll = (diceResultsArr: number[]) => {
  return diceResultsArr.reduce((acc: number, val: number) => {
    return acc + val;
  }, 0);
};

export const simulateRolls: DiceRollAggregatorFn = (
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
  const aggregatorFn = FlavorMapFnAggregator[flavor];
  const { miss, botch, hit } = aggregatorFn(
    rolls,
    numDice,
    faces,
    requiredSuccesses
  );

  return [
    Number(botch / rolls).toFixed(3),
    Number(hit / rolls).toFixed(3),
    Number(miss / rolls).toFixed(3)
  ]
};
