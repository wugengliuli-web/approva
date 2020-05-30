import React, { Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Button, Input, Modal, Upload, message } from 'antd';
import PDF from 'react-pdf-js';
import axios from 'axios'
class Login extends Component {

    state = {
        approvas: [],  //待审批列表
        file: 'file:///C:/Users/DELL/Desktop/西南科技大学+21届+web前端(暑期实习)_马羽.pdf'
    }

    componentDidMount() {
        //获取审批组列表
    }



    render() {
        return (
            <div className={styles.page}>
                <div className={styles.head}>
                    <div className={styles.pdfWrapper}>
                        {
                            this.state.file ?
                            <embed src={this.file} type="application/pdf" width="100%" height="100%"></embed>
                            :
                            null
                        }
                    </div>
                    <div className={styles.approvas}>
                        <div>
                            <div className={styles.approvasTitle}>审批组列表</div>
                            <div className={styles.approvasContent}>
                                {
                                    this.state.approvas.map((item, index) => {
                                        return (
                                            <div key={index} className={styles.approvasItemWrapper}>
                                                <div className={styles.approvasItemTitle}>待审批组{index + 1}</div>
                                                {
                                                    item.contacts.map((key, value) => {
                                                        return <div className={styles.approvasItemContent} key={key.phone + key.name}>
                                                            <span className={styles.approvasName}>姓名：{key.name}</span>
                                                            <span className={styles.approvasPhone}>手机：{key.phone}</span>
                                                        </div>
                                                    })
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.footer}>
                    <Button  className={styles.btn} size="large" type="primary">通过</Button>

                    <Button  className={styles.btn} size="large" type="primary">拒绝</Button>
                </div>
            </div>
        )
    }

}


export default Login