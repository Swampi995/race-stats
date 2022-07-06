import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import * as storage from '../../services/storage'
import * as storageService from '../../services/storage/service'

import { PastRunsReducerAction, PastRunsReducer } from '../reducers/pastRunsReducer';

export interface PastRunsReduxState {
  pastRuns: storage.PastRunsObject;
}

export interface PastRunsReduxActions {
  setPastRuns(pastRuns: storage.PastRunsObject): void;
  addPastRun(pastRun: storage.PastRunsProps): void;
}

export interface PastRunsReduxProps extends PastRunsReduxState, PastRunsReduxActions {
}

function addPastRun(pastRun: storage.PastRunsProps) {
  return async (dispatch: Dispatch<PastRunsReducerAction>) => {
    await storageService.storePastRun(pastRun);
    const pastRuns = await storageService.getPastRuns();

    dispatch({
      type: 'SET_PAST_RUNS',
      pastRuns,
    });
  };
}

function setPastRuns(pastRuns: storage.PastRunsObject) {
  return (dispatch: Dispatch<PastRunsReducerAction>) => {
    dispatch({
      type: 'SET_PAST_RUNS',
      pastRuns,
    })
  };
}

const mapStateToProps = (state: PastRunsReducer) => {
  return {
    pastRuns: state.pastRunsReducer.pastRuns
  };
};

const mapDispatchToProps = (dispatch: Dispatch<PastRunsReducerAction>) => {
  return {
    setPastRuns(pastRuns: storage.PastRunsObject) {
      return dispatch(setPastRuns(pastRuns));
    },
    addPastRun(pastRun: storage.PastRunsProps) {
      return dispatch(addPastRun(pastRun));
    }
  };
};

export const pastRunsConnect = connect(mapStateToProps, mapDispatchToProps);
