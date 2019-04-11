import React from 'react';
import '../App.css';
import { Col, Button } from 'reactstrap'

const QuesArea = (accQues) => {
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
                            <Button className = "answer_box" outline color="primary">
                                A. {accQues.ques.answer[0]}
                            </Button>
                        </Col>                                        
                        <Col >
                            <Button className = "answer_box" outline color="primary">
                                B. {accQues.ques.answer[1]}
                            </Button>
                        </Col>
                        <Col >
                            <Button className = "answer_box" outline color="primary">
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