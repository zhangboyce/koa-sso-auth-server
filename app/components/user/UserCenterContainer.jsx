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

    handleChangeUserInfo = e =>  {
        let name = e.target.name;
        let value = e.target.value;

        let obj = {};
        obj[name] = value;
        this.setState({ account: Object.assign(this.state.account, obj) });
    };

    handleSubmitAvatar = avatar => {
        let obj = {};
        obj['avatar'] = avatar;
        this.setState({ account: Object.assign(this.state.account, obj) });
    };

    render () {
        const account  = this.state.account;
        return (
            <div className="user-center-container">
                <nav className="navbar" role="navigation">
                    <Link to="/welcome">
                        <img className="logo" src="http://boom-static.static.cceato.com/boom/imgs/login-logo-2.gif" />
                    </Link>
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
                                <img className="img_1 img-circle" src={ window.STATIC_SERVER + 'boom/imgs/avatars/' + (account.avatar || '01.png') }/>
                            </div>

                            <div>
                                <h4>{ account.nickname }</h4>
                                <p className="emailaddress">{ account.username }</p>
                            </div>
                        </div>
                        <div className="menus">
                            <Link to="/userCenter/info">
                                <section className="border col-sm-12" onClick={ this.handleSwitch('info') }>
                                    <span  >个人信息</span>
                                </section>
                            </Link>
                            <Link to="/userCenter/account" >
                                <div className="border col-sm-12" onClick={ this.handleSwitch('account') }>
                                    <span >帐号密码</span>
                                </div>
                            </Link>
                        </div>
                    </div>




                    {this.props.children && React.cloneElement(this.props.children, {
                        account: account,
                        onSubmitAvatar:this.handleSubmitAvatar,
                        onChangeUserInfo:this.handleChangeUserInfo
                    })}
                </div>
            </div>

        );
    }
}