import quesReducer from './quesReducer';
import rankReducer from './rankReducer';
import { combineReducers } from 'redux';
import { firestoreReducer } from 'redux-firestore';

const rootReducer = combineReducers({
    ques: quesReducer,
    rank: rankReducer,
    firestore: firestoreReducer
})

export default rootReducer