import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

type CallbackType = (location: Location.LocationObject) => void;

const LOCATION_SETTINGS = {
  timeInterval: 0,
  distanceInterval: 0,
  accuracy: 6,
};

const LOCATION_SETTINGS_GET = {
  timeInterval: 0,
  distanceInterval: 0,
};

export const EMPTY_LOCATION = {
  coords: {
    latitude: 0,
    longitude: 0,
    altitude: 0,
    accuracy: 0,
    heading: 0,
    speed: 0,
  },
  timestamp: 0,
};

export function requestPermissionsAsync() {
  return Location.requestForegroundPermissionsAsync();
}

export function hasServicesEnabledAsync() {
  return Location.hasServicesEnabledAsync();
}

export function watchPositionAsync(callback: CallbackType) {
  Location.watchPositionAsync(LOCATION_SETTINGS, (location) => callback(location));
}

export function getCurrentPositionAsync() {
  return Location.getCurrentPositionAsync(LOCATION_SETTINGS_GET);
}

export function convertSpeedToKMH(speed: number) {
  return Math.ceil(speed * 3.6);
}

export function convertSpeedToMPH(speed: number) {
  return Math.ceil(speed * 2.23694);
}

export async function setAccelerationTime() {
  try {
    await AsyncStorage.setItem('acceleration', 'I like to save it.');
  } catch (error) {
    // Error saving data
  }
}

export async function getAccelerationTime() {
  try {
    const value = await AsyncStorage.getItem('acceleration');
    if (value !== null) {
      // We have data!!
    }
  } catch (error) {
    // Error retrieving data
  }
}
