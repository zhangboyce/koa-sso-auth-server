'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import UserCenterInfo from './UserCenterInfo.jsx'

export default class UserCenterChannel extends Component {
    render () {
        return (
            //<div className="container">
                <div className="main_left">
                    <div className="head col-sm-12">
                        <div>
                            <img className="img_1 img-circle" src="http://boom-static.static.cceato.com/boom/imgs/login-logo-2.gif"/>
                        </div>

                        <div>
                            <h4>Jack</h4>
                            <p className="emailadress">Jack@ccegroup.cn</p>
                        </div>
                    </div>
                    <div className="menus">
                        <section className="border col-sm-12" >
                            <Link to="/revise/info">个人信息</Link>
                        </section>
                        <div className="border col-sm-12">
                            <Link to="/revise/account">帐号密码</Link>
                        </div>
                    </div>
                </div>

            //</div>
        );
    }
}