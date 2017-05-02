'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import Utils from '../../../common/Utils';
import RowPassword from './../common/RowPassword.jsx';
import RowRePassword from './../common/RowRePassword.jsx';
import RowSubmit from './../common/RowSubmit.jsx';
import RowEmail from './../common/RowEmail.jsx';

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = { msg: '' }
    }

    handleRegister = () => {
        let pv = this.refs.password.validate();
        let ev = this.refs.email.validate();
        let password = this.refs.password.val;

        let rpv = this.refs.rePassword.validate(password);
        if (!ev || !pv || !rpv) return;

        let email = this.refs.email.val;
        password = Utils.md5ByString(password + Utils.salt);

        $.post('/api/user/register', { password, email }, json => {
            this.setState({ msg: json.message });
            if (json.status) {
                location.href="/user/registerOk?email=" + email ;
            }
        });
    };

    render () {
        return (
            <div>
                <RowEmail ref="email"/>
                <RowPassword ref="password" placeholder="密码"/>
                <RowRePassword ref="rePassword"/>
                <RowSubmit onSubmit={ this.handleRegister } name="注册新用户" msg={ this.state.msg }/>
            </div>
        );
    }
}
