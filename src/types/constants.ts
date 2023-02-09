import {
  baseAggregatorFn,
  baseLetterAggregatorFn,
  cacho25LetterAggregatorFn,
  cacho50LetterAggregatorFn,
  crisLetterAggregatorFn,
  bobAggregatorFn,
  frank25AggregatorFn,
  frank50SpecialAggregatorFn,
} from "../utils/aggregatorFn.js";
import {
  baseLetterMapFn,
  baseNumMapFn,
  dsMapFn,
  kaneDsMapFn,
  plusMapFn,
} from "../utils/mapFn.js";
import { AggregatorFn, MappingFn } from "./validValues.js";

export enum Flavors {
  STD = "std",
  PLUS = "plus",
  DS = "darksouls",
  KANE = "kane",
  KANECRIS = "kane-c",
  KANEDS = "kane-ds",
  CACHO25 = "cacho25",
  CACHO50 = "cacho50",
  FRANK25 = "frank25",
  FRANK50S = "frank50S",
  BOB = "bob",
}

export enum DiceFaceT {
  B = "blunder",
  S = "success",
  F = "fail",
}

export enum DiceResults  {
  Hit = "hit",
  Miss = "miss",
  Botch = "botch",
}

export const FlavorMapFnRecord: Record<Flavors, MappingFn> = {
  [Flavors.STD]: baseNumMapFn,
  [Flavors.PLUS]: plusMapFn,
  [Flavors.DS]: dsMapFn,
  [Flavors.KANE]: baseLetterMapFn,
  [Flavors.KANEDS]: kaneDsMapFn,
  [Flavors.CACHO25]: baseLetterMapFn,
  [Flavors.CACHO50]: baseLetterMapFn,
  [Flavors.KANECRIS]: baseLetterMapFn,
  [Flavors.FRANK25]: baseLetterMapFn,
  [Flavors.FRANK50S]: baseLetterMapFn,
  [Flavors.BOB]: baseLetterMapFn,
};

export const FlavorMapFnAggregator: Record<Flavors, AggregatorFn> = {
  [Flavors.STD]: baseAggregatorFn,
  [Flavors.PLUS]: baseAggregatorFn,
  [Flavors.DS]: baseAggregatorFn,
  [Flavors.KANE]: baseLetterAggregatorFn,
  [Flavors.KANEDS]: baseLetterAggregatorFn,
  [Flavors.CACHO25]: cacho25LetterAggregatorFn,
  [Flavors.CACHO50]: cacho50LetterAggregatorFn,
  [Flavors.KANECRIS]: crisLetterAggregatorFn,
  [Flavors.FRANK25]: frank25AggregatorFn,
  [Flavors.FRANK50S]: frank50SpecialAggregatorFn,
  [Flavors.BOB]: bobAggregatorFn,
};
