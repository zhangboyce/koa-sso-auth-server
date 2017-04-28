'use strict';

import React, { Component } from 'react';
import Footer from './common/Footer.jsx';
import Header from './common/Header.jsx';
import PB from './progress_bar/ProgressBar.jsx'

export default class App extends Component {
    render () {
        list = ['填写账号', '身份验证', '设置', '完成'];
        return (
            <div className="container-fluid">
                <PB list={ list } current={ 2 }/>
                <Header />
                { this.props.children }
                <Footer />
            </div>
        );
    }
}
