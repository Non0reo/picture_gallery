import { EasingParam } from "animejs";
import { Mouse } from "../types"

// x, y then left (Order matters !)
export const defaultMouse: Mouse = { 
  x: 0,
  y: 0,
  left: false,
}


type AdditionalInputOOptions = { duration?: number, ease?: EasingParam };

export type Position = { x: number, y: number };
export type Size = { width: number, height: number };

export type PositionInputO = Position & AdditionalInputOOptions;
export type SizeInputO = Size & AdditionalInputOOptions;

// export type PositionInputs = PositionInputO | [number, number];
// export type SizeInputs = SizeInputO | [number, number];

export type Input<T> = (T & AdditionalInputOOptions) | number[];
export type ArrayForm = [number | undefined, EasingParam | undefined, ...number[]];

export const arrayForm = <T>(value: (T & AdditionalInputOOptions) | number[]): ArrayForm => 
  Array.isArray(value) ? [1000, 'outExpo', ...value] : inputOToArray(value);


const inputOToArray = <T extends AdditionalInputOOptions>(input: T) => {
  // delete input.duration;
  // delete input.ease;
  // return Object.values(input) as number[];

  const { duration, ease } = { duration: 1000, ease: 'outExpo', ...input};
  return [duration, ease, ...Object.values(input)] as ArrayForm
    // as [...number[], number | undefined, EasingParam | undefined]
}

// export const objectForm = <T>(value: (T & AdditionalInputOOptions) | [number, number]) =>
//   Array.isArray(value) ? value : inputOToArray(value);

// const inputToObject = <T>(input: number[]): T & AdditionalInputOOptions => {
//   let object = Object.entries(input);


//   return {

//     duration: undefined,
//     ease: undefined,
//   }
// }