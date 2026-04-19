import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function riskColor(level: string) {
  switch (level?.toUpperCase()) {
    case 'HIGH':
      return { bg: 'bg-crimson-50', text: 'text-crimson-700', border: 'border-crimson-200', dot: 'bg-crimson-500', bar: 'bg-crimson-500' };
    case 'MEDIUM':
      return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', dot: 'bg-amber-500', bar: 'bg-amber-500' };
    case 'LOW':
      return { bg: 'bg-forest-50', text: 'text-forest-700', border: 'border-forest-200', dot: 'bg-forest-500', bar: 'bg-forest-500' };
    default:
      return { bg: 'bg-stone-50', text: 'text-stone-700', border: 'border-stone-200', dot: 'bg-stone-400', bar: 'bg-stone-400' };
  }
}

export function confidenceLabel(level: string) {
  switch (level?.toUpperCase()) {
    case 'HIGH_CONFIDENCE': return 'High Confidence';
    case 'MEDIUM_CONFIDENCE': return 'Medium Confidence';
    case 'LOW_CONFIDENCE': return 'Low Confidence';
    default: return level;
  }
}
