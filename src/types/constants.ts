import {
  bobSolverFn2,
  cacho25SolverFn2,
  cacho50SolverFn2,
  kaneCrisSolver,
  crisEBFn2,
  f25SolverFnNewSolverFn2,
  frank50SSolverFn2,
  kaneSolver,
  NewSolverFn,
  rSolverFnNewSolverFn2,
  stdSolverEBFn2,
  stdSolver,
} from "../utils/solverFn.js";
import { baseMapFn, dsMapFn, plusMapFn } from "../utils/mapFn.js";
import { MappingFn } from "./validValues.js";

export enum Flavors {
  STD = "std",
  PLUS = "plus",
  DS = "darksouls",
  KANE = "kane",
  KANECRIS = "kane-c",
  KANECRISDS = "kane-cds",
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

export enum DiceResults {
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
  [Flavors.KANECRISDS]: dsMapFn,
  [Flavors.CC]: baseMapFn,
  [Flavors.SCC]: baseMapFn,
  [Flavors.FRANK25]: baseMapFn,
  [Flavors.FRANK50S]: baseMapFn,
  [Flavors.BOB]: baseMapFn,
  [Flavors.RACHEL]: dsMapFn, // pifia 2
};

export const FlavorMapFnResolver2: Record<Flavors, NewSolverFn> = {
  [Flavors.STD]: stdSolver,
  [Flavors.PLUS]: stdSolver,
  [Flavors.DS]: stdSolver,
  [Flavors.KANE]: kaneSolver,
  [Flavors.KANEDS]: kaneSolver,
  [Flavors.CACHO25]: cacho25SolverFn2,
  [Flavors.CACHO50]: cacho50SolverFn2,
  [Flavors.KANECRIS]: kaneCrisSolver,
  [Flavors.KANECRISDS]: kaneCrisSolver,
  [Flavors.CC]: crisEBFn2,
  [Flavors.SCC]: stdSolverEBFn2,
  [Flavors.FRANK25]: f25SolverFnNewSolverFn2,
  [Flavors.FRANK50S]: frank50SSolverFn2,
  [Flavors.BOB]: bobSolverFn2,
  [Flavors.RACHEL]: rSolverFnNewSolverFn2,
};
