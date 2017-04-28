'use strict';

import Utils from '../../../common/Utils';
import React, { Component, PropTypes } from 'react'
import MsgSpan from './MsgSpan.jsx';

export default class RowEmail extends Component {
    constructor(props) {
        super(props);
        this.state = { msg: '', validated: false };

        this.__defineGetter__('val', () => {
            return this.refs.email.value;
        });
    }

    validate = () => {
        let email = this.refs.email.value;
        let re = false;
        if(!email || email.trim() == '') {
            this.setState({ msg: '邮箱地址不能为空!' });
        } else if (!Utils.isEmail(email)) {
            this.setState({ msg: '邮箱格式不正确!' });
        } else {
            this.setState({ msg: '' });
            re =true;
        }

        this.setState({ validated: true });
        return re;
    };

    render() {
        return (
            <div className="row email">
                <div className="col-sm-3">
                    <input name="email" ref="email" onBlur={ this.validate } type="text" className="form-control" placeholder={ this.props.placeholder || '输入您注册的邮箱地址' }/>
                </div>
                <MsgSpan msg={ this.state.msg } validated={ this.state.validated }/>
            </div>
        );
    }
};