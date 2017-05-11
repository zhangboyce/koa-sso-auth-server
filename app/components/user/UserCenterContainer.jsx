'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';

import Footer from '../common/Footer.jsx';
import UserCenterAccount from './UserCenterAccount.jsx';
import UserCenterInfo from './UserCenterInfo.jsx';

export default class UserCenterContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { active: 'info', account: {} };
    }

    componentDidMount() {
        $.get('/api/userCenter/getUserInfo', json => {

            console.log('json: ' + JSON.stringify(json));

            if (json.status) {
                this.setState({ account: json.result })
            } else {
                alert(json.message);
                location.href = '/user/login';
            }
        });
    }

    handleSwitch = type => {
        return () => {
            this.setState({ active: type });
        };
    };

    render () {
        const account  = this.state.account;
        return (
            <div className="user-center-container">
                <nav className="navbar" role="navigation">
                    <img className="logo" src="http://boom-static.static.cceato.com/boom/imgs/login-logo-2.gif" alt=""/>
                    <div className="container">
                        <div className="navbar-header">
                            <a className="navbar-brand">脑洞个人用户中心</a>
                        </div>
                    </div>
                </nav>
                <div className="user-center-content">
                    <div className="main_left">
                        <div className="head col-sm-12">
                            <div>
                                <img className="img_1 img-circle" src="http://boom-static.static.cceato.com/boom/imgs/login-logo-2.gif"/>
                            </div>

                            <div>
                                <h4>{ account.nickname }</h4>
                                <p className="emailadress">{ account.username }</p>
                            </div>
                        </div>
                        <div className="menus">
                            <section className="border col-sm-12" >
                                <a href="javascript:void(0)" onClick={ this.handleSwitch('info') }>个人信息</a>
                            </section>
                            <div className="border col-sm-12">
                                <a href="javascript:void(0)" onClick={ this.handleSwitch('account') }>帐号密码</a>
                            </div>
                        </div>
                    </div>

                    {
                        this.state.active === 'info' &&
                        <UserCenterInfo account={ account }/>
                    }
                    {
                        this.state.active === 'account' &&
                        <UserCenterAccount account = { account }/>
                    }

                </div>
            </div>

        );
    }
}