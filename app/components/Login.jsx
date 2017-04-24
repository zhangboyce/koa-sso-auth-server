'use strict';

import React, { Component } from 'react';
import Utils from '../../common/Utils';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username_msg: '',
            password_msg: ''
        };
    }

    handleLogin =()=>{
        let username = this.refs.username.value;
        let uvr = this.validateUsername(username);
        if (!uvr) return;

        let password = this.refs.password.value;
        let pvr = this.validatePassword(password);
        if (!pvr) return;
        password = Utils.md5ByString(password + Utils.salt);

        let auth_callback = this.props.location.query.auth_callback;
        $.post('/api/user/login', { username, password }, json => {
            if (json.status) {
                if (auth_callback) {
                    location.href = auth_callback + '?code=' + json.result;
                } else {
                    location.href = window.CONFIG['default_system'];
                }
            } else {
                this.setState({ password_msg: json.message });
            }
        });
    };

    validateUsername = name => {
        console.log('name: ' + name);
        if(!name || name.trim() == '') {
            this.setState({ username_msg: '用户名不能为空!' });
            return false;
        } else {
            this.setState({ username_msg: '' });
            return true;
        }
        // TODO validate username format
    };

    validatePassword = password => {
        if(!password || password.trim() == '') {
            this.setState({ password_msg: '密码不能为空!' });
            return false;
        } else {
            this.setState({ password_msg: '' });
            return true;
        }
    };

    render () {
        return (
            <div className="column login-container">
                <div className="row logo">
                    <div className="col-sm-3">
                        <img src="http://boom-static.static.cceato.com/boom/imgs/login-logo-2.gif"/>
                        <br/>
                        <img src="http://boom-static.static.cceato.com/boom/imgs/login-title.png" width="100"/>
                    </div>
                </div>
                <div className="row username">
                    <div className="col-sm-3">
                        <input name="username" onBlur={ e => { this.validateUsername(e.target.value) } } ref="username" type="email" className="form-control" placeholder="用户名"/>
                        <span>{ this.state.username_msg }</span>
                    </div>
                </div>
                <div className="row password">
                    <div className="col-sm-3">
                        <input name="password" onBlur={ e => { this.validatePassword(e.target.value) } } ref="password" type="password" className="form-control" placeholder="密码"/>
                        <span>{ this.state.password_msg }</span>
                    </div>
                </div>
                <div className="row submit">
                    <div className="col-sm-3">
                        <button className="btn btn-primary" onClick={ this.handleLogin }>登录</button>
                    </div>
                </div>
            </div>
        );
    }
}
