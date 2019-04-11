import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import PlayerLayout from './component/PlayerLayout/PlayerLayout'
import AdminLayout from './component/AdminLayout/AdminLayout'


class App extends Component {    
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
