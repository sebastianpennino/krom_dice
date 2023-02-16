import { diceRoll } from "../dice/diceRoll.js";
import { Flavors, DiceFaceT, validSolvers } from "../types/constants.js";
import { validWeightResults, ThrownDiceResults, VersusAggregatorFn } from "../types/validValues.js";
import { versusBaseSolver } from "./solvers.js";


export type AggregatorFn = (
  rolls: number,
  numDice: number,
  faces: validWeightResults[],
  requiredSuccesses: number,
  flavor: Flavors
) => ThrownDiceResults;

export const countResults = (
  roll: validWeightResults[]
): { good: number; bad: number } => {
  return roll.reduce(
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
    { good: 0, bad: 0 }
  );
};

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

  const solver = validSolvers[flavor];

  while (rolls > 0) {
    const extraRoll = diceRoll(1, faces);
    const currentRoll = diceRoll(numDice, faces);
    const { good, bad } = countResults(currentRoll);

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
