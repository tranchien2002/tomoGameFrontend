import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import PlayerLayout from './component/PlayerLayout/PlayerLayout';
import AdminLayout from './component/AdminLayout/AdminLayout';
import Particles from './component/Particles';
import store from 'store';
import * as tomoAction from './actions/tomoAction';
import Site404 from './component/NotFound404';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAdmin: false,
      loading: false
    };
  }

  componentDidMount = async () => {
    try {
      await store.dispatch(tomoAction.web3Connect());

      const accountUser = store.getState().tomo.account;

      await store.dispatch(tomoAction.getCeoAddress());

      const ceoAddress = store.getState().tomo.ceoAddress;

      if (accountUser === ceoAddress) {
        this.setState({ isAdmin: true, loading: true });
      }
    } catch (error) {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  };

  render() {
    console.log(this.state);
    if (this.state.loading) {
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
    } else {
      return (
        <BrowserRouter>
          <Particles />
          <div className='App'>
            <Switch>
              <Route exact path='/' component={PlayerLayout} />
              <Route path='/admin' component={Site404} />
              <Route path='*' exact={true} component={Site404} /> */}
            </Switch>
          </div>
        </BrowserRouter>
      );
    }
  }
}

export default App;
