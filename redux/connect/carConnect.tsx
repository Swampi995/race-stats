import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import * as storage from '../../services/storage'

import { CarReducerAction, CarReducer } from '../reducers/carReducer';

export interface CarReduxState {
  selectedCar: storage.CarStats;
  selectedKey: string;
  isMetric: boolean;
  speed: number;
  cars: storage.CarsObject;
}

export interface CarReduxActions {
  setSelectedCar(key: string): void;
  setIsMetric(key: boolean): void;
  setSpeed(key: number): void;
  setCars(cars: storage.CarsObject): void;
  addCar(id: string, name: string, color: string, weight: string): void;
}

export interface CarReduxProps extends CarReduxState, CarReduxActions {
}

const emptyCar: storage.CarStats = {
  name: '',
  color: '',
  weight: '',
  topSpeed: 0,
  bestQuarterMileAcceleration: 0,
  best100Acceleration: 0,
  best160Acceleration: 0,
}

const mapStateToProps = (state: CarReducer) => {
  return {
    selectedCar: state.carReducer.cars[state.carReducer.selectedKey] || emptyCar,
    selectedKey: state.carReducer.selectedKey,
    isMetric: state.carReducer.isMetric,
    speed: state.carReducer.speed,
    cars: state.carReducer.cars,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<CarReducerAction>) => {
    return {
      setSelectedCar: (key: string) => dispatch({
        type: 'SET_SELECTED_CAR',
        key,
      }),
      setIsMetric: (key: boolean) => dispatch({
        type: 'SET_IS_METRIC',
        key,
      }),
      setSpeed: (key: number) => dispatch({
        type: 'SET_SPEED',
        key,
      }),
      setCars: (cars: storage.CarsObject) => dispatch({
        type: 'SET_CARS',
        cars
      }),
      addCar: (id: string, name: string, color: string, weight: string) => dispatch({
        type: 'ADD_CAR',
        id,
        name,
        color,
        weight,
      })
   };
};

export const carConnect = connect(mapStateToProps, mapDispatchToProps);
