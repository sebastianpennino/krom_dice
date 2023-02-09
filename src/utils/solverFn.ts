/**
 * Different solver functions
 */
import { DiceFaceT, FlavorMapFnResolver } from "../types/constants.js";
import {
  AggregatorFn,
  SolverFn,
  SolverRefObj,
  validWeightResults,
} from "../types/validValues.js";
import { diceRoll } from "./diceRoll.js";

// Base loop, flavor agnostic
export const aggregator: AggregatorFn = (
  rolls,
  numDice,
  faces,
  requiredSuccesses,
  flavor
) => {
  const ref: SolverRefObj = {
    totalRolls: rolls,
    miss: 0,
    botch: 0,
    successArr: Array.from({ length: 50 }, function (_, i) {
      return 0;
    }),
  };

  // Different solvers based on flavor
  const solver = FlavorMapFnResolver[flavor];

  while (rolls > 0) {
    const currentRoll = diceRoll(numDice, faces);
    const good = currentRoll.filter((r: validWeightResults) => {
      return r === DiceFaceT.S;
    }).length;
    const bad = currentRoll.filter((r: validWeightResults) => {
      return r === DiceFaceT.B;
    }).length;

    // Solver will calculate and add to ref.miss, ref.botch and ref.successArr
    solver(ref, good, bad, numDice, requiredSuccesses);

    rolls--;
  }

  const hit = ref.successArr.reduce((acc: number, cur: number) => acc + cur, 0);
  const compare = ref.miss + ref.botch + hit

  if (compare !== ref.totalRolls) {
    throw new Error(
      `Missing cases! ${compare} != ${ref.totalRolls}`,
    );
  }

  return { miss: ref.miss, botch: ref.botch, hit };
};

/**
 * Different solver functions to determine the result of a group of dices
 */

/** Base implementation (standard) */
export const stdSolverFn: SolverFn = (ref, good, bad, nd, rs) => {
  const rst = good - bad;

  if (rst >= 0) {
    if (rst >= rs) {
      ref.successArr[rst - 1]++;
    } else {
      ref.miss++;
    }
  } else {
    ref.botch++;
  }
};

/** kane: don't substract, check for good case first */
export const kaneSolverFn: SolverFn = (ref, good, bad, nd, rs) => {
  if (good >= rs) {
    ref.successArr[good - 1]++;
  } else if (good === 0 && bad > 0) {
    ref.botch++;
  } else {
    ref.miss++;
  }
};

export const crisKaneSolverFn: SolverFn = (ref, good, bad, nd, rs) => {
  if (good >= rs) {
    // success
    ref.successArr[good - 1]++;
  } else {
    // not-success
    if (bad > 0) {
      ref.botch++;
    } else {
      ref.miss++;
    }
  }
};

export const rachelSolverFn: SolverFn = (ref, good, bad, nd, rs) => {
  const threshold = Math.ceil(nd / 2)

  if (good >= rs) {
    // success
    ref.successArr[good - 1]++;
  } else {
    // not-success
    if (bad >= threshold) {
      ref.botch++;
    } else {
      ref.miss++;
    }
  }
};


export const frank25SolverFn: SolverFn = (ref, good, bad, nd, rs) => {
  // threshold adjusted to number of thrown dice
  const thresholdCacho25 = nd > 4 ? Math.ceil(nd / 4) : 1;

  if (good >= rs) {
    // success
    ref.successArr[good - 1]++;
  } else {
    // threshold 1-4 (1) 5-8 (2)
    if (bad >= thresholdCacho25) {
      ref.botch++;
    } else {
      ref.miss++;
    }
  }
};

export const cacho25SolverFn: SolverFn = (ref, good, bad, nd, rs) => {
  // Cacho25: at least 25% of the dice are "P" --> automatic ref.botch
  // 1 to 4 --> 1 dice=1 --> ref.botch // 5 to 8 --> 2 dice=1 --> ref.botch
  const thresholdCacho25 = nd > 4 ? Math.ceil(nd / 4) : 1;

  if (bad >= thresholdCacho25) {
    ref.botch++;
  } else {
    if (good >= rs) {
      ref.successArr[good - 1]++;
    } else {
      ref.miss++;
    }
  }
};

export const cacho50SolverFn: SolverFn = (ref, good, bad, nd, rs) => {
  // Cacho50: at least 50% of the dice are "P" --> automatic ref.botch
  // 1 to 2 --> 1 dice=1 --> ref.botch // 3 to 4 --> 2 dice=1 --> ref.botch
  const thresholdCacho50 = nd > 2 ? Math.ceil(nd / 2) : 1;

  if (bad >= thresholdCacho50) {
    ref.botch++;
  } else {
    if (good >= rs) {
      ref.successArr[good - 1]++;
    } else {
      ref.miss++;
    }
  }
};

export const bobSolverFn: SolverFn = (ref, good, bad, nd, rs) => {
  // threshold is always two botch after the first required success
  const bob = rs > 1 ? Math.ceil(rs / 2) : 1;

  // Check for botch FIRST
  if (bad >= bob) {
    ref.botch++;
  } else {
    if (good >= rs) {
      ref.successArr[good - 1]++;
    } else {
      ref.miss++;
    }
  }
};

export const frank50SSolverFn: SolverFn = (ref, good, bad, nd, rs) => {
  const thresholdF50S = rs > 2 ? Math.ceil(nd / 2) : 1;
  if (good >= rs) {
    ref.successArr[good - 1]++;
  } else {
    // threshold 1-2 (1) 3-4 (2) and so on...
    if (bad >= thresholdF50S) {
      ref.botch++;
    } else {
      ref.miss++;
    }
  }
};
