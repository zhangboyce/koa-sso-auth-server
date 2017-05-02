'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import RowProgressBar from './../common/RowProgressBar.jsx';

export default class RegisterOk extends Component {

    constructor(props) {
        super(props);
        this.state = { status: true, msg: '' }
    }

    handleSendRegisterEmail = () => {
        let email = this.props.location.query.email;
        if (!email) return;

        $.post('/api/user/sendRegisterValidEmail', { email }, json => {
            this.setState({ status: json.status, msg: json.message });
            if (json.status) {
                alert('发送成功,请查收!')
            }
        });
    };

    render () {
        return (
            <div className="row register-ok">
                <div className="col-sm-9">
                    <h4>注册成功!</h4>
                    <h4><i>请前往您的</i>{ this.props.location.query.email }<i>邮箱进行验证。</i></h4>
                    <a href="javascript:void(0);" onClick={ this.handleSendRegisterEmail }>没有收到邮件,重新发送</a>
                    {
                        !this.state.status &&
                        <p> <i className="fa fa-exclamation-circle" aria-hidden="true"/> { this.state.msg } </p>
                    }
                </div>
            </div>
        );
    }
}
