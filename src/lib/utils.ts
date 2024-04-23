import { type ClassValue, clsx } from "clsx";
import { startOfToday, subDays, subMonths } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeWords(str: string) {
  return str
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
}

export function findStartDate(timeframe: number) {
  const timeframes = ["1D", "7D", "14D", "1M"];
  let startDate;
  const today = startOfToday();
  switch (timeframes[timeframe]) {
    case "1D":
      startDate = subDays(today, 1);
      break;
    case "7D":
      startDate = subDays(today, 7);
      break;
    case "14D":
      startDate = subDays(today, 14);
      break;
    case "1M":
      startDate = subMonths(today, 1);
      break;
    default:
      startDate = subMonths(today, 1);
      break;
  }
  return startDate;
}

export function compressNumber(num: number): string {
  const billion = 1e9;
  const million = 1e6;
  const thousand = 1e3;

  if (Math.abs(num) >= billion) {
    return (num / billion).toFixed(2) + "B";
  } else if (Math.abs(num) >= million) {
    return (num / million).toFixed(2) + "M";
  } else if (Math.abs(num) >= thousand) {
    return (num / thousand).toFixed(2) + "K";
  } else {
    return num.toString();
  }
}
