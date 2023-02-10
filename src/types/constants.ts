import {
  bobSolverFn,
  cacho25SolverFn,
  cacho50SolverFn,
  crisKaneSolverFn,
  crisSolverExtraBotchFn,
  frank25SolverFn,
  frank50SSolverFn,
  kaneSolverFn,
  rachelSolverFn,
  stdSolverExtraBotchFn,
  stdSolverFn,
} from "../utils/solverFn.js";
import {
  baseMapFn,
  dsMapFn,
  plusMapFn,
} from "../utils/mapFn.js";
import { MappingFn, SolverFn } from "./validValues.js";

export enum Flavors {
  STD = "std",
  PLUS = "plus",
  DS = "darksouls",
  KANE = "kane",
  KANECRIS = "kane-c",
  CC = "kcc",
  SCC = "scc",
  KANEDS = "kane-ds",
  CACHO25 = "cacho25",
  CACHO50 = "cacho50",
  FRANK25 = "frank25",
  FRANK50S = "frank50S",
  BOB = "bob",
  RACHEL = "rachel",
}

export enum DiceFaceT {
  B = "blunder",
  S = "success",
  SS = "double_success",
  F = "fail",
}

export enum DiceResults  {
  Hit = "hit",
  Miss = "miss",
  Botch = "botch",
}

export const FlavorMapFnRecord: Record<Flavors, MappingFn> = {
  [Flavors.PLUS]: plusMapFn,
  [Flavors.DS]: dsMapFn,
  [Flavors.KANEDS]: dsMapFn,
  [Flavors.STD]: baseMapFn,
  [Flavors.KANE]: baseMapFn,
  [Flavors.CACHO25]: baseMapFn,
  [Flavors.CACHO50]: baseMapFn,
  [Flavors.KANECRIS]: baseMapFn,
  [Flavors.CC]: baseMapFn,
  [Flavors.SCC]: baseMapFn,
  [Flavors.FRANK25]: baseMapFn,
  [Flavors.FRANK50S]: baseMapFn,
  [Flavors.BOB]: baseMapFn,
  [Flavors.RACHEL]: dsMapFn, // pifia 2
};

export const FlavorMapFnResolver: Record<Flavors, SolverFn> = {
  [Flavors.STD]: stdSolverFn,
  [Flavors.PLUS]: stdSolverFn,
  [Flavors.DS]: stdSolverFn,
  [Flavors.KANE]: kaneSolverFn,
  [Flavors.KANEDS]: kaneSolverFn,
  [Flavors.CACHO25]: cacho25SolverFn,
  [Flavors.CACHO50]: cacho50SolverFn,
  [Flavors.KANECRIS]: crisKaneSolverFn,
  [Flavors.CC]: crisSolverExtraBotchFn,
  [Flavors.SCC]: stdSolverExtraBotchFn,
  [Flavors.FRANK25]: frank25SolverFn,
  [Flavors.FRANK50S]: frank50SSolverFn,
  [Flavors.BOB]: bobSolverFn,
  [Flavors.RACHEL]: rachelSolverFn,
};
