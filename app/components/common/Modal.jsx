'use strict';

import React, { Component, PropTypes } from 'react'

export default class Modal extends Component {
    render() {
        return (
            <div className="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                            <h4 className="modal-title" id="myModalLabel">更改头像</h4>
                        </div>
                        <div className="modal-body">
                            <img src="" alt=""/>
                            <img src="" alt=""/>
                            <img src="" alt=""/>
                            <img src="" alt=""/>
                            <img src="" alt=""/>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
                            <button type="submit" className="btn btn-primary">提交更改</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};