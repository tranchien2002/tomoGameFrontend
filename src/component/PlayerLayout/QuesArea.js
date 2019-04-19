import React from 'react';
import { Col, Button } from 'reactstrap'
import * as actions from '../../actions/quesAction'
import store from '../../store';
import '../App.css';

const clickA = (answer)=> {
    if(answer === 0){
        console.log("Dung");
        store.dispatch(actions.getQues());
    }else {
        console.log("Sai");
        store.dispatch(actions.getQues());
    }
    
}

function clickB(answer){
    if(answer === 1){
        console.log("Dung");
        store.dispatch(actions.getQues());
    }else {
        store.dispatch(actions.getQues());
        console.log("Sai");
    }
}

function clickC(answer){
    if(answer === 2){
        console.log("Dung");
        store.dispatch(actions.getQues());
    }else {
        console.log("Sai");
        store.dispatch(actions.getQues());
    }
}

const QuesArea = (accQues) => {
    const answer = accQues.ques.correct;
    const key = Object.keys(accQues.ques).slice(-1)[0]
    return(
        <Col className = "box_color" xs="8">
            <div className="margin_box ">
                <div className = "question"> 
                    <Col className = "user_account">
                        <h5><strong>Your account :</strong> {accQues.acc.account}</h5>
                        <p><strong>Balance :</strong> {accQues.acc.balance} <strong>ETH</strong></p>
                    </Col>
                    <Col className = "question_box">
                        <div className ="question_position">
                            <h1>{accQues.ques[key].question}</h1>
                        </div>
                    </Col>
                </div>
                <Col className = "question">
                    <div className = "answer_position">
                        <Col >
                            <Button onClick={(e) => clickA(answer)} className = "answer_box" outline color="primary">
                                A. {accQues.ques[key].answer[0]}
                            </Button>
                        </Col>                                        
                        <Col >
                            <Button onClick={(e) => clickB(answer)} className = "answer_box" outline color="primary">
                                B. {accQues.ques[key].answer[1]}
                            </Button>                            
                        </Col>
                        <Col >
                            <Button onClick={(e) => clickC(answer)} className = "answer_box" outline color="primary">
                                C. {accQues.ques[key].answer[2]}
                            </Button>                            
                        </Col>
                    </div>                                    
                </Col>
            </div>
        </Col>
    )
}

export default QuesArea;