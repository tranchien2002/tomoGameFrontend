import React from 'react';
import '../App.css';
import { Col, Button } from 'reactstrap'

const QuesArea = ({ques}) => {
    
            <Col key={ques.id} className = "box_color" xs="8">
                <div className="margin_box ">
                    {/* question */}
                    <div className = "question"> 
                        <Col className = "user_account">
                            <h5><strong>Your account :</strong> {this.state.account}</h5>
                            <p><strong>Balance :</strong> {this.state.balance} <strong>ETH</strong></p>
                        </Col>
                        <Col className = "question_box">
                            <div className ="question_position">
                                <h1>{ques.question}</h1>
                            </div>
                        </Col>
                    </div>
                    {/* answer */}
                    <Col className = "question">
                        <div className = "answer_position">
                            <Col >
                                <Button className = "answer_box" outline color="primary">
                                    A. {ques.answer[0]}
                                </Button>
                            </Col>                                        
                            <Col >
                                <Button className = "answer_box" outline color="primary">
                                    B. {ques.answer[1]}
                                </Button>
                            </Col>
                            <Col >
                                <Button className = "answer_box" outline color="primary">
                                    C. {ques.answer[2]}
                                </Button>
                            </Col>
                        </div>                                    
                    </Col>
                </div>
            </Col>
    
}

export default QuesArea;