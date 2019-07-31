import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import PlayerLayout from './component/PlayerLayout/PlayerLayout';
import AdminLayout from './component/AdminLayout/AdminLayout';
import Particles from './component/Particles';
import getWeb3 from './utils/getWeb3';
import Site404 from './component/NotFound404';
import AccessControlContract from './contracts/AccessControl.json';
import { Accounts } from 'web3-eth-accounts';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAdmin: false,
      web3: null,
      accounts: null,
      contract: null,
      adminAccount: null
    };
  }

  componentDidMount = async () => {
    try {
      // TODO connect store to get this.props.tomo.web3 and this.props.tomo.account
      const web3 = await getWeb3();

      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AccessControlContract.networks[networkId];
      // TODO from tomoAction connect to AccessControl
      const instance = new web3.eth.Contract(
        AccessControlContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      this.setState({ web3, accounts, contract: instance });

      // const ad = await instance.methods.ceoAddress().call({ from: accounts });

      if (accounts == this.state.adminAccount) {
        this.setState({ isAdmin: true });
      }
    } catch (error) {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  };

  render() {
    return (
      <BrowserRouter>
        <Particles />
        <div className='App'>
          <Switch>
            <Route exact path='/' component={PlayerLayout} />
            <Route
              path='/admin'
              component={() => (this.state.isAdmin ? <AdminLayout /> : <Site404 />)}
            />
            <Route path='*' exact={true} component={Site404} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
