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
                {
                    this.props.label &&
                    <label className={ "control-label " + ( this.props.labelClassName || "col-sm-1" ) }>{ this.props.label }</label>
                }
                <div className={ this.props.inputClassName  || 'col-sm-3'}>
                    { this.props.children }
                    <input name="password" ref="password" onBlur={this.validate  } type="password" className="form-control" placeholder={ this.props.placeholder || '密码' }/>
                </div>
                <MsgSpan msg={ this.state.msg } validated={ this.state.validated }/>
            </div>
        );
    }
};