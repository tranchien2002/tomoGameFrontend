import React from 'react';
import '../App.css';
import { Col, Button } from 'reactstrap'

const Adminselectques = (question) => {
    return(
        <Button className = "answer_box " outline color="primary" >{question.ques}</Button>
    ) 
}

export default Adminselectques;