import React from 'react';
import { Col, Button } from 'reactstrap'
import * as actions from '../../actions/quesAction'
import store from '../../store';
import '../App.css';

async function clickA(){
    console.log("clickA")
    await store.dispatch(actions.getQues());
}

async function clickB(){
    console.log("clickB")
    await store.dispatch(actions.getQues());
}

async function clickC(){
    console.log("clickC")
    await store.dispatch(actions.getQues());
}

const QuesArea = (accQues) => {
    console.log(accQues.ques)
    return(
        <Col className = "box_color" xs="8">
            <div className="margin_box ">
                {/* question */}
                <div className = "question"> 
                    <Col className = "user_account">
                        <h5><strong>Your account :</strong> {accQues.acc.account}</h5>
                        <p><strong>Balance :</strong> {accQues.acc.balance} <strong>ETH</strong></p>
                    </Col>
                    <Col className = "question_box">
                        <div className ="question_position">
                            <h1>{accQues.ques.question}</h1>
                        </div>
                    </Col>
                </div>
                {/* answer */}
                <Col className = "question">
                    <div className = "answer_position">
                        <Col >
                            <Button onClick={clickA} className = "answer_box" outline color="primary">
                                A. {accQues.ques.answer[0]}
                            </Button>
                        </Col>                                        
                        <Col >
                            <Button onClick={clickB} className = "answer_box" outline color="primary">
                                B. {accQues.ques.answer[1]}
                            </Button>                            
                        </Col>
                        <Col >
                            <Button onClick={clickC} className = "answer_box" outline color="primary">
                                C. {accQues.ques.answer[2]}
                            </Button>                            
                        </Col>
                    </div>                                    
                </Col>
            </div>
        </Col>
    ) 
}

export default QuesArea;