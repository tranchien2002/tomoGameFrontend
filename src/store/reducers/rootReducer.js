import quesReducer from './quesReducer'
import rankReducer from './rankReducer'
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    ques: quesReducer,
    rank: rankReducer
})

export default rootReducer