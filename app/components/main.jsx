'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import App from './App.jsx';
import Login from './user/Login.jsx';
import Welcome from './Welcome.jsx';
import SendForgetPasswordEmail from './user/SendForgetPasswordEmail.jsx';
import UserContainer from './user/UserContainer.jsx';
import Register from './user/Register.jsx';
import ResetPassword from './user/ResetPassword.jsx';
import ResetPasswordOk from './user/ResetPasswordOk.jsx';

ReactDOM.render(
    <Router history={ browserHistory }>
        <Route path="/" component={ App }>
            <Route path="welcome" component={ Welcome }/>
            <Route path="user" component={ UserContainer }>
                <Route path="login" component={ Login } />
                <Route path="sendForgetPasswordEmail" component={ SendForgetPasswordEmail }/>
                <Route path="register" component={ Register }/>
                <Route path="resetPassword" component={ ResetPassword }/>
                <Route path="resetPasswordOk" component={ ResetPasswordOk }/>
            </Route>
        </Route>
    </Router>, document.getElementById('main'));