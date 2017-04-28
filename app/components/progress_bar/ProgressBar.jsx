'use strict';

import React, { Component } from 'react';
import './progress-bar.css';

export default class ProgressBar extends Component {
    constructor(props) {
        super(props);
    }

    render () {

        const { list, current } = this.props;

        let xxoo = i => {
            if (i < current) return 'passed';
            else if (i === current) return 'active';
            else return '';
        };

        return (
            <div>
                <ul>
                    { list.each ( l => {
                        return <li className={ xxoo(0) } />
                    }) }
                </ul>
            </div>
        );
    }
}
