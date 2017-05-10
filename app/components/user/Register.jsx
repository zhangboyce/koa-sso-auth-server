'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import Utils from '../../../common/Utils';
import RowInput from './../common/RowInput.jsx';
import RowSubmit from './../common/RowSubmit.jsx';

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = { msg: '', password: '' }
    }

    handleRegister = () => {
        let pv = this.refs.password.validate();
        let ev = this.refs.email.validate();
        let rpv = this.refs.rePassword.validate();

        if (!ev || !pv || !rpv) return;

        let email = this.refs.email.val;
        let password = this.refs.password.val;
        password = Utils.md5ByString(password + Utils.salt);

        $.post('/api/user/register', { password, email }, json => {
            this.setState({ msg: json.message });
            if (json.status) {
                location.href="/user/registerOk?email=" + email ;
            }
        });
    };

    handlePasswordChange = e => {
        let val = e && e.target && e.target.value;
        this.setState({ password: val })
    };

    render () {
        return (
            <div>
                <RowInput ref="email" name="email" isRequired isEmail placeholder="邮箱地址"/>
                <RowInput ref="password" name="password" type="password" isRequired isPassword placeholder="密码" onChange={ this.handlePasswordChange }/>
                <RowInput ref="rePassword" name="rePassword" type="password" isEquals={ this.state.password } validateMsg="重复密码不正确!" placeholder="重复密码"/>

                <RowSubmit onSubmit={ this.handleRegister } name="注册新用户" msg={ this.state.msg }/>

                <div className="row divider">
                    <div className="col-sm-3">
                        <span>OR</span>
                    </div>
                </div>

                <div className="row register">
                    <div className="col-sm-3">
                        <span>已有账号</span>&nbsp;&nbsp;&nbsp;&nbsp;
                        <span>
                            <Link to="/user/login">返回登录</Link>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}
