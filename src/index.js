import React from 'react';
import ReactDOM from 'react-dom';
import RequestForm from './RequestForm';
import registerServiceWorker from './registerServiceWorker';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/font-awesome/css/font-awesome.min.css'; 
import './index.css';

ReactDOM.render(<RequestForm />, document.getElementById('root'));
registerServiceWorker();
