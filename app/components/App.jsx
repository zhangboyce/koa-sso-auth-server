'use strict';

import React, { Component } from 'react';
import Footer from './layout/Footer.jsx';
import Header from './layout/Header.jsx';

export default class App extends Component {
    render () {
        return (
            <div className="container-fluid">
                <Header />
                { this.props.children }
                <Footer />
            </div>
        );
    }
}
