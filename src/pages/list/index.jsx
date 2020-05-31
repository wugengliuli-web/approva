import React, { Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Button, Input, message } from 'antd';
import PDF from 'react-pdf-js';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios'
import { ip } from '../../utils/ip.js'
import router from 'umi/router';
class List extends Component {

    state = {
        searchPhone: '',
        list: [],  //待审批列表
    }

    componentDidMount() {
        //获取审批组列表

    }



    render() {
        return (
            <div className={styles.page}>
                <div className={styles.searchWrapper}>
                    <Input onChange={this.changeSearchPhone} className={styles.input} placeholder="输入需要查询的手机号" />
                    <Button onClick={this.search} className={styles.btn} type="primary">搜索</Button>
                    <Button onClick={this.gogogo} className={styles.btn} type="primary">发起审批</Button>
                </div>
                {
                    this.state.list.map((item, index) => {
                        return (
                            <div key={item.approvalProcessInstanceId}>
                                {
                                    item.approvalTasks.map((value, key) => {
                                        return (
                                            <div onClick={() => this.goNext(item.approvalProcessInstanceId)} key={value.taskId} className={styles.approvasItemWrapper}>
                                                <div className={styles.approvasItemTitle}>
                                                    {
                                                        value.candidates.map((i, k) => {
                                                            return (
                                                                <div className={styles.approvasItemContent} key={i.phone + i.name + k}>
                                                                    <span className={styles.approvasName}>姓名：{i.name}</span>
                                                                    <span className={styles.approvasPhone}>手机：{i.phone}</span>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    changeSearchPhone = e => {
        this.setState({
            searchPhone: e.target.value
        })
    }

    search = async e => {
        if(this.state.searchPhone === '') {
            this.setState({
                list: []
            })
            return
        }

        const res = await axios.get(ip + '/approval-processes', {
            params: {
                phone: this.state.searchPhone
            }
        })
        const { data: { code, approvalProcessInstances } } = res
        if(!/0000$/.test(code)) {
            message.error('查询失败')
            return
        }
        this.setState({
            list: approvalProcessInstances
        })
    }

    goNext = approvalProcessInstanceId => {
        router.push({
            pathname: `/judeApprova/${approvalProcessInstanceId}`,
            query: {
                phone: this.state.searchPhone
            }
        })
    }

    gogogo = e => {
        router.push({
            pathname: '/lnitiateApprova'
        })
    }

}


export default List