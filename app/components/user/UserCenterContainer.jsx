'use strict';

import React, { Component } from 'react';
import UserCenterHead from './UserCenterHead.jsx';
import UserCenterChannel from './UserCenterChannel.jsx';

export default class UserCenterContainer extends Component {


    render () {
        return (
            <div className="user_center_container">
                <UserCenterHead />
                <div className="user-center-container">
                    <UserCenterChannel />
                    {this.props.children}
                </div>
            </div>

        );
    }
}