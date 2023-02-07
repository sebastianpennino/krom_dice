/**
 * Different aggregator functions
 */
import { AggregatorFn, validWeightResults } from "../types/validValues.js";
import { reduceNumericDiceRoll, diceRoll } from "./diceRoll.js";

export const cacho25LetterAggregatorFn: AggregatorFn = (
  rolls,
  numDice,
  faces,
  requiredSuccesses
) => {
  let fail = 0,
    botch = 0;
  const successArr = Array.from({ length: 50 }, function (_, i) { return 0; }); // just to be sure

  // Cacho25: at least 25% of the dice are "P" --> automatic botch
  // 1 to 4 --> 1 dice=1 --> botch // 5 to 8 --> 2 dice=1 --> botch
  const thresholdCacho25 = numDice > 4 ? Math.ceil(numDice/4) : 1

  while (rolls > 0) {
    const currentRoll = diceRoll(numDice, faces);
    const good = currentRoll.filter((r: validWeightResults) => {
      return r === "S";
    }).length;
    const bad = currentRoll.filter((r: validWeightResults) => {
      return r === "P";
    }).length;

    if(bad >= thresholdCacho25) {
      botch++;
    } else {
      if (good >= requiredSuccesses) {
        successArr[good - 1]++;
      } else {
        fail++;
      }
    }

    rolls--;
  }

  const sucess = successArr.reduce((acc, cur) => acc + cur, 0);

  return { fail, botch, sucess };
};

export const cacho50LetterAggregatorFn: AggregatorFn = (
  rolls,
  numDice,
  faces,
  requiredSuccesses
) => {
  let fail = 0,
    botch = 0;
  const successArr = Array.from({ length: 50 }, function (_, i) { return 0; }); // just to be sure

  // Cacho50: at least 50% of the dice are "P" --> automatic botch
  // 1 to 2 --> 1 dice=1 --> botch // 3 to 4 --> 2 dice=1 --> botch
  const thresholdCacho50 = numDice > 2 ? Math.ceil(numDice/2) : 1

  while (rolls > 0) {
    const currentRoll = diceRoll(numDice, faces);
    const good = currentRoll.filter((r: validWeightResults) => {
      return r === "S";
    }).length;
    const bad = currentRoll.filter((r: validWeightResults) => {
      return r === "P";
    }).length;

    if(bad >= thresholdCacho50) {
      botch++;
    } else {
      if (good >= requiredSuccesses) {
        successArr[good - 1]++;
      } else {
        fail++;
      }
    }

    rolls--;
  }

  const sucess = successArr.reduce((acc, cur) => acc + cur, 0);

  return { fail, botch, sucess };
};

export const baseLetterAggregatorFn: AggregatorFn = (
  rolls,
  numDice,
  faces,
  requiredSuccesses
) => {
  let fail = 0,
    botch = 0;
  const successArr = Array.from({ length: 50 }, function (_, i) { return 0; }); // just to be sure

  // KANE: any dice=1 doesn't substract success.
  // botch occurs if no success is present and at least one dice is a one
  // (KANE-DS: same but with one and two)
  while (rolls > 0) {
    const currentRoll = diceRoll(numDice, faces);
    const good = currentRoll.filter((r: validWeightResults) => {
      return r === "S";
    }).length;
    const bad = currentRoll.filter((r: validWeightResults) => {
      return r === "P";
    }).length;

    if (good >= requiredSuccesses) {
      successArr[good - 1]++;
    } else if (good === 0 && bad > 0) {
      botch++;
    } else {
      fail++;
    }

    rolls--;
  }

  const sucess = successArr.reduce((acc, cur) => acc + cur, 0);

  return { fail, botch, sucess };
};

export const baseAggregatorFn: AggregatorFn = (
  rolls,
  numDice,
  faces,
  requiredSuccesses
) => {
  let fail = 0,
    botch = 0;
  const successArr = Array.from({ length: 50 }, function (_, i) { return 0; }); // just to be sure

  while (rolls > 0) {
    const rst: number = reduceNumericDiceRoll(diceRoll(numDice, faces));

    if (rst >= requiredSuccesses) {
      successArr[rst - 1]++;
    } else if (rst === 0) {
      fail++;
    } else {
      botch++;
    }

    rolls--;
  }

  const sucess = successArr.reduce((acc, cur) => acc + cur, 0);

  return { fail, botch, sucess };
};