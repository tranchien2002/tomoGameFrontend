import React, { Component } from 'react'
import { Container, Row, Col} from 'reactstrap'
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

        const web3 = await new Web3(Web3.givenProvider);

        await web3.eth.getCoinbase().then((account)=>{
            this.setState({account})
        });

        await web3.eth.getBalance(this.state.account).then((balance)=>{
            balance = web3.utils.fromWei(balance);
            this.setState({balance})
        })
        
    }

    clickA = ()=>{
        console.log("hello")
    }
    
    render() {   
        const { rank } = this.props;
        const { question } = this.props;
        if(question != null){
            return (   
                <div>
                    <Container>
                        <Row className="set_height">
                                <QuesArea ques ={question} acc={this.state}/> 
                            <RankArea rank = {rank} />
                        </Row>
                    </Container>
                </div>
            );
        }else{
            return (   
                <div>
                    <Container>
                        <Row className="set_height">
                            <Col className = "box_color" xs="8">
                                <div className="margin_box ">
                                    <h1> Waiting ...</h1>
                                </div>
                            </Col>
                            <RankArea rank = {rank} />
                        </Row>
                    </Container>
                </div>
            );
        }
        
    }
}

const mapStatetoProps = (state) => {
    const question = state.firestore.data.player_question
    return {
        question : question,
        rank : state.rank.ranking
    }
}

export default compose(
    connect(mapStatetoProps),
    firestoreConnect([
        { 
            collection : 'player_question',     
        }
    ])
)(PlayerLayout);
