'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import App from './App.jsx';
import Login from './Login.jsx';
import Welcome from './Welcome.jsx';

ReactDOM.render(
    <Router history={ browserHistory }>
        <Route path="/" component={ App }>
            <IndexRoute component={ Login } />
            <Route path="welcome" component={ Welcome } />
        </Route>
    </Router>, document.getElementById('main'));