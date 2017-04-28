'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Utils from '../../../common/Utils';
import MsgSpan from './MsgSpan.jsx';

export default class RowRePassword extends Component {
    constructor(props) {
        super(props);
        this.state = { msg: '', validated: false };
    }

    validate = password => {
        let rePassword = this.refs.rePassword.value;
        let re = true;
        if(password !== rePassword) {
            this.setState({ msg: '重复密码不正确!' });
            re = false;
        }

        this.setState({ validated: true });
        return re;
    };

    render() {
        return (
            <div className="row password">
                <div className="col-sm-3">
                    <input name="password" ref="rePassword" type="password" className="form-control" placeholder={ this.props.placeholder || '重复密码' } />
                </div>
                <MsgSpan msg={ this.state.msg } validated={ this.state.validated }/>
            </div>
        );
    }
};