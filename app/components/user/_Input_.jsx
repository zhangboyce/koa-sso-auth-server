"use strict";

import React, { Component, PropTypes } from 'react';
import SmallTips from '../common/SmallTips.jsx';
import MsgSpan from '../common/MsgSpan.jsx';

export default class _Input_ extends Component {

    constructor(props) {
        super(props);
        this.state = {  msg : '' ,validated: false }
    }

    componentDidMount () {
        console.log(location.pathname.split('/')[2])
    }

    handleBlur = (e) => {
        console.log(e.target)
        let value = e.target.value;
        let re = false;
        if(value == '') {
            this.setState( { msg : '信息不能为空' } );
        } else {
            this.setState( { msg : '' } );
            re = true;
        }
        this.setState( { validated: true } )
        return re;
    };

    render () {
        return (
            <li className="form-group row">
                <label className="control-label col-sm-3">{ this.props.label }</label>
                <div className="col-sm-8">
                    <input onBlur={ this.handleBlur } onChange={ this.props.onChange } className="form-control" type={ this.props.type || 'text' } name={ this.props.name } value={ this.props.value } />
                </div>
                {
                    this.state.msg &&
                    <MsgSpan msg={ this.state.msg } validated={ this.state.validated }/>
                }

            </li>
        );
    }
}


_Input_.propTypes = {
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    type: PropTypes.string
};