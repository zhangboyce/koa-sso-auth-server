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
import RegisterOk from './user/RegisterOk.jsx';
import ResetPassword from './user/ResetPassword.jsx';
import ResetPasswordOk from './user/ResetPasswordOk.jsx';
import UserCenterContainer from './user/UserCenterContainer.jsx';
import UserCenterHead from './user/UserCenterHead.jsx';
import UserCenterInfo from './user/UserCenterInfo.jsx'
import UserCenterAccount from './user/UserCenterAccount.jsx'


ReactDOM.render(
    <Router history={ browserHistory }>
        <Route path="/" component={ App }>
            <Route path="welcome" component={ Welcome }/>
            <Route path="user" component={ UserContainer }>
                <Route path="login" component={ Login } />
                <Route path="sendForgetPasswordEmail" component={ SendForgetPasswordEmail }/>
                <Route path="register" component={ Register }/>
                <Route path="registerOk" component={ RegisterOk }/>
                <Route path="resetPassword" component={ ResetPassword }/>
                <Route path="resetPasswordOk" component={ ResetPasswordOk }/>
            </Route>
        </Route>
        <Route path="/revise" component={ UserCenterContainer }>
            <IndexRoute component={ UserCenterInfo }/>
            <Route path="info" component={ UserCenterInfo }/>
            <Route path="account" component={ UserCenterAccount }/>
        </Route>
    </Router>, document.getElementById('main'));