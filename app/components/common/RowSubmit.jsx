'use strict';

import React, { Component, PropTypes } from 'react'

export default class RowSubmit extends Component {

    render() {
        return (
            <div className="row submit">
                <div className="col-sm-3">
                    <button className="btn btn-primary" onClick={ this.props.onSubmit }>{ this.props.name }</button>
                </div>
                <span className="msg">{ this.props.msg }</span>
            </div>
        );
    }
};

RowSubmit.propTypes = {
    msg: PropTypes.string,
    name: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired
};