import { getDistance } from 'geolib';

export function inRange(x: number, min: number, max: number): boolean {
  return ((x-min)*(x-max) <= 0);
}

export function timeToSeconds(initial: number, final: number): number {
  return (final - initial) / 1000;
}

interface PointLocation {
  latitude: number;
  longitude: number;
}

export function distangeBetweenPoints(initial: PointLocation, final: PointLocation): number {
  return getDistance(initial, final)
}
