/**
 * Different mapper functions to determine the faces of a dice
 */
import { DiceFaceT } from "../types/constants.js";
import { MappingFn } from "../types/validValues.js";

/** basic letter map function (returns P, F, S) */
export const baseLetterMapFn: MappingFn = (val, targetNumber) => {
  if (val === 1) {
    return DiceFaceT.B;
  } else if (val < targetNumber) {
    return DiceFaceT.F;
  } else {
    return DiceFaceT.S;
  }
};

/** base numeric map function (returns -1 / 0 / 1) */
export const baseNumMapFn: MappingFn = (val, targetNumber) => {
  if (val === 1) {
    return -1;
  } else if (val < targetNumber) {
    return 0;
  } else {
    return 1;
  }
};

/** used by Plus */
export const plusMapFn: MappingFn = (val, targetNumber) => {
  if (val === 10) {
    return 2; // plus 10 --> 2 success
  }
  return baseNumMapFn(val, targetNumber);
};

/** used by DS */
export const dsMapFn: MappingFn = (val, targetNumber) => {
  if (val === 2) {
    // DS: 1 and 2 are botch!
    return -1;
  }
  return baseNumMapFn(val, targetNumber);
};

/** used by Kane-DS */
export const kaneDsMapFn: MappingFn = (val, targetNumber) => {
  if (val == 2) {
    return DiceFaceT.B;
  }
  return baseLetterMapFn(val, targetNumber)
}
