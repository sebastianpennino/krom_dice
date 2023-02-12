/**
 * Different solver functions
 */
import { DiceFaceT, FlavorMapFnResolver } from "../types/constants.js";
import {
  AggregatorFn,
  defaultVersusCfg,
  SolverFn,
  SolverRefObj,
  validWeightResults,
  VersusAggregatorFn,
  versusCfg,
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
    const extraRoll = diceRoll(1, faces);
    const currentRoll = diceRoll(numDice, faces);
    const good = currentRoll.filter((r: validWeightResults) => {
      return r === DiceFaceT.S || r === DiceFaceT.SS;
    }).length;
    const bad = currentRoll.filter((r: validWeightResults) => {
      return r === DiceFaceT.B;
    }).length;

    // Solver will calculate and add to ref.miss, ref.botch and ref.successArr
    solver(ref, good, bad, numDice, requiredSuccesses, extraRoll);

    rolls--;
  }

  const hit = ref.successArr.reduce((acc: number, cur: number) => acc + cur, 0);
  const compare = ref.miss + ref.botch + hit;

  if (compare !== ref.totalRolls) {
    throw new Error(`Missing cases! ${compare} != ${ref.totalRolls}`);
  }

  return { miss: ref.miss, botch: ref.botch, hit };
};

/**
 * Different solver functions to determine the result of a group of dices
 */

/** Kane with badluck dice */
export const crisSolverExtraBotchFn: SolverFn = (
  ref,
  good,
  bad,
  nd,
  rs,
  cc
) => {
  if (cc[0] === DiceFaceT.B) {
    ref.botch++;
  } else {
    if (good >= rs) {
      // success
      ref.successArr[good - 1]++;
    } else {
      ref.miss++;
    }
  }
};

/* standard with badluck dice */
export const stdSolverExtraBotchFn: SolverFn = (ref, good, bad, nd, rs, cc) => {
  if (cc[0] === DiceFaceT.B) {
    ref.botch++;
  } else {
    const rst = good - bad;

    if (rst >= 0) {
      if (rst >= rs) {
        ref.successArr[rst - 1]++;
      } else {
        ref.miss++;
      }
    } else {
      ref.miss++;
    }
  }
};

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
  const threshold = Math.ceil(nd / 2);

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

export const versusAggregator: VersusAggregatorFn = (
  rolls,
  hEntry,
  aEntry,
  config
) => {
  const ref: any = {
    totalRolls: rolls,
    homeWin: 0,
    awayWin: 0,
    others: 0,
  };

  const { numDice: hND, faces: hFaces, flavor: hFlavor } = hEntry;

  const { numDice: aND, faces: aFaces, flavor: aFlavor } = aEntry;

  while (rolls > 0) {
    const homeRoll = diceRoll(hND, hFaces);
    const awayRoll = diceRoll(aND, aFaces);

    // Same solver for now
    let {
      good: hgood,
      extraGood: hcrit,
      bad: hbad,
    } = versusBaseSolver(homeRoll);
    let {
      good: agood,
      extraGood: acrit,
      bad: abad,
    } = versusBaseSolver(awayRoll);

    if (config.criticalAreDouble) {
      hcrit = hcrit * 2;
      acrit = acrit * 2;
    }

    const countHome = hgood + hcrit - hbad;
    const countAway = agood + acrit - abad;

    // Resolve as a single event composed of two throws
    if (config.resolveAsContestFirst) {
      // Checking for the away team first
      if (countAway - countHome >= config.challengerRequiredDiff) {
        ref.awayWin++;
      } else {
        ref.homeWin++;
      }
    } else {
      const rst = hgood + hcrit - hbad;
      // only check after 1 hit (1 RS)
      if (rst >= 1) {
        if (countAway - countHome >= config.challengerRequiredDiff) {
          ref.awayWin++;
        } else {
          ref.homeWin++;
        }
      } else {
        ref.others++;
      }
    }

    rolls--;
  }

  const compare = ref.awayWin + ref.homeWin + ref.others;

  if (compare !== ref.totalRolls) {
    throw new Error(`Missing cases! ${compare} != ${ref.totalRolls}`);
  }

  return { homeWin: ref.homeWin, awayWin: ref.awayWin, others: ref.others };
};

const versusBaseSolver = (
  homeRoll: validWeightResults[]
): { good: number; extraGood: number; bad: number } => {
  return homeRoll.reduce(
    (acc, dice) => {
      if (dice === DiceFaceT.S) {
        acc.good++;
      }
      if (dice === DiceFaceT.SS) {
        acc.good++;
      }
      if (dice === DiceFaceT.B) {
        acc.bad++;
      }
      return acc;
    },
    { good: 0, extraGood: 0, bad: 0 }
  );
};
