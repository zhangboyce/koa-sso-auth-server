"use strict";

import React, { Component } from 'react';

export default class SmallTips extends Component {
    render(){
        return (
            <div className="smalltips">
                <span>{this.props.msg}</span>
            </div>
        )
    }
}