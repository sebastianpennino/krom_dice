import { DiceFaceT, Flavors } from "./constants.js";

export type validWeightResults =
  | DiceFaceT.B
  | DiceFaceT.F
  | DiceFaceT.S
  | DiceFaceT.SS;

export type MappingFn = (
  val: number,
  targetNumber: number
) => validWeightResults;

export type AggregatorFn = (
  rolls: number,
  numDice: number,
  faces: validWeightResults[],
  requiredSuccesses: number,
  flavor: Flavors
) => AggregatorFnReturn;

export type SolverRefObj = {
  totalRolls: number;
  miss: number;
  botch: number;
  successArr: number[];
};

export type NewSolverFn = (
  roll: validWeightResults[],
  good: number,
  bad: number,
  rs: number,
  extraRoll?: validWeightResults[]
) => {
  hit: number;
  miss: number;
  botch: number;
};

export type SolverFn = (
  ref: SolverRefObj,
  good: number,
  bad: number,
  nd: number,
  rs: number,
  cc?: any
) => void;

export type AggregatorFnReturn = {
  miss: number;
  botch: number;
  hit: number;
};

type diceRollEntry = {
  numDice: number;
  faces: validWeightResults[];
  requiredSuccesses: number;
  flavor: Flavors;
};

export type VersusAggregatorFnReturn = {
  homeWin: number;
  awayWin: number;
  others: number;
};

export type versusCfg = {
  resolveAsContestFirst: boolean;
  criticalAreDouble: boolean;
  challengerRequiredDiff: number;
  title?: string;
};

export type VersusAggregatorFn = (
  rolls: number,
  hEntry: diceRollEntry,
  aEtry: diceRollEntry,
  config: versusCfg
) => VersusAggregatorFnReturn;

export type diceRollCellEntry = {
  numDice: number;
  diceFaces: number;
  targetNumber: number;
  requiredSuccesses: number;
  flavor: Flavors;
};

export type DiceRollAggregatorFn = (
  rolls: number,
  homeDiceroll: diceRollCellEntry
) => string[];

export type DiceRollAggregatorVersusFn = (
  rolls: number,
  homeDiceroll: diceRollCellEntry,
  awayDiceroll: diceRollCellEntry,
  config: versusCfg
) => string[];

export const defaultVersusCfg: versusCfg = {
  resolveAsContestFirst: false,
  criticalAreDouble: false,
  challengerRequiredDiff: 0,
};
