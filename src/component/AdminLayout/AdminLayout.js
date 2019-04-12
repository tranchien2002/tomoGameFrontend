import React, { Component } from 'react'
import { Container, Col} from 'reactstrap'
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
        return (   
            <div>
                <Container>
                    <Col className="set_height">
                        <div className = "margin_box">
                            <div>
                                <h1>Select the next question</h1>
                            </div>
                            <div className="admin_question_box">
                                {
                                    question && question.map(ques => (
                                        <div className = "admin_quesbox" key = {ques.id}>
                                            <Adminselectques ques ={ques.question}/> 
                                        </div>                                
                                ))}
                            </div>
                        </div>
                    </Col>
                </Container>
            </div>
        );
    }
}

const mapStatetoProps = (state) => {
    return {
        question : state.firestore.ordered.project_hunter,
    }
}

export default compose(
    connect(mapStatetoProps),
    firestoreConnect([
        { collection : 'project_hunter'}
    ])
)(AdminLayout);

// export default AdminLayout;