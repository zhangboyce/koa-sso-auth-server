'use strict';

import React, { Component } from 'react';
import Utils from '../../../common/Utils';

import RowInput from '../common/RowInput.jsx';
import RowSubmit from '../common/RowSubmit.jsx';

export default class UserCenterAccount extends Component {

    constructor(props){
        super(props);
        this.state = { msg: '', password: '' };
    }

    handleSave = () => {
        let op = this.refs.oldPassword.validate();
        let np = this.refs.newPassword.validate();
        let nrp = this.refs.newRePassword.validate();

        let newPassword = this.refs.newPassword.val;
        let oldPassword = this.refs.oldPassword.val;

        if (!op || !np || !nrp) return;

        newPassword = Utils.md5ByString(newPassword + Utils.salt);
        oldPassword = Utils.md5ByString(oldPassword + Utils.salt);

        $.post('/api/user/updateUserInfo', { oldPassword, newPassword }, json => {
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
            <div className="main_right">
                <div  >
                    <p className="loginaccount ">登录帐号</p>
                    <p className="des">邮箱帐号可收取通知</p>
                </div>
                <hr />
                <div className="form-horizontal info-group">

                    <div className="row">
                        <label className="control-label col-sm-3 col-lg-2">邮箱帐号</label>
                        <div className="col-sm-8">
                            <input className="form-control" type="text" disabled/>
                        </div>
                    </div>
                    <hr/>

                    <RowInput ref="oldPassword" name="oldPassword" type="password" isRequired isPassword inputClassName="col-sm-8" labelClassName="col-sm-3" label="旧密码" placeholder="旧密码" />
                    <RowInput ref="newPassword" name="newPassword" type="password" isRequired isPassword onChange={ this.handlePasswordChange } inputClassName="col-sm-8" labelClassName="col-sm-3" label="新密码" placeholder="新密码" />
                    <RowInput ref="newRePassword" name="newRePassword" type="password" isEquals={ this.state.password } inputClassName="col-sm-8" labelClassName="col-sm-3" label="确认新密码" placeholder="确认新密码"/>

                    <RowSubmit btnClassName="col-sm-8" onSubmit={ this.handleSave } name="保存" msg={ this.state.msg }/>

                </div>
            </div>
        );
    }
}