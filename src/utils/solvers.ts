/**
 * Different solver functions to determine the result of a group of dices
 */
import { DiceFaceT } from "../types/constants.js";
import { validWeightResults, ThrownDiceResults, baseReturnObj, DiceResults } from "../types/validValues.js";

export type SolverFn = (
  roll: validWeightResults[],
  good: number,
  bad: number,
  rs: number,
  extraRoll?: validWeightResults[]
) => ThrownDiceResults;


/** Kane with badluck dice */
export const crisEBFn2: SolverFn = (roll, good, bad, rs, extraRoll) => {
  const ref = { ...baseReturnObj };

  if (extraRoll && extraRoll[0] === DiceFaceT.B) {
    ref[DiceResults.BOTCH]++;
  } else {
    if (good >= rs) {
      // success
      ref[DiceResults.HIT]++;
    } else {
      ref[DiceResults.MISS]++;
    }
  }
  return ref;
};

/* standard with badluck dice */
export const stdCCSol: SolverFn = (roll, good, bad, rs, extraRoll) => {
  const ref = { ...baseReturnObj };
  if (extraRoll && extraRoll[0] === DiceFaceT.B) {
    ref[DiceResults.BOTCH]++;
  } else {
    const rst = good - bad;

    if (rst >= 0) {
      if (rst >= rs) {
        ref[DiceResults.HIT]++;
      } else {
        ref[DiceResults.MISS]++;
      }
    } else {
      ref[DiceResults.MISS]++;
    }
  }
  return ref;
};

/** Base implementation */
export const stdSolver: SolverFn = (roll, good, bad, rs) => {
  const ref = { ...baseReturnObj };
  const rst = good - bad;

  if (rst >= 0) {
    if (rst >= rs) {
      ref[DiceResults.HIT]++;
    } else {
      ref[DiceResults.MISS]++;
    }
  } else {
    ref[DiceResults.BOTCH]++;
  }
  return ref;
};

/** kane: don't substract, check for good case first */
export const kaneSolver: SolverFn = (roll, good, bad, rs) => {
  const ref = { ...baseReturnObj };
  if (good >= rs) {
    ref[DiceResults.HIT]++;
  } else if (good === 0 && bad > 0) {
    ref[DiceResults.BOTCH]++;
  } else {
    ref[DiceResults.MISS]++;
  }
  return ref;
};

export const kaneCrisSolver: SolverFn = (roll, good, bad, rs) => {
  const ref = { ...baseReturnObj };
  if (good >= rs) {
    // success
    ref[DiceResults.HIT]++;
  } else {
    // not-success
    if (bad > 0) {
      ref[DiceResults.BOTCH]++;
    } else {
      ref[DiceResults.MISS]++;
    }
  }
  return ref;
};

export const rachelSolver: SolverFn = (roll, good, bad, rs) => {
  const ref = { ...baseReturnObj };
  const threshold = Math.ceil(roll.length / 2);

  if (good >= rs) {
    // success
    ref[DiceResults.HIT]++;
  } else {
    // not-success
    if (bad >= threshold) {
      ref[DiceResults.BOTCH]++;
    } else {
      ref[DiceResults.MISS]++;
    }
  }
  return ref;
};

export const frank25Sol: SolverFn = (roll, good, bad, rs) => {
  const ref = { ...baseReturnObj };
  // threshold adjusted to number of thrown dice
  const thresholdCacho25 = roll.length > 4 ? Math.ceil(roll.length / 4) : 1;

  if (good >= rs) {
    // success
    ref[DiceResults.HIT]++;
  } else {
    // threshold 1-4 (1) 5-8 (2)
    if (bad >= thresholdCacho25) {
      ref[DiceResults.BOTCH]++;
    } else {
      ref[DiceResults.MISS]++;
    }
  }
  return ref;
};

export const cacho25Sol: SolverFn = (roll, good, bad, rs) => {
  const ref = { ...baseReturnObj };
  // Cacho25: at least 25% of the dice are "P" --> automatic ref.botch
  // 1 to 4 --> 1 dice=1 --> ref.botch // 5 to 8 --> 2 dice=1 --> ref.botch
  const thresholdCacho25 = roll.length > 4 ? Math.ceil(roll.length / 4) : 1;

  if (bad >= thresholdCacho25) {
    ref[DiceResults.BOTCH]++;
  } else {
    if (good >= rs) {
      ref[DiceResults.HIT]++;
    } else {
      ref[DiceResults.MISS]++;
    }
  }
  return ref;
};

export const cacho50Sol: SolverFn = (roll, good, bad, rs) => {
  const ref = { ...baseReturnObj };
  // Cacho50: at least 50% of the dice are "P" --> automatic ref.botch
  // 1 to 2 --> 1 dice=1 --> ref.botch // 3 to 4 --> 2 dice=1 --> ref.botch
  const thresholdCacho50 = roll.length > 2 ? Math.ceil(roll.length / 2) : 1;

  if (bad >= thresholdCacho50) {
    ref[DiceResults.BOTCH]++;
  } else {
    if (good >= rs) {
      ref[DiceResults.HIT]++;
    } else {
      ref[DiceResults.MISS]++;
    }
  }

  return ref;
};

export const bobSolver: SolverFn = (roll, good, bad, rs) => {
  const ref = { ...baseReturnObj };
  const bob = rs > 1 ? Math.ceil(rs / 2) : 1;

  // Check for botch FIRST
  if (bad >= bob) {
    ref[DiceResults.BOTCH]++;
  } else {
    if (good >= rs) {
      ref[DiceResults.HIT]++;
    } else {
      ref[DiceResults.MISS]++;
    }
  }
  return ref;
};

export const frank50Sol: SolverFn = (roll, good, bad, rs) => {
  const ref = { ...baseReturnObj };
  const thresholdF50S = rs > 2 ? Math.ceil(roll.length / 2) : 1;

  if (good >= rs) {
    ref[DiceResults.HIT]++;
  } else {
    // threshold 1-2 (1) 3-4 (2) and so on...
    if (bad >= thresholdF50S) {
      ref[DiceResults.BOTCH]++;
    } else {
      ref[DiceResults.MISS]++;
    }
  }
  return ref;
};

export const versusBaseSolver = (
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
