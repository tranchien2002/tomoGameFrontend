export const insertQues = (question) =>{
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
        firestore.collection('player_question').add({
            ...question,
            question: question.question ,
            correct: question.correct,
            answer :question.answer
        }).then(()=>{
            dispatch({ 
                type : 'INSERT_QUES', 
            })
        }).catch(err =>{
            dispatch({ type: 'INSERT_QUES_ERROR' }, err);
        })
        
    }
};