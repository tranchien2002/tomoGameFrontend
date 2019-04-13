import React, { Component } from 'react'
import { Container, Col, Row, Button} from 'reactstrap'
// import '../../style/admin.css';
import Adminselectques from './Adminselectques'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import '../App.css'
import '../../style/admin.css'


class AdminLayout extends Component {

    constructor(props){
        super(props)
        this.state ={
            account : '0x0',
            balance : '',
        }
    }
    
    render() {   
        const {question} =this.props;
        console.log(question)
        return (   
            <div>
                <Container>
                    <Col className="set_height">
                        <div className = "margin_box">
                            <div>
                                <h1>Select the next question</h1>
                            </div>
                            <div className="admin_question_box">
                                    {/* <div className = "admin_quesbox">
                                            <Adminselectques ques ={question.question}/> 
                                    </div> */}
                                {/* {
                                    question && question.map(ques => (
                                        <div className = "admin_quesbox" key = {ques.id}>
                                            <Adminselectques ques ={ques.question}/> 
                                        </div>                                
                                ))} */}
                            </div>
                            <div className ="button_bounty">
                                <Row>
                                    <Col>
                                        <Button color="primary">Single Question</Button>
                                    </Col>
                                    <Col>
                                        <Button color="primary">All Bounty</Button>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Col>
                </Container>
            </div>
        );
    }
}

const mapStatetoProps = (state) => {
    // console.log(state.ques.questionID[0])

    const question = state.firestore.data.project_hunter
    const id = Math.floor(Math.random()*10);
    const quesID =state.ques.questionID[id];
    const ques = question ? question[quesID] : null

    return {
        question : ques
        // question : state.firestore.ordered.project_hunter,
    }
}

export default compose(
    connect(mapStatetoProps),
    firestoreConnect([
        { 
            collection : 'project_hunter',
        }
    ])
)(AdminLayout);

// export default AdminLayout;