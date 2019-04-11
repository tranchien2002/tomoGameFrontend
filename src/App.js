import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import PlayerLayout from './component/PlayerLayout/PlayerLayout'
import AdminLayout from './component/AdminLayout/AdminLayout'
import Web3 from 'web3';

class App extends Component {

    constructor(props){
        super(props)
        this.state ={
            account : '0x0',
            balance : '',
        }
    }
    
    async componentDidMount(){

        const web3 = new Web3(window.web3.currentProvider || "http://localhost:8545");
        console.log("web3", web3)
        await web3.eth.getCoinbase().then((account)=>{
            this.setState({account})
        });
        // await web3.eth.getBalance(this.state.account).then((balance)=>{
        //     balance = web3.utils.fromWei(balance);
        //     this.setState({balance})
        // })
       
    }
    
    render() {
        return (
          <BrowserRouter>
            <div className="App">
              <Switch>
                <Route exact path='/'component={PlayerLayout} />
                <Route path='/admin' component={AdminLayout} />
              </Switch>
            </div>
          </BrowserRouter>
        );
    }
}

export default App
