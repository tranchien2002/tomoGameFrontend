import React, { Component } from 'react'
import { Container, Row} from 'reactstrap'
import Web3 from 'web3'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import QuesArea from './QuesArea'
import RankArea from './RankArea'

import '../App.css';



class PlayerLayout extends Component {

    constructor(props){
        super(props)
        this.state ={
            account : '0x0',
            balance : '',
        }
    }
    
    async componentDidMount(){

        const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

        await web3.eth.getCoinbase().then((account)=>{
            this.setState({account})
        });

        // await web3.eth.getBalance(this.state.account).then((balance)=>{
        //     balance = web3.utils.fromWei(balance);
        //     this.setState({balance})
        // })
        
    }
    
    render() {   
        const { rank } = this.props;
        const { question } = this.props;
        // console.log(question);
        return (   
            <div>
                <Container>
                    <Row className="set_height">
                        {question && question.map(ques => (
                            // ques.id= '9VjqRPa9EzCARyXCB0EA'
                             <QuesArea key = {ques.id} ques ={ques} acc={this.state}/> 
                        ))}
                        <RankArea rank = {rank} />
                    </Row>
                </Container>
            </div>
        );
    }
}

const mapStatetoProps = (state) => {
    return {
        question : state.firestore.ordered.project_hunter,
        rank : state.rank.ranking
    }
}

export default compose(
    connect(mapStatetoProps),
    firestoreConnect([
        { 
            collection : 'project_hunter',
            doc : '9VjqRPa9EzCARyXCB0EA'      
        }
    ])
)(PlayerLayout);
