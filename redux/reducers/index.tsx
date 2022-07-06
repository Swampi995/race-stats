import { combineReducers } from 'redux';

import carReducer from './carReducer';
import pastRunsReducer from './pastRunsReducer';

const rootReducer = combineReducers({
  carReducer,
  pastRunsReducer,
});

export default rootReducer;
