/**
 * Different aggregator functions
 */
import { DiceFaceT } from "../types/constants.js";
import { AggregatorFn, validWeightResults } from "../types/validValues.js";
import { reduceNumericDiceRoll, diceRoll } from "./diceRoll.js";

export const cacho25LetterAggregatorFn: AggregatorFn = (
  rolls,
  numDice,
  faces,
  requiredSuccesses
) => {
  let miss = 0,
    botch = 0;
  const successArr = Array.from({ length: 50 }, function (_, i) {
    return 0;
  }); // just to be sure
  const totalRolls = rolls;

  // Cacho25: at least 25% of the dice are "P" --> automatic botch
  // 1 to 4 --> 1 dice=1 --> botch // 5 to 8 --> 2 dice=1 --> botch
  const thresholdCacho25 = numDice > 4 ? Math.ceil(numDice / 4) : 1;

  while (rolls > 0) {
    const currentRoll = diceRoll(numDice, faces);
    const good = currentRoll.filter((r: validWeightResults) => {
      return r === DiceFaceT.S;
    }).length;
    const bad = currentRoll.filter((r: validWeightResults) => {
      return r === DiceFaceT.B;
    }).length;

    if (bad >= thresholdCacho25) {
      botch++;
    } else {
      if (good >= requiredSuccesses) {
        successArr[good - 1]++;
      } else {
        miss++;
      }
    }

    rolls--;
  }

  const hit = successArr.reduce((acc, cur) => acc + cur, 0);

  if (miss + botch + hit !== totalRolls) {
    throw new Error(`Missing cases! ${miss + botch + hit - totalRolls}`);
  }

  return { miss, botch, hit };
};

export const cacho50LetterAggregatorFn: AggregatorFn = (
  rolls,
  numDice,
  faces,
  requiredSuccesses
) => {
  let miss = 0,
    botch = 0;
  const successArr = Array.from({ length: 50 }, function (_, i) {
    return 0;
  }); // just to be sure
  const totalRolls = rolls;

  // Cacho50: at least 50% of the dice are "P" --> automatic botch
  // 1 to 2 --> 1 dice=1 --> botch // 3 to 4 --> 2 dice=1 --> botch
  const thresholdCacho50 = numDice > 2 ? Math.ceil(numDice / 2) : 1;

  while (rolls > 0) {
    const currentRoll = diceRoll(numDice, faces);
    const good = currentRoll.filter((r: validWeightResults) => {
      return r === DiceFaceT.S;
    }).length;
    const bad = currentRoll.filter((r: validWeightResults) => {
      return r === DiceFaceT.B;
    }).length;

    if (bad >= thresholdCacho50) {
      botch++;
    } else {
      if (good >= requiredSuccesses) {
        successArr[good - 1]++;
      } else {
        miss++;
      }
    }

    rolls--;
  }

  const hit = successArr.reduce((acc, cur) => acc + cur, 0);

  if (miss + botch + hit !== totalRolls) {
    throw new Error(`Missing cases! ${miss + botch + hit - totalRolls}`);
  }

  return { miss, botch, hit };
};

export const bobAggregatorFn: AggregatorFn = (
  rolls,
  numDice,
  faces,
  requiredSuccesses
) => {
  let miss = 0,
    botch = 0;
  const successArr = Array.from({ length: 50 }, function (_, i) {
    return 0;
  }); // just to be sure
  const totalRolls = rolls;

  // threshold is always two botch after the first success
  const t100 = requiredSuccesses > 1 ? Math.ceil(requiredSuccesses/2) : 1;

  
  while (rolls > 0) {
    const currentRoll = diceRoll(numDice, faces);
    const good = currentRoll.filter((r: validWeightResults) => {
      return r === DiceFaceT.S;
    }).length;
    const bad = currentRoll.filter((r: validWeightResults) => {
      return r === DiceFaceT.B;
    }).length;

    // Check for botch FIRST
    if (bad >= t100) {
      botch++;
    } else {
      if (good >= requiredSuccesses) {
        successArr[good - 1]++;
      } else {
        miss++;
      }
    }

    rolls--;
  }

  const hit = successArr.reduce((acc, cur) => acc + cur, 0);

  if (miss + botch + hit !== totalRolls) {
    throw new Error(`Missing cases! ${miss + botch + hit - totalRolls}`);
  }

  return { miss, botch, hit };
};

export const frank50SpecialAggregatorFn: AggregatorFn = (
  rolls,
  numDice,
  faces,
  requiredSuccesses
) => {
  let miss = 0,
    botch = 0;
  const successArr = Array.from({ length: 50 }, function (_, i) {
    return 0;
  }); // just to be sure
  const totalRolls = rolls;

  // threshold adjusted to number of required success
  const thresholdCacho50S = requiredSuccesses > 2 ? Math.ceil(numDice / 2) : 1;

  // KANE: any dice=1 doesn't substract success.
  // botch occurs if theres at least one bad dice AND the number of required successes was not reach
  while (rolls > 0) {
    const currentRoll = diceRoll(numDice, faces);
    const good = currentRoll.filter((r: validWeightResults) => {
      return r === DiceFaceT.S;
    }).length;
    const bad = currentRoll.filter((r: validWeightResults) => {
      return r === DiceFaceT.B;
    }).length;

    if (good >= requiredSuccesses) {
      // success
      successArr[good - 1]++;
    } else {
      // threshold 1-2 (1) 3-4 (2) ...
      if (bad >= thresholdCacho50S) {
        botch++;
      } else {
        miss++;
      }
    }

    rolls--;
  }

  const hit = successArr.reduce((acc, cur) => acc + cur, 0);

  if (miss + botch + hit !== totalRolls) {
    throw new Error(`Missing cases! ${miss + botch + hit - totalRolls}`);
  }

  return { miss, botch, hit };
};

export const frank25AggregatorFn: AggregatorFn = (
  rolls,
  numDice,
  faces,
  requiredSuccesses
) => {
  let miss = 0,
    botch = 0;
  const successArr = Array.from({ length: 50 }, function (_, i) {
    return 0;
  }); // just to be sure
  const totalRolls = rolls;

  // threshold adjusted to number of thrown dice
  const thresholdCacho25 = numDice > 4 ? Math.ceil(numDice / 4) : 1;

  // KANE: any dice=1 doesn't substract success.
  // botch occurs if theres at least one bad dice AND the number of required successes was not reach
  while (rolls > 0) {
    const currentRoll = diceRoll(numDice, faces);
    const good = currentRoll.filter((r: validWeightResults) => {
      return r === DiceFaceT.S;
    }).length;
    const bad = currentRoll.filter((r: validWeightResults) => {
      return r === DiceFaceT.B;
    }).length;

    if (good >= requiredSuccesses) {
      // success
      successArr[good - 1]++;
    } else {
      // threshold 1-4 (1) 5-8 (2)
      if (bad >= thresholdCacho25) {
        botch++;
      } else {
        miss++;
      }
    }

    rolls--;
  }

  const hit = successArr.reduce((acc, cur) => acc + cur, 0);

  if (miss + botch + hit !== totalRolls) {
    throw new Error(`Missing cases! ${miss + botch + hit - totalRolls}`);
  }

  return { miss, botch, hit };
};

export const crisLetterAggregatorFn: AggregatorFn = (
  rolls,
  numDice,
  faces,
  requiredSuccesses
) => {
  let miss = 0,
    botch = 0;
  const successArr = Array.from({ length: 50 }, function (_, i) {
    return 0;
  }); // just to be sure
  const totalRolls = rolls;

  // KANE: any dice=1 doesn't substract success.
  // botch occurs if theres at least one bad dice AND the number of required successes was not reach
  while (rolls > 0) {
    const currentRoll = diceRoll(numDice, faces);
    const good = currentRoll.filter((r: validWeightResults) => {
      return r === DiceFaceT.S;
    }).length;
    const bad = currentRoll.filter((r: validWeightResults) => {
      return r === DiceFaceT.B;
    }).length;

    if (good >= requiredSuccesses) {
      // success
      successArr[good - 1]++;
    } else {
      // not-success
      if (bad > 0) {
        botch++;
      } else {
        miss++;
      }
    }

    rolls--;
  }

  const hit = successArr.reduce((acc, cur) => acc + cur, 0);

  if (miss + botch + hit !== totalRolls) {
    throw new Error(`Missing cases! ${miss + botch + hit - totalRolls}`);
  }

  return { miss, botch, hit };
};

export const baseLetterAggregatorFn: AggregatorFn = (
  rolls,
  numDice,
  faces,
  requiredSuccesses
) => {
  let miss = 0,
    botch = 0;
  const successArr = Array.from({ length: 50 }, function (_, i) {
    return 0;
  }); // just to be sure
  const totalRolls = rolls;

  // KANE: any dice=1 doesn't substract success.
  // botch occurs if no success is present and at least one dice is a one
  // (KANE-DS: same but with one and two)
  while (rolls > 0) {
    const currentRoll = diceRoll(numDice, faces);
    const good = currentRoll.filter((r: validWeightResults) => {
      return r === DiceFaceT.S;
    }).length;
    const bad = currentRoll.filter((r: validWeightResults) => {
      return r === DiceFaceT.B;
    }).length;

    if (good >= requiredSuccesses) {
      successArr[good - 1]++;
    } else if (good === 0 && bad > 0) {
      botch++;
    } else {
      miss++;
    }

    rolls--;
  }

  const hit = successArr.reduce((acc, cur) => acc + cur, 0);

  if (miss + botch + hit !== totalRolls) {
    throw new Error(`Missing cases! ${miss + botch + hit - totalRolls}`);
  }

  return { miss, botch, hit };
};

export const baseAggregatorFn: AggregatorFn = (
  rolls,
  numDice,
  faces,
  requiredSuccesses
) => {
  let miss = 0,
    botch = 0;
  const successArr = Array.from({ length: 50 }, function (_, i) {
    return 0;
  }); // just to be sure
  const totalRolls = rolls;

  while (rolls > 0) {
    const diceR = diceRoll(numDice, faces);
    const rst: number = reduceNumericDiceRoll(diceR);

    if (rst >= 0) {
      if (rst >= requiredSuccesses) {
        successArr[rst - 1]++;
      } else {
        miss++;
      }
    } else {
      botch++;
    }

    rolls--;
  }

  const hit = successArr.reduce((acc, cur) => acc + cur, 0);

  if (miss + botch + hit !== totalRolls) {
    throw new Error(`Missing cases! ${miss + botch + hit - totalRolls}`);
  }

  return { miss, botch, hit };
};
