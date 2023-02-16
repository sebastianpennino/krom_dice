/**
 * Different solver functions
 */
import {
  DiceFaceT,
  DiceResults,
  FlavorMapFnResolver2,
  Flavors,
} from "../types/constants.js";
import {
  validWeightResults,
  VersusAggregatorFn,
} from "../types/validValues.js";
import { diceRoll } from "./diceRoll.js";

export type ThrownDiceResults = {
  miss: number;
  botch: number;
  hit: number;
};

export type AggregatorFn = (
  rolls: number,
  numDice: number,
  faces: validWeightResults[],
  requiredSuccesses: number,
  flavor: Flavors
) => ThrownDiceResults;

export type NewSolverFn = (
  roll: validWeightResults[],
  good: number,
  bad: number,
  rs: number,
  extraRoll?: validWeightResults[]
) => ThrownDiceResults;

// Base loop, flavor agnostic
export const aggregator: AggregatorFn = (
  rolls,
  numDice,
  faces,
  requiredSuccesses,
  flavor
) => {
  const ref = {
    totalRolls: rolls,
    miss: 0,
    botch: 0,
    hit: 0,
  };

  // Different solvers based on flavor
  const solver = FlavorMapFnResolver2[flavor];

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
    const { miss, hit, botch } = solver(
      currentRoll,
      good,
      bad,
      requiredSuccesses,
      extraRoll
    );

    ref.miss += miss;
    ref.botch += botch;
    ref.hit += hit;

    rolls--;
  }

  const compare = ref.miss + ref.botch + ref.hit;

  if (compare !== ref.totalRolls) {
    throw new Error(`Missing cases! ${compare} != ${ref.totalRolls}`);
  }

  return { miss: ref.miss, botch: ref.botch, hit: ref.hit };
};

/**
 * Different solver functions to determine the result of a group of dices
 */

const baseReturnObj = {
  [DiceResults.Hit]: 0,
  [DiceResults.Miss]: 0,
  [DiceResults.Botch]: 0,
};

/** Kane with badluck dice */
export const crisEBFn2: NewSolverFn = (roll, good, bad, rs, extraRoll) => {
  const ref = { ...baseReturnObj };

  if (extraRoll && extraRoll[0] === DiceFaceT.B) {
    ref[DiceResults.Botch]++;
  } else {
    if (good >= rs) {
      // success
      ref[DiceResults.Hit]++;
    } else {
      ref[DiceResults.Miss]++;
    }
  }
  return ref;
};

/* standard with badluck dice */
export const stdSolverEBFn2: NewSolverFn = (roll, good, bad, rs, extraRoll) => {
  const ref = { ...baseReturnObj };
  if (extraRoll && extraRoll[0] === DiceFaceT.B) {
    ref[DiceResults.Botch]++;
  } else {
    const rst = good - bad;

    if (rst >= 0) {
      if (rst >= rs) {
        ref[DiceResults.Hit]++;
      } else {
        ref[DiceResults.Miss]++;
      }
    } else {
      ref[DiceResults.Miss]++;
    }
  }
  return ref;
};

/** Base implementation */
export const stdSolver: NewSolverFn = (roll, good, bad, rs) => {
  const ref = { ...baseReturnObj };
  const rst = good - bad;

  if (rst >= 0) {
    if (rst >= rs) {
      ref[DiceResults.Hit]++;
    } else {
      ref[DiceResults.Miss]++;
    }
  } else {
    ref[DiceResults.Botch]++;
  }
  return ref;
};

/** kane: don't substract, check for good case first */
export const kaneSolver: NewSolverFn = (roll, good, bad, rs) => {
  const ref = { ...baseReturnObj };
  if (good >= rs) {
    ref[DiceResults.Hit]++;
  } else if (good === 0 && bad > 0) {
    ref[DiceResults.Botch]++;
  } else {
    ref[DiceResults.Miss]++;
  }
  return ref;
};

export const kaneCrisSolver: NewSolverFn = (roll, good, bad, rs) => {
  const ref = { ...baseReturnObj };
  if (good >= rs) {
    // success
    ref[DiceResults.Hit]++;
  } else {
    // not-success
    if (bad > 0) {
      ref[DiceResults.Botch]++;
    } else {
      ref[DiceResults.Miss]++;
    }
  }
  return ref;
};

export const rSolverFnNewSolverFn2: NewSolverFn = (roll, good, bad, rs) => {
  const ref = { ...baseReturnObj };
  const threshold = Math.ceil(roll.length / 2);

  if (good >= rs) {
    // success
    ref[DiceResults.Hit]++;
  } else {
    // not-success
    if (bad >= threshold) {
      ref[DiceResults.Botch]++;
    } else {
      ref[DiceResults.Miss]++;
    }
  }
  return ref;
};

export const f25SolverFnNewSolverFn2: NewSolverFn = (roll, good, bad, rs) => {
  const ref = { ...baseReturnObj };
  // threshold adjusted to number of thrown dice
  const thresholdCacho25 = roll.length > 4 ? Math.ceil(roll.length / 4) : 1;

  if (good >= rs) {
    // success
    ref[DiceResults.Hit]++;
  } else {
    // threshold 1-4 (1) 5-8 (2)
    if (bad >= thresholdCacho25) {
      ref[DiceResults.Botch]++;
    } else {
      ref[DiceResults.Miss]++;
    }
  }
  return ref;
};

export const cacho25SolverFn2: NewSolverFn = (roll, good, bad, rs) => {
  const ref = { ...baseReturnObj };
  // Cacho25: at least 25% of the dice are "P" --> automatic ref.botch
  // 1 to 4 --> 1 dice=1 --> ref.botch // 5 to 8 --> 2 dice=1 --> ref.botch
  const thresholdCacho25 = roll.length > 4 ? Math.ceil(roll.length / 4) : 1;

  if (bad >= thresholdCacho25) {
    ref[DiceResults.Botch]++;
  } else {
    if (good >= rs) {
      ref[DiceResults.Hit]++;
    } else {
      ref[DiceResults.Miss]++;
    }
  }
  return ref;
};

export const cacho50SolverFn2: NewSolverFn = (roll, good, bad, rs) => {
  const ref = { ...baseReturnObj };
  // Cacho50: at least 50% of the dice are "P" --> automatic ref.botch
  // 1 to 2 --> 1 dice=1 --> ref.botch // 3 to 4 --> 2 dice=1 --> ref.botch
  const thresholdCacho50 = roll.length > 2 ? Math.ceil(roll.length / 2) : 1;

  if (bad >= thresholdCacho50) {
    ref[DiceResults.Botch]++;
  } else {
    if (good >= rs) {
      ref[DiceResults.Hit]++;
    } else {
      ref[DiceResults.Miss]++;
    }
  }

  return ref;
};

export const bobSolverFn2: NewSolverFn = (roll, good, bad, rs) => {
  const ref = { ...baseReturnObj };
  const bob = rs > 1 ? Math.ceil(rs / 2) : 1;

  // Check for botch FIRST
  if (bad >= bob) {
    ref[DiceResults.Botch]++;
  } else {
    if (good >= rs) {
      ref[DiceResults.Hit]++;
    } else {
      ref[DiceResults.Miss]++;
    }
  }
  return ref;
};

export const frank50SSolverFn2: NewSolverFn = (roll, good, bad, rs) => {
  const ref = { ...baseReturnObj };
  const thresholdF50S = rs > 2 ? Math.ceil(roll.length / 2) : 1;

  if (good >= rs) {
    ref[DiceResults.Hit]++;
  } else {
    // threshold 1-2 (1) 3-4 (2) and so on...
    if (bad >= thresholdF50S) {
      ref[DiceResults.Botch]++;
    } else {
      ref[DiceResults.Miss]++;
    }
  }
  return ref;
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
