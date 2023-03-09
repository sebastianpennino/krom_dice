import { validDiceMappers } from "../types/constants.js";
import {
  DiceRollAggregatorFn,
  diceRollCellEntry,
  DiceRollAggregatorVersusFn,
} from "../types/validValues.js";
import { aggregator, versusAggregator } from "../utils/aggregators.js";
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
  homeDiceroll: diceRollCellEntry
) => {
  const { numDice, diceFaces, targetNumber, requiredSuccesses, flavor } =
    homeDiceroll;
  console.log(
    `** Simulating ${rolls} of ${numDice}d${diceFaces} ** [TN: ${targetNumber}] (R: ${requiredSuccesses}) **`
  );
  const mappingFn = validDiceMappers[flavor];
  const faces = generateDiceFacesWithWeightValues(
    diceFaces,
    targetNumber,
    mappingFn
  );
  const { miss, botch, hit, crits } = aggregator(
    rolls,
    numDice,
    faces,
    requiredSuccesses,
    flavor
  );
  let mappedCrits = [""];

  if (crits && Array.isArray(crits)) {
    mappedCrits = crits.map((n) => {
      if (n) {
        return Number(n / rolls).toFixed(3);
      }
      return "0.00";
    });
  }

  return [
    Number(botch / rolls).toFixed(3),
    Number(hit / rolls).toFixed(3),
    Number(miss / rolls).toFixed(3),
    ...mappedCrits,
  ];
};

export const simulateVersusRollGroup: DiceRollAggregatorVersusFn = (
  rolls,
  homeDiceroll,
  awayDiceroll,
  config
) => {
  const {
    numDice: hND,
    diceFaces: hDF,
    targetNumber: hTN,
    flavor: hFlavor,
  } = homeDiceroll;
  const {
    numDice: aND,
    diceFaces: aDF,
    targetNumber: aTN,
    flavor: aFlavor,
  } = awayDiceroll;
  console.log(
    `** Sim ${rolls} of home: < ${hND}d${hDF} ** [TN: ${hTN}] > vs < ${aND}d${aDF} ** [TN: ${aTN}] >`
  );
  const homeMappingFn = validDiceMappers[hFlavor];
  const homeFaces = generateDiceFacesWithWeightValues(hDF, hTN, homeMappingFn);
  const awayMappingFn = validDiceMappers[aFlavor];
  const awayFaces = generateDiceFacesWithWeightValues(aDF, aTN, awayMappingFn);

  const { homeWin, awayWin, others } = versusAggregator(
    rolls,
    { numDice: hND, faces: homeFaces, requiredSuccesses: 1, flavor: hFlavor },
    { numDice: aND, faces: awayFaces, requiredSuccesses: 1, flavor: aFlavor },
    config
  );

  return [
    Number(homeWin / rolls).toFixed(3),
    Number(awayWin / rolls).toFixed(3),
    Number(others / rolls).toFixed(3),
  ];
};
