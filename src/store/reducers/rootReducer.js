import quesReducer from './quesReducer';
import rankReducer from './rankReducer';
import { combineReducers } from 'redux';
import { firestoreReducer } from 'redux-firestore';
import accountReducer from './accountReducer';

const rootReducer = combineReducers({
    account: accountReducer,
    ques: quesReducer,
    rank: rankReducer,
    firestore: firestoreReducer
})

export default rootReducer