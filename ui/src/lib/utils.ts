import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// temporary USE ENV VARIABLE
export const API_ROUTE = "https://instapc.co/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalize(str: string): string {
  return str[0].toUpperCase() + str.slice(1)
}