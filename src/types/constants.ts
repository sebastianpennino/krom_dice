import { baseAggregatorFn, baseLetterAggregatorFn, cacho25LetterAggregatorFn, cacho50LetterAggregatorFn, crisLetterAggregatorFn } from "../utils/aggregatorFn.js";
import { baseMapFn, baseNumMapFn, dsMapFn, kaneDsMapFn, plusMapFn } from "../utils/mapFn.js";
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
};
