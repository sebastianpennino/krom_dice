/**
 * Different mapper functions to determine the faces of a dice
 */
import { DiceFaceT } from "../types/constants.js";
import { MappingFn } from "../types/validValues.js";

/** basic letter map function (returns P, F, S) */
export const baseMapFn: MappingFn = (val, targetNumber) => {
  if (val === 1) {
    return DiceFaceT.B;
  } else if (val < targetNumber) {
    return DiceFaceT.F;
  } else {
    return DiceFaceT.S;
  }
};

/** used by Plus */
export const plusMapFn: MappingFn = (val, targetNumber) => {
  if (val === 10) {
    return DiceFaceT.SS; // plus 10 --> 2 success
  }
  return baseMapFn(val, targetNumber);
};

/** used by DS and Kane-DS */
export const dsMapFn: MappingFn = (val, targetNumber) => {
  if (val == 2) {
    return DiceFaceT.B;
  }
  return baseMapFn(val, targetNumber)
}
