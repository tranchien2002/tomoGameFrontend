import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import Web3 from 'web3';


import './App.css';



class App extends Component {

    constructor(props){
        super(props)
        this.state ={
            account : '0x0',
            balance : '',
            question: '',
            answer : [],
            ranking :[
                {
                    account: '',
                    correct: ''
                }
            ]
        }    
 

    }
    
    async componentDidMount(){

        const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

        await web3.eth.getCoinbase().then((account)=>{
            this.setState({account})
        });

        await web3.eth.getBalance(this.state.account).then((balance)=>{
            balance = web3.utils.fromWei(balance);
            this.setState({balance})
        })
        

        await this.ranking();
    }

    async ranking (){
        var ranking = [{
            account : '0x4c637fc36eca2da2d5214b53c0aec272f31f7e53',
            correct : 5
        },{
            account : '0x4c637fc36eca2d02d5214b53c0aec272f31f7e54',
            correct : 5
        },{
            account : '0x4c637fc36eca2d02d5214b53c0aec272f31f7333',
            correct : 9
        },{
            account : '0x4c637fc36eca2s02d5214b53c0a02272f31f7e53',
            correct : 8
        },{
            account : '0x4c637fc36eca2d02dasd4b53c0a02272f31f7e53',
            correct : 9
        },{
            account : '0x4c637fc36eca2d02daaaab53c0a02272f31f7e53',
            correct : 8
        },{
            account : '0x4c637fc36eca2d02dwe14b53c0a02272f31f7e53',
            correct : 9
        },{
            account : '0x4c637fc36eca2d02dret4b53c0a02272f31f7e53',
            correct : 8
        },{
            account : '0x4c637fc36eca2d02d5211233c0a02272f31f7e53',
            correct : 9
        },{
            account : '0x4c637fc36eca2d02d521wertc0a02272f31f7e53',
            correct : 8
        },{
            account : '0x4c637fc36eca2d02d9214b53c0ee2272f31f7e53',
            correct : 9
        },{
            account : '0x4c637fc36eca1232d5214b53www02272f31f7e53',
            correct : 8
        },{
            account : '0x4c637fca6eca2d02d5214b5ec0a02272f31f7e53',
            correct : 9
        },{
            account : '0x4c637fc36eca2d02d5214b53c0a02272f31f7e53',
            correct : 8
        }]

        await this.setState({
            ranking : ranking
        })

        await this.state.ranking.forEach(rank => {
            // console.log(rank);
        });
    }

    
    render() {
        return (
            <div>
                <Container>
                    <Row className="set_height">
                        <Col className = "box_color" xs="8">
                            <div className="margin_box ">
                                {/* question */}
                                <div className = "question"> 
                                    <Col className = "user_account">
                                        <h5><strong>Your account :</strong> {this.state.account}</h5>
                                        <p><strong>Balance :</strong> {this.state.balance} <strong>ETH</strong></p>
                                    </Col>
                                    <Col className = "question_box">
                                        <div className ="question_position">
                                            <h1 >question </h1>
                                        </div>
                                    </Col>
                                </div>
                                {/* answer */}
                                <Col className = "question">
                                    <div className = "answer_position">
                                        <Col >
                                            <Button className = "answer_box" outline color="primary">
                                                {} cau 1
                                            </Button>
                                        </Col>                                        
                                        <Col >
                                            <Button className = "answer_box" outline color="primary">
                                                {} cau 1
                                            </Button>
                                        </Col>
                                        <Col >
                                            <Button className = "answer_box" outline color="primary">
                                                {} cau 1
                                            </Button>
                                        </Col>
                                    </div>                                    
                                </Col>
                            </div>
                        </Col>
                        <Col className = "box_color" xs="4">
                            <div className="ranking margin_box" >
                                {/* Ranking */}
                                <div className = "ranking_title">
                                    <h1>Ranking</h1>
                                </div>
                                {/* member ranking */}
                                <div className = "person_rank_box">
                                    {
                                        this.state.ranking.map(rank => (
                                            <div key={rank.account} className = "person_rank">
                                                <p className = "user_account">
                                                    <span className = "ellipsis">{rank.account}</span>
                                                    <span className = "indent">{rank.account}</span>                                        
                                                </p>
                                                <p>
                                                    {rank.correct}/10
                                                </p>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
                  
        );
    }
}

export default App;
