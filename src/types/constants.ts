import { plusMapFn, dsMapFn, baseMapFn } from "../dice/diceMap.js";
import {
  SolverFn,
  stdSolver,
  kaneSolver,
  cacho25Sol,
  cacho50Sol,
  kaneCrisSolver,
  crisEBFn2,
  stdCCSol,
  frank25Sol,
  frank50Sol,
  bobSolver,
  rachelSolver,
} from "../utils/solvers.js";
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

export const validDiceMappers: Record<Flavors, MappingFn> = {
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
  [Flavors.RACHEL]: dsMapFn,
};

export const validSolvers: Record<Flavors, SolverFn> = {
  [Flavors.STD]: stdSolver,
  [Flavors.PLUS]: stdSolver,
  [Flavors.DS]: stdSolver,
  [Flavors.KANE]: kaneSolver,
  [Flavors.KANEDS]: kaneSolver,
  [Flavors.CACHO25]: cacho25Sol,
  [Flavors.CACHO50]: cacho50Sol,
  [Flavors.KANECRIS]: kaneCrisSolver,
  [Flavors.KANECRISDS]: kaneCrisSolver,
  [Flavors.CC]: crisEBFn2,
  [Flavors.SCC]: stdCCSol,
  [Flavors.FRANK25]: frank25Sol,
  [Flavors.FRANK50S]: frank50Sol,
  [Flavors.BOB]: bobSolver,
  [Flavors.RACHEL]: rachelSolver,
};
