'use strict';

import React, { Component, PropTypes } from 'react';
import RowInput from '../common/RowInput.jsx';
import RowSubmit from '../common/RowSubmit.jsx';

export default class UserCenterInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {name: 'Jack', job: '工',phone:'12',birthday:'1990',address:'beijing'},
            msg: ''
        };
    }

    componentDidMount() {
        $.get('/api/user/getUserInfo', json => {
            //this.setState({ user: json.user });
            this.setState({ name: 'zhangbo', job: 'gongren',phone:'123456',birthday:'19900101',address:'shanghai' });
        });
    }

    handleChange = e =>  {
        let name = e.target.name;
        let value = e.target.value;

        let obj = {};
        obj[name] = value;
        this.setState({ user: Object.assign(this.state.user, obj) });
    };


    handleSubmit = () => {
        let user  = this.state.user;
        $.post('/api/user/updateUserInfo', { user } , json => {
            if (json.status) {

            }
            else {
                //console.log(json.message);
                console.log("信息错误");
            }
        });

    };

    render () {
        return (
                <div className="main_right">
                    <div>
                        <p className="perinfo loginaccount">个人信息</p>
                    </div>
                    <div className="">
                        <div className="form-horizontal info-group" role="form">
                                <li className="form-group row">
                                    <label className="control-label col-sm-3 col-lg-2 avatar-label">头像</label>
                                    <div className="col-sm-8">
                                        <div className="choosefile">
                                            <img className="img_2  img-circle" src="http://boom-static.static.cceato.com/boom/imgs/login-logo-2.gif" alt="" />
                                            <a href="javascript:;" className="file">选择文件
                                                <input type="file" name="" id="" />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="clear"></div>
                                </li>

                                <RowInput onChange={ this.handleChange } name="name" label="姓名" inputClassName="col-sm-8" labelClassName="col-sm-3" />
                                <RowInput onChange={ this.handleChange } name="job" label="职位" inputClassName="col-sm-8" labelClassName="col-sm-3" />
                                <RowInput onChange={ this.handleChange } name="phone" isPhone label="联系电话" inputClassName="col-sm-8" labelClassName="col-sm-3" />
                                <RowInput onChange={ this.handleChange } name="birthday" label="生日" inputClassName="col-sm-8" labelClassName="col-sm-3" />
                                <RowInput onChange={ this.handleChange } name="address" label="所在地" inputClassName="col-sm-8" labelClassName="col-sm-3" />

                                <RowSubmit btnClassName="col-sm-8" onSubmit={ this.handleSubmit } name="保存" msg={ this.state.msg }/>
                        </div>
                    </div>
                </div>

        );
    }
}
