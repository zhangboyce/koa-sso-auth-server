'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import Utils from '../../common/Utils';
import RowEmail from './common/RowEmail.jsx';
import RowPassword from './common/RowPassword.jsx';
import RowSubmit from './common/RowSubmit.jsx';

export default class Welcome extends Component {
    render () {
        return (
            <div>
                <h1>Welcome to sso system.</h1>
                <a href="/api/user/logout">退出</a>
            </div>
        );
    }
}
