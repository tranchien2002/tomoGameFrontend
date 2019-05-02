import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import store from 'store';
import * as actions from 'actions/tomoAction'


const appRoot = document.getElementById('root');
ReactDOM.render(
        <Provider store= {store}>
            <App />
        </Provider>
, appRoot);


window.addEventListener('load', async () => {
    if(window.web3) {
        await store.dispatch(actions.web3Connect());
        await store.dispatch(actions.instantiateContracts());
        await store.dispatch(actions.fetchWinCount())
        console.log("tomo", store.getState().tomo.account)
    }
})


serviceWorker.unregister();
