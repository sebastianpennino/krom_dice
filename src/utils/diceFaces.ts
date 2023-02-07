import { MappingFn, validNumericWeightsResults, validWeightResults } from "../types/validValues.js";

/**
 * Returns an array with a secuence of numbers, starting with 1
 * for example with faces = 6 will generate [ 1, 2, 3, 4, 5, 6 ]
 * @param faces number of faces needed in the dice
 * @returns
 */
export const generateDiceFaces = (faces: number): number[] => {
  const arr: number[] = [];
  for (let i = 0; i < faces; i++) {
    arr[i] = i + 1;
  }
  return arr;
};

/**
 * This functions returns an array of values based on the mapping function,
 * those values are more helpful that the number on the face of a dice
 *
 * @param faces number of faces in the dice
 * @param targetNumber the value that needs to be reach to consider a face a success
 * @param mapFn a mapping function that will determine if a face is a failure, success and/or botch
 * @returns
 */
export const generateDiceFacesWithWeightValues = (
  faces: number,
  targetNumber: number,
  mappingFn: MappingFn
) => {
  if (faces <= 0) {
    return [];
  }
  if (typeof mappingFn !== "function") {
    throw new Error("");
  }

  // starts at 1 so for example with faces = 6 will generate [ 1, 2, 3, 4, 5, 6 ]
  return Array.from({ length: faces }, (_, i) => i + 1).map((val) => {
    return mappingFn(val, targetNumber);
  });
};
