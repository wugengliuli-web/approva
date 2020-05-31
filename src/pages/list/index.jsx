import React, { Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Button, Input, message } from 'antd';
import PDF from 'react-pdf-js';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios'
import { ip } from '../../utils/ip.js'
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
                </div>
                {
                    this.state.list.map((item, index) => {
                        return (
                            <div key={index}>
                                {
                                    item.approvalTasks.map((value, key) => {
                                        return (
                                            <div></div>
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

}


export default List