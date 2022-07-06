import AsyncStorage from '@react-native-async-storage/async-storage';

const STATS_KEY_PREFIX = 'box-stats-';

export const REVIEWD = 'reviewed';
export const CARS_IDS = 'cars-object';
export const SELECTED_KEY = 'selected-car-key';
export const IS_METRIC_KEY = 'is-metric-key';
export const PAST_RUNS = 'past-runs';

export interface CarProps {
  name: string;
  color: string;
  weight: string;
}

export interface CarStatsProps {
  topSpeed: number;
  bestQuarterMileAcceleration: number;
  best100Acceleration: number;
  best160Acceleration: number;
}

export interface CarStats extends CarProps, CarStatsProps {
}

export interface CarsObject {
  [id: string]: CarStats;
}

export interface PastRunsProps {
  type: '100' | '160' | 'QuarterMile';
  date: Date;
  speed: number;
  time: number;
  altitude: number;
  distance: number;
  graph: {
    speed: number[];
    time: number[];
  };
}

export interface PastRunsObject {
  [date: number]: PastRunsProps;
}

export const defaultCar: CarsObject = {
  default: {
    name: 'default',
    color: 'default',
    weight: '1500',
    topSpeed: 0,
    bestQuarterMileAcceleration: 0,
    best100Acceleration: 0,
    best160Acceleration: 0,
  }
}

export async function storeData(key: string, data: Object | number | string) {
  try {
    await AsyncStorage.setItem(`${STATS_KEY_PREFIX}${key}`, JSON.stringify(data));
  } catch (error) {
    return;
  }
};

export async function retrieveData<C>(key: string) {
  try {
    const value = await AsyncStorage.getItem(`${STATS_KEY_PREFIX}${key}`);
    if (value !== null) {
      return JSON.parse(value) as C;
    }
  } catch (error) {
    return;
  }
};
