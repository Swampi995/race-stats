import * as storage from '../../services/storage'

export type PastRunsReducerAction = {
  type: 'SET_PAST_RUNS';
  pastRuns: storage.PastRunsObject;
};

export interface PastRunsReducerState {
  pastRuns: any;
}

export interface PastRunsReducer {
  pastRunsReducer: PastRunsReducerState;
}

const initialState: PastRunsReducerState = {
  pastRuns: {}
};

const pastRunsReducer = (state: PastRunsReducerState = initialState, action: PastRunsReducerAction) => {
  switch (action.type) {
    case 'SET_PAST_RUNS': {
      state = { ...state, pastRuns: { ...action.pastRuns }}
      return state;
    }
    default:
      return state;
  }
};

export default pastRunsReducer;
