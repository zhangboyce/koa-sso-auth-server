'use strict';

import React, { Component } from 'react';

export default class UserCenterHead extends Component {
    render () {
        return (
            <nav className="navbar" role="navigation">
                <img className="logo" src="http://boom-static.static.cceato.com/boom/imgs/login-logo-2.gif" alt=""/>
                <div className="container">
                    <div className="navbar-header">
                        <a className="navbar-brand">脑洞个人用户中心</a>
                    </div>
                </div>
            </nav>
        );
    }
}