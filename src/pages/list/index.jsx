import React, { Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Button, Input, Modal, Upload, message } from 'antd';
import PDF from 'react-pdf-js';
import axios from 'axios'
class Login extends Component {

    state = {
        list: [],  //待审批列表
        file: 'file:///C:/Users/DELL/Desktop/西南科技大学+21届+web前端(暑期实习)_马羽.pdf'
    }

    componentDidMount() {
        //获取审批组列表
    }



    render() {
        return (
            <div className={styles.page}>
                {
                    this.state.list.map((item, index) => {
                        return (
                            <div key={index}></div>
                        )
                    })
                }
            </div>
        )
    }

}


export default Login