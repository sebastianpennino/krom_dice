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
  baseMapFn,
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

export const FlavorMapFnRecord: Record<Flavors, MappingFn> = {
  [Flavors.STD]: baseNumMapFn,
  [Flavors.PLUS]: plusMapFn,
  [Flavors.DS]: dsMapFn,
  [Flavors.KANE]: baseMapFn,
  [Flavors.KANEDS]: kaneDsMapFn,
  [Flavors.CACHO25]: baseMapFn,
  [Flavors.CACHO50]: baseMapFn,
  [Flavors.KANECRIS]: baseMapFn,
  [Flavors.FRANK25]: baseMapFn,
  [Flavors.FRANK50S]: baseMapFn,
  [Flavors.BOB]: baseMapFn,
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
