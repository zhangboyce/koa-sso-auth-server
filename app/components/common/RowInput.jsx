'use strict';

import React, { Component, PropTypes } from 'react'
import MsgSpan from './MsgSpan.jsx';

const defaultValidateRegex = {
    'email': {
        regex: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        msg: '邮箱格式不正确!'
    },
    'url': {
        regex: /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi,
        msg: '链接格式不正确!'
    },
    'phone': {
        regex: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
        msg: '电话号码格式不正确, 形如: 13333333333; 021-00000000, 0851-0000000'
    },
    'password': {
        regex: /^(?=.*[A-Za-z])(?=.*\d)[\d\D]{6,}$/,
        msg: '密码格式不正确, 至少包含一个数字和一个字母, 且长度不少于6位'
    }
};

export default class RowInput extends Component {
    constructor(props) {
        super(props);
        this.state = { msg: '', validated: false };

        let name = props.name;
        this.__defineGetter__('val', () => {
            return this.refs[name].value;
        });
    }

    validate = e => {
        let value = this.refs[this.props.name].value;
        value = (value && value.trim()) || '';

        this.setState({ validated: true });

        const {
            isEquals,
            isRequired,
            validateRegex,
            isEmail,
            isUrl,
            isPhone,
            isPassword,
            validateMsg } = this.props;

        // 1. is equals
        if (isEquals !== null &&
            isEquals !== undefined &&
            isEquals !== '' &&
            isEquals !== value) {

            let msg = validateMsg || '字段值不正确!';
            this.setState({ msg: msg });
            return false;
        }

        // 2. is required
        let msg_prefix =
            isEmail === true ? '邮箱地址' :
            isUrl === true ? '链接地址' :
            isPhone === true ? '电话号码' :
            isPassword === true ? '密码' : '该字段';
        if (isRequired === true && value === '') {
            let msg = validateMsg || ( msg_prefix + '不能为空!');
            this.setState({ msg: msg });
            return false;
        }

        // 3. regex
        if (validateRegex !== null
            && validateRegex !== undefined
            && validateRegex !== '') {

            let regex = validateRegex instanceof RegExp ? validateRegex : new RegExp(validateRegex);
            if (value !== '' && !regex.test(value)) {
                let msg = validateMsg || '该字段格式不正确!';
                this.setState({ msg: msg });
                return false;
            }
        }

        // 4. is a default regex
        let default_regex =
            isEmail ? 'email' :
            isUrl ? 'url' :
            isPhone ? 'phone' :
            isPassword ? 'password' : '';

        if (default_regex !== '') {
            let regex = defaultValidateRegex[default_regex];
            if (value !== '' && !regex['regex'].test(value)) {
                let msg = validateMsg || regex['msg'];
                this.setState({ msg: msg });
                return false;
            }
        }

        this.setState({ msg: '' });
        return true;
    };

    handleChange = e => {
        const { onChange } = this.props;
        if (onChange && typeof onChange === 'function') {
            onChange(e);
        }
    };

    render() {

        const {
            name,
            value,
            type,
            label,
            labelClassName,
            inputClassName,
            placeholder } = this.props;

        return (
            <div className={ "row " + name }>
                {
                    label &&
                    <label className={ "control-label " + ( labelClassName || "col-sm-1" ) }>{ label }</label>
                }
                <div className={ inputClassName  || 'col-sm-3'}>
                    { this.props.children }
                    <input name={ name } ref={ name } value={ value } onBlur={ this.validate } onChange={ this.handleChange } type={ type || 'text' } className="form-control" placeholder={ placeholder }/>
                </div>
                <MsgSpan msg={ this.state.msg } validated={ this.state.validated }/>
            </div>
        );
    }
};

RowInput.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    label: PropTypes.string,
    labelClassName: PropTypes.string,
    inputClassName: PropTypes.string,
    isRequired: PropTypes.bool,
    isEmail: PropTypes.bool,
    isPhone: PropTypes.bool,
    isUrl: PropTypes.bool,
    isPassword: PropTypes.bool,
    isEquals: PropTypes.string,
    validateRegex: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(RegExp)
    ]),
    validateMsg: PropTypes.string,
    onChange: PropTypes.func
};