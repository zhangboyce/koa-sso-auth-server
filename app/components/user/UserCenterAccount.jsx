'use strict';

import React, { Component } from 'react';
import Utils from '../../../common/Utils';

import RowPassword from '../common/RowPassword.jsx';
import RowRePassword from '../common/RowRePassword.jsx';
import RowSubmit from '../common/RowSubmit.jsx';
import RowEmail from '../common/RowEmail.jsx';
import _Input_ from './_Input_.jsx';

export default class UserCenterAccount extends Component {

    constructor(props){
        super(props);
        this.state = { msg: '' };
    }

    handleSave = () => {
        let op = this.refs.oldPassword.validate();
        let np = this.refs.newPassword.validate();


        let newPassword = this.refs.newPassword.val;
        let oldPassword = this.refs.oldPassword.val;
        let nrp = this.refs.newRePassword.validate(newPassword);

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
                    <RowPassword ref="oldPassword" placeholder="旧密码" inputClassName="col-sm-8" labelClassName="col-sm-3" label="旧密码"/>

                    <RowPassword ref="newPassword" placeholder="新密码" label="新密码" inputClassName="col-sm-8" labelClassName="col-sm-3"/>

                    <RowRePassword ref="newRePassword" placeholder="确认新密码" label="确认新密码" inputClassName="col-sm-8" labelClassName="col-sm-3"/>


                    <RowSubmit btnClassName="col-sm-8" onSubmit={ this.handleSave } name="保存" msg={ this.state.msg }/>

                </div>
            </div>
        );
    }
}