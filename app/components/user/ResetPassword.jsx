'use strict';

import React, { Component } from 'react';
import Utils from '../../../common/Utils';
import RowPassword from './../common/RowPassword.jsx';
import RowRePassword from './../common/RowRePassword.jsx';
import RowSubmit from './../common/RowSubmit.jsx';
import RowProgressBar from './../common/RowProgressBar.jsx';

export default class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = { msg: '' }
    }

    handleUpdatePassword = () => {
        let pv = this.refs.password.validate();
        let password = this.refs.password.val;

        let rpv = this.refs.rePassword.validate(password);
        if (!pv || !rpv) return;

        password = Utils.md5ByString(password + Utils.salt);
        let code = this.props.location.query.code;

        console.log('code: ' + code);

        $.post('/api/user/resetPassword', { password, code }, json => {
            this.setState({ msg: json.message });
            if (json.status) {
                location.href="/user/resetPasswordOk";
            }
        });
    };

    render () {
        console.log();
        return (
            <div>
                <RowProgressBar current={ 2 }/>
                <RowPassword ref="password" placeholder="新密码"/>
                <RowRePassword ref="rePassword"/>
                <RowSubmit onSubmit={ this.handleUpdatePassword } name="修改密码" msg={ this.state.msg }/>
            </div>
        );
    }
}
