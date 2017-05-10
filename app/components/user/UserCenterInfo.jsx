'use strict';

import React, { Component, PropTypes } from 'react';
import _Input_ from './_Input_.jsx';

export default class UserCenterInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {name: 'Jack', job: '工',phone:'12',birthday:'1990',address:'beijing'},
            message: ''
        };
    }

    componentDidMount() {
        $.get('/api/user/getUserInfo', json => {
            //this.setState({ user: json.user });
            this.setState({ name: 'zhangbo', job: 'gongren',phone:'123456',birthday:'19900101',address:'shanghai' });
        });
    }

    handleChange = e =>  {
        console.dir(e.target);
        console.log("state",this.state);
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

                                <_Input_ onChange={ this.handleChange } label="姓名" name="name" value={ this.state.user.name }/>

                                <_Input_ onChange={ this.handleChange } label="职位" name="job" value={ this.state.user.job }/>

                                <_Input_ onChange={ this.handleChange } label="联系电话" name="phone" value={ this.state.user.phone }/>

                                <_Input_ onChange={ this.handleChange } label="生日" name="birthday" value={ this.state.user.birthday }/>

                                <_Input_ onChange={ this.handleChange } label="所在地" name="address" value={ this.state.user.address }/>

                                <li className="form-group row">
                                    <div className="col-sm-8 col-sm-offset-2">
                                        <button type="submit" onClick={ this.handleSubmit } className="btn btn-lg btn-primary btn-block">保存</button>
                                    </div>
                                </li>
                        </div>
                    </div>
                </div>

        );
    }
}
