import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import App from './App';
import ErrorBoundary from './components/misc/ErrorBoundary'
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<ErrorBoundary><App /></ErrorBoundary>, document.getElementById('root'));
if (module.hot) { module.hot.accept(); }

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
