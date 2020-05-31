import React, { Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Button,  message } from 'antd';
import PDF from 'react-pdf-js';
import axios from 'axios'
import { ip } from '../../utils/ip.js'
class JudeApprova extends Component {

    state = {
        approvalTasks: [],  //待审批列表
        file: '',
        status: ''
    }

    async componentDidMount() {
        //获取审批组列表
        const { id } = this.props.match.params
        const res = await axios.get(ip + '/approval-process', {
            params: {
                processInstanceId: id
            }
        })
        const { data: { code, processInstance } } = res
        if(!/0000$/.test(code)) {
            message.error('获取信息失败')
            return
        }
        const { approvalFileWsid, approvalTasks, status } = processInstance
        const fileRes = await axios.get(ip + '/approval-process/download-file', {
            params: {
                fileWsid: approvalFileWsid
            }
        })
        const { data } = fileRes
        this.setState({
            approvalTasks,
            file: 'data:application/pdf;base64,' + data,
            status
        })
    }



    render() {
        return (
            <div className={styles.page}>
                <div className={styles.head}>
                    <div className={styles.pdfWrapper}>
                        {
                            this.state.file ?
                            <iframe src={this.state.file} width="100%" height="100%" />
                            :
                            null
                        }
                    </div>
                    <div className={styles.approvas}>
                        <div>
                            <div className={styles.approvasTitle}>审批组列表</div>
                            <div className={styles.approvasContent}>
                                {
                                    this.state.approvalTasks.map((item, index) => {
                                        return (
                                            <div key={item.taskId} className={styles.approvasItemWrapper}>
                                                <div className={styles.approvasItemTitle}>审批组{index + 1}</div>
                                                {
                                                    item.approver ?
                                                    <div className={styles.approvasItemContent}>
                                                        <div>审批人</div>
                                                        <span className={styles.approvasName}>姓名：{item.approver.name}</span>
                                                        <span className={styles.approvasPhone}>手机：{item.approver.phone}</span>
                                                    </div>
                                                    :
                                                    null
                                                }
                                                {
                                                    item.candidates.map((key, value) => {
                                                        return <div className={styles.approvasItemContent} key={key.phone + key.name}>
                                                            <span className={styles.approvasName}>姓名：{key.name}</span>
                                                            <span className={styles.approvasPhone}>手机：{key.phone}</span>
                                                        </div>
                                                    })
                                                }
                                                <div>审批状态: {this.getStatus(item.result)}</div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.getProcess(this.state.status) ?
                    <div className={styles.footer}>
                        <Button onClick={() => this.approva(true)} className={styles.btn} size="large" type="primary">通过</Button>

                        <Button onClick={() => this.approva(false)} className={styles.btn} size="large" type="primary">拒绝</Button>
                    </div>
                    :
                    null
                }
            </div>
        )
    }

    getStatus = status => {
        /**
         *  UNKNOWN(-1, "未知类型"), 
            TASK_FINISHED(0,"任务结束"),
            PASSED(1, "通过"),
            REFUSE(2, "拒绝"),
            WAITING(3,"等待处理"),
            WAITING_OTHER_HANDLE(4,"等待他人处理")
         */

        switch(status) {
            case 'UNKNOWN':
                return '未知'
            case 'TASK_FINISHED':
                return '任务结束'
            case 'PASSED':
                return '通过'
            case 'REFUSE':
                return '拒绝'
            case 'WAITING':
                return '等待处理'
            default:
                return '等待他人处理'
        }
    }


    getProcess = status => {
        /**
         * UNKNOWN(-1, "未知类型"), 
            APPROVAL_ING(0, "审批中"), 
            APPROVAL_PASSED(1, "审批通过"),
            APPROVAL_REFUSE(2, "审批被拒绝")
         */
        switch(status) {
            case 'APPROVAL_ING':
                return true
            default:
                return false
        }
    }

    approva = async status => {
        const phone = this.props.location.query.phone
        const { id } = this.props.match.params
        const res = await axios.post(ip + '/approval-process/approval', {
            "processInstanceId": id,
            "phone": phone,
            "passed": status,
            "reason": "145456"
        })
        const { data: { code } } = res
        if(/0000$/.test(code)) {
            message.success('操作成功')
            location.reload() 
        } else {
            message.error('操作失败')
        }
    }
    
}


export default JudeApprova