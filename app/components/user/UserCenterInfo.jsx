'use strict';

import React, { Component, PropTypes } from 'react';
import DatePicker from 'react-datepicker';
import '../../../public/css/react-datepicker.css';
import moment from 'moment';
import RowInput from '../common/RowInput.jsx';
import RowSubmit from '../common/RowSubmit.jsx';

export default class UserCenterInfo extends Component {

    constructor(props) {
        super(props);

        let date = new Date();
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        this.state = {
            account: { },
            msg: '',
            startDate: moment(firstDay),
            endDate: moment(lastDay)
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ account: nextProps.account });
    }


    handleChange = e =>  {
        let name = e.target.name;
        let value = e.target.value;

        let obj = {};
        obj[name] = value;
        this.setState({ account: Object.assign(this.state.account, obj) });
    };


    handleSubmit = (savingCallback, savedCallback) => {
        let nv = this.refs.nickname.validate();
        let jv = this.refs.job.validate();
        let pv = this.refs.phone.validate();
        let bv = this.refs.birthday.validate();
        let av = this.refs.address.validate();
        if (!nv || !jv || !pv || !bv || !av) return;

        savingCallback();
        let account  = this.state.account;
        $.post('/api/userCenter/updateUserInfo', { account } , json => {
            savedCallback();
            this.setState({ msg: json.message });

            if (json.status) {

            } else {

            }
        });

    };

    render () {
        let account  = this.state.account;
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

                        <RowInput onChange={ this.handleChange }
                                  ref="nickname"
                                  name="nickname"
                                  value={ account.nickname }
                                  label="姓名"
                                  inputClassName="col-sm-8"
                                  labelClassName="col-sm-3" />

                        <RowInput onChange={ this.handleChange }
                                  ref="job"
                                  name="job"
                                  value={ account.job }
                                  label="职位"
                                  inputClassName="col-sm-8"
                                  labelClassName="col-sm-3" />

                        <RowInput onChange={ this.handleChange }
                                  ref="phone"
                                  name="phone"
                                  value={ account.phone }
                                  isPhone
                                  label="联系电话"
                                  inputClassName="col-sm-8"
                                  labelClassName="col-sm-3" />

                        <RowInput onChange={ this.handleChange }
                                  ref="birthday"
                                  name="birthday"
                                  value={ account.birthday }
                                  validateRegex="^\d{4}\-(0?[1-9]|1[0-2])(\-(0?[1-9]|[1-2][0-9]|3[0-1]))?$"
                                  validateMsg="格式形如: 1988-08-08 或 1988-08"
                                  label="生日"
                                  inputClassName="col-sm-8"
                                  labelClassName="col-sm-3" />

                        <RowInput onChange={ this.handleChange }
                                  ref="address"
                                  name="address"
                                  value={ account.address }
                                  label="所在地"
                                  inputClassName="col-sm-8"
                                  labelClassName="col-sm-3" />

                        <RowSubmit btnClassName="col-sm-8" onSubmit={ this.handleSubmit } name="保存" msg={ this.state.msg }/>
                    </div>
                </div>
            </div>
        );
    }
}

UserCenterInfo.propTypes = {
    account: PropTypes.object
};
