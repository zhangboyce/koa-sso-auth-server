'use strict';

import React, { Component } from 'react';
import RowSubmit from './common/RowSubmit.jsx';
import RowEmail from './common/RowEmail.jsx';

export default class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = { msg: '' };
    }

    handleUpdatePassword = () => {
        let ev = this.refs.email.validate();
        if (!ev) return;

        let email = this.refs.email.val;
        $.post('/api/user/sendForgetPasswordEmail', { email } , json => {
            if (json.status) {

            } else {
                this.setState({ msg: json.message })
            }
        });
    };

    render () {
        return (
            <div>
                <RowEmail ref="email"/>
                <RowSubmit onSubmit={ this.handleUpdatePassword } name="重置密码" msg={ this.state.msg }/>
            </div>
        );
    }
}
