import React, { Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Button, Input, message, Table, Tag } from 'antd';
import PDF from 'react-pdf-js';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios'
import { ip } from '../../utils/ip.js'
import router from 'umi/router';


class List extends Component {

    state = {
        searchPhone: sessionStorage.getItem('searchPhone') || '',
        list: [],  //待审批列表
        loading: false
    }

    columns = [
        {
            align: 'center',
            title: '文档',
            dataIndex: 'PDFname',
            key: 'PDFname',
            render: text => <span>{text}</span>,
        },
        {
            align: 'center',
            title: '状态',
            key: 'status',
            dataIndex: 'status',
            render: tags => (
                /**
                 * UNKNOWN(-1, "未知类型"), 
                    APPROVAL_ING(0, "审批中"), 
                    APPROVAL_PASSED(1, "审批通过"),
                    APPROVAL_REFUSE(2, "审批被拒绝")
                */
                <Tag color={tags === 'APPROVAL_PASSED' ? '#87d068' : tags === 'APPROVAL_REFUSE' ? '#f50' : '#2db7f5'} >
                    {this.getStatus(tags)}
                </Tag>
            ),
        },
        {
            align: 'center',
            title: '立即查看',
            key: 'look',
            dataIndex: 'look',
            render: id => (
                <Button onClick={() => this.goNext(id)} type="primary">立即查看</Button>
            )
        }
    ];

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
                <Table loading={this.state.loading} columns={this.columns} dataSource={this.state.list} />
            </div>
        )
    }

    changeSearchPhone = e => {
        this.setState({
            searchPhone: e.target.value
        })
    }

    search = async e => {
        if (this.state.searchPhone === '') {
            this.setState({
                list: []
            })
            return
        }

        this.setState({
            list,
            loading: true
        })

        const res = await axios.get(ip + '/approval-processes', {
            params: {
                phone: this.state.searchPhone
            }
        })
        const { data: { code, approvalProcessInstances } } = res
        const list = approvalProcessInstances.map((item, index) => {
            return {
                PDFname: item.approvalFileName,
                key: item.approvalFileWsid + index,
                status: item.status,
                look: item.approvalProcessInstanceId
            }
        })
        if (!/0000$/.test(code)) {
            message.error('查询失败')
            return
        }
        this.setState({
            list,
            loading: false
        })
    }

    goNext = approvalProcessInstanceId => {
        sessionStorage.setItem('searchPhone', this.state.searchPhone)
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

    getStatus = status => {
        /**
         * UNKNOWN(-1, "未知类型"), 
            APPROVAL_ING(0, "审批中"), 
            APPROVAL_PASSED(1, "审批通过"),
            APPROVAL_REFUSE(2, "审批被拒绝")
         */
        switch(status) {
            case 'APPROVAL_PASSED':
                return '通过'
            case 'APPROVAL_REFUSE':
                return '拒绝'
            default:
                return '待审核'
        }
    }
}


export default List