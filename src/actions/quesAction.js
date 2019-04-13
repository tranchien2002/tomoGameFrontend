export const createQues = (ques) =>{
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        //make async to database
        dispatch({ 
            type : 'GET_QUES', 
            ques
        })
    }
};