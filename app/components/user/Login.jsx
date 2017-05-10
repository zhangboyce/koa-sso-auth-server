'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import Utils from '../../../common/Utils';
import RowEmail from './../common/RowEmail.jsx';
import RowPassword from './../common/RowPassword.jsx';
import RowSubmit from './../common/RowSubmit.jsx';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { msg: '' };
    }

    handleLogin = () => {
        let ev = this.refs.email.validate();
        let pv = this.refs.password.validate();
        if (!ev || !pv) return;

        let username = this.refs.email.val;
        let password = this.refs.password.val;

        password = Utils.md5ByString(password + Utils.salt);
        let auth_callback = this.props.location.query.auth_callback;

        $.post('/api/user/login', { username, password }, json => {
            if (json.status) {
                if (auth_callback && auth_callback != 'undefined') {
                    location.href = auth_callback + '?code=' + json.result;
                } else {
                    location.href = window.CONFIG['default_system'];
                }
            } else {
                this.setState({ msg: json.message });
            }
        });
    };

    render () {
        return (
            <div>
                <RowEmail ref="email"/>
                <RowPassword ref="password">
                    <span className="forget-password">
                        <Link to="/user/sendForgetPasswordEmail">忘记密码?</Link>
                    </span>
                </RowPassword>
                <RowSubmit onSubmit={ this.handleLogin } name="登录" msg={ this.state.msg }/>

                <div className="row divider">
                    <div className="col-sm-3">
                        <span>OR</span>
                    </div>
                </div>

                <div className="row register">
                    <div className="col-sm-3">
                        <span>还没有账号?</span>&nbsp;&nbsp;&nbsp;&nbsp;
                        <span>
                            <Link to="/user/register">注册</Link>
                        </span>
                    </div>
                </div>

                <div className="row desc">
                    <p>
                        <small>
                            <em>idea CCE maker 在你的脑袋上真的开了一个洞...</em>
                        </small>
                        <br/>
                        <br/>
                    </p>
                </div>
            </div>
        );
    }
}
