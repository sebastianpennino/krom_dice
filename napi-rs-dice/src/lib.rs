#![deny(clippy::all)]

#[macro_use]
extern crate napi_derive;

use rand::{thread_rng, Rng};

#[napi]
pub fn random_int_from_interval(min: i32, max: i32) -> i32 {
  let mut rng = thread_rng();
  let n: i32 = rng.gen_range(min..=max);
  return n
}

pub fn get_random_element<T: Clone>(elements: &[T]) -> Option<T> {
  if elements.is_empty() {
      return None;
  }
  let rnd_idx = random_int_from_interval(0, elements.len() as i32 - 1) as usize;
  return Some(elements[rnd_idx].clone())
}

pub fn dice_roll<T: Clone>(num_dice: usize, dice_faces: &[T]) -> Vec<T> {
  let mut results = Vec::with_capacity(num_dice);
  for _ in 0..num_dice {
      results.push(get_random_element(dice_faces).unwrap().clone());
  }
  return results
}

// #[napi]
// pub fn get_random_element<T: Clone>(elements: &[T]) -> Option<T> {
//   if elements.is_empty() {
//       return None;
//   }
//   let rnd_idx = random_int_from_interval(0, elements.len() as i32 - 1);
//   return Some(elements[rnd_idx as usize].clone())
// }

// #[napi]
// pub fn dice_roll<T: Clone>(num_dice: i32, dice_faces: &[T]) -> Vec<T> {
//   let mut results = Vec::with_capacity(num_dice as usize);
//   for _ in 0..num_dice {
//       results.push(get_random_element(dice_faces).unwrap().clone());
//   }
//   return results
// }

#[napi]
pub fn test_two() {
  let df = vec!['B', 'F', 'F', 'F', 'F', 'F', 'F', 'S', 'S', 'S'];
  let rst = dice_roll(3, &df);
  println!("Results: {:?}", rst);
}

