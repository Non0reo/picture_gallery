import { Mouse } from "../types"

// x, y then left (Order matters !)
export const defaultMouse: Mouse = { 
  x: 0,
  y: 0,
  left: false,
}

export const arrayForm = (value: { [key: string]: number } | number[]) => 
  Array.isArray(value) ? value : Object.values(value)