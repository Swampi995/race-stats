import * as storage from '../../services/storage'

export type CarReducerAction = {
  type: 'SET_CARS';
  cars: storage.CarsObject;
} | {
  type: 'ADD_CAR';
  id: string;
  name: string;
  color: string;
  weight: string;
} | {
  type: 'SET_SELECTED_CAR';
  key: string;
} | {
  type: 'SET_IS_METRIC';
  key: boolean;
} | {
  type: 'SET_SPEED';
  key: number;
};

export interface CarReducerState {
  selectedKey: string;
  cars: storage.CarsObject;
  isMetric: boolean;
  speed: number;
}

export interface CarReducer {
  carReducer: CarReducerState;
}

const initialState: CarReducerState = {
  selectedKey: '',
  cars: {},
  isMetric: true,
  speed: 0,
};

const carReducer = (state: CarReducerState = initialState, action: CarReducerAction) => {
  switch (action.type) {
    case 'SET_CARS': {
      state = { ...state, cars: { ...action.cars }}
      return state;
    }
    case 'ADD_CAR': {
      const newCar: storage.CarStats = {
        name: action.name,
        color: action.color,
        weight: action.weight,
        topSpeed: 0,
        bestQuarterMileAcceleration: 0,
        best100Acceleration: 0,
        best160Acceleration: 0,
      }

      state = { ...state, cars: { ...state.cars, [action.id]: { ...newCar }}}
      return state;
    }
    case 'SET_SELECTED_CAR': {
      state = { ...state, selectedKey: action.key };
      return state;
    }
    case 'SET_IS_METRIC': {
      state = { ...state, isMetric: action.key };
      return state;
    }
    case 'SET_SPEED': {
      state = { ...state, speed: action.key };
      return state;
    }
    default:
      return state;
  }
};

export default carReducer;
