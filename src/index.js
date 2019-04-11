import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import store from 'store';


const appRoot = document.getElementById('root');
ReactDOM.render(
        <Provider store= {store}>
            <App />
        </Provider>
, appRoot);


window.addEventListener('load', async () => {
    
})


serviceWorker.unregister();
