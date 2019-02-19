import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';
import App from './App';
import * as ServiceWorker from './utils/service-worker';

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
ServiceWorker.register();
