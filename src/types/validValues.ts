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

export type DiceRollAggregatorFn = (
  rolls: number,
  numDice: number,
  diceFaces: number,
  targetNumber: number,
  requiredSuccesses: number,
  flavor?: Flavors
) => string[];
