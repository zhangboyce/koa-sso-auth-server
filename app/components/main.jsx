'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import App from './App.jsx';
import Login from './Login.jsx';
import Welcome from './Welcome.jsx';
import ResetPassword from './ResetPassword.jsx';
import UserContainer from './UserContainer.jsx';
import Register from './Register.jsx';

ReactDOM.render(
    <Router history={ browserHistory }>
        <Route path="/" component={ App }>
            <Route path="welcome" component={ Welcome }/>
            <Route path="user" component={ UserContainer }>
                <Route path="login" component={ Login } />
                <Route path="resetPassword" component={ ResetPassword }/>
                <Route path="register" component={ Register }/>
            </Route>
        </Route>
    </Router>, document.getElementById('main'));