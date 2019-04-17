import React from 'react';
import '../App.css';
import { Button } from 'reactstrap'

const Adminselectques = (question) => {
    // console.log(question)
    return(
        <Button className = "answer_box " outline color="primary" >{question.ques}</Button>
    ) 
}

export default Adminselectques;