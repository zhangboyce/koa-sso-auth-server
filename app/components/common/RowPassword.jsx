'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Utils from '../../../common/Utils';
import MsgSpan from './MsgSpan.jsx';

export default class RowPassword extends Component {
    constructor(props) {
        super(props);
        this.state = { msg: '', validated: false };

        this.__defineGetter__('val', () => {
            return this.refs.password.value;
        });
    }

    validate = () => {
        let password = this.refs.password.value;
        let re = false;
        if(!password || password.trim() == '') {
            this.setState({ msg: '密码不能为空!' });
        } else if (!Utils.isPassword(password) && false) {
            this.setState({ msg: '密码必须至少包含一个数字和一个字母,且长度不少于6位!' });
        } else {
            this.setState({ msg: '' });
            re =true;
        }

        this.setState({ validated: true });
        return re;
    };

    render() {
        return (
            <div className="row password">
                <div className="col-sm-3">
                    <span className="forget-password">
                            <Link to="/user/resetPassword">忘记密码?</Link>
                        </span>
                    <input name="password" ref="password" onBlur={this.validate  } type="password" className="form-control" placeholder="密码"/>
                </div>
                <MsgSpan msg={ this.state.msg } validated={ this.state.validated }/>
            </div>
        );
    }
};