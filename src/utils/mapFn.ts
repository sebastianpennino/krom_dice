/**
 * Different mapper functions to determine the faces of a dice
 */
import { MappingFn } from "../types/validValues.js";

/** basic letter map function (returns P, F, S) */
export const baseMapFn: MappingFn = (val, targetNumber) => {
  if (val === 1) {
    return "P";
  } else if (val < targetNumber) {
    return "F";
  } else {
    return "S";
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

/** used by DS, KaneDS */
export const dsMapFn: MappingFn = (val, targetNumber) => {
  if (val === 2) {
    // DS: 1 and 2 are botch!
    return -1;
  }
  return baseNumMapFn(val, targetNumber);
};

export const kaneDsMapFn: MappingFn = (val, targetNumber) => {
  if (val == 2) {
    return "P";
  }
  return baseMapFn(val, targetNumber)
}
