/**
 * Different mapper functions to determine the faces of a dice
 */

import { DiceFaceT } from "../types/constants.js";
import { MappingFn } from "../types/validValues.js";


/** Base mapper, ones are always botch, only TN or up is a success */
export const baseMapFn: MappingFn = (val, targetNumber) => {
  if (val === 1) {
    return DiceFaceT.B;
  } else if (val < targetNumber) {
    return DiceFaceT.F;
  } else {
    return DiceFaceT.S;
  }
};

/** Used by Plus, tens are a double-success */
export const plusMapFn: MappingFn = (val, targetNumber) => {
  if (val === 10) {
    return DiceFaceT.SS; // plus 10 --> 2 success
  }
  return baseMapFn(val, targetNumber);
};

/** Used by DS and Kane-DS, two is also a botch */
export const dsMapFn: MappingFn = (val, targetNumber) => {
  if (val == 2) {
    return DiceFaceT.B;
  }
  return baseMapFn(val, targetNumber)
}
