'use strict';

import React from 'react';

export default class Footer extends React.Component {
    render() {
        return (
            <div className="container-fluid footer">
                <div>
                    <img src="/public/images/cce_logo.png"/>
                    &nbsp;&nbsp;
                    <em>Version 0.0.2</em>
                </div>
            </div>
        );
    }
};