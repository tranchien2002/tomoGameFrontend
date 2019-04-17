export const getQues = () =>{
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const question = []
        const firestore = getFirestore();
        firestore.collection('project_hunter').get().then(snapshot =>{
            snapshot.docs.forEach(doc =>{
                question.push(doc.data())
            })
        })
        dispatch({ 
            type : 'GET_QUES', 
        })
    }
};