export const insertQues = (question) =>{
    return async (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
        
        let querySnapshot = await firestore.collection('player_question').get()
            await querySnapshot.forEach(async (doc) =>{

                await firestore.collection('player_question').add({
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

                await firestore.collection('player_question').doc(doc.id).delete()
                .then(function() {
                    console.log("Document successfully deleted!");
                }).catch(function(error) {
                    console.error("Error removing document: ", error);
                });
            });
        

        
        
    }
};