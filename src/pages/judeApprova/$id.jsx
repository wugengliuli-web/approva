import React, { Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Button,  message, Timeline } from 'antd';
import PDF from 'react-pdf-js';
import axios from 'axios'
import router from 'umi/router';
import { ip } from '../../utils/ip.js'
class JudeApprova extends Component {

    state = {
        approvalTasks: [],  //待审批列表
        file: '',
        status: ''
    }

    async componentDidMount() {
        const phone = this.props.location.query.phone
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
        const { approvalFileWsid, approvalTasks } = processInstance
        const fileRes = await axios.get(ip + '/approval-process/download-file', {
            params: {
                fileWsid: approvalFileWsid
            }
        })
        const { data } = fileRes

        const statusRes = await axios.post(ip + '/approval-process/handle-status', {
            phone,
            processInstanceId: id
        })

        const { data: { status } } = statusRes

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
                            <Timeline className={styles.approvasContent}>
                                {
                                    this.state.approvalTasks.map((item, index) => {
                                        return (
                                            <Timeline.Item color={ item.result === 'PASSED' ? 'green' : item.result === 'REFUSE' ? 'red' : 'blue'} key={item.taskId} className={styles.approvasItemWrapper}>
                                                <div className={styles.approvasItemTitle}>审批组{index + 1}</div>
                                                    <Timeline>
                                                        {
                                                            item.candidates.map((key, value) => {
                                                                return <Timeline.Item key={key.name + value + key.phone} color={ item.approver &&  item.approver.name === key.name ? 'green' : 'blue'}>
                                                                    <p>{key.name}</p>
                                                                </Timeline.Item>
                                                            })
                                                        }
                                                        {
                                                            item.endDateTime ?
                                                            <Timeline.Item color='green'>
                                                                <p>{this.timestampToTime(new Date(item.endDateTime))}</p>
                                                            </Timeline.Item>
                                                            :
                                                            null
                                                        }
                                                        {
                                                            <Timeline.Item color={ item.result === 'PASSED' ? 'green' : item.result === 'REFUSE' ? 'red' : 'blue'}>
                                                                <p>审批状态: {this.getStatus(item.result)}</p>
                                                            </Timeline.Item>
                                                            
                                                        }
                                                    </Timeline>
                                            </Timeline.Item>
                                        )
                                    })
                                }
                            </Timeline>
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
                    <div className={styles.footer}>
                        <Button onClick={() => this.goBack(true)} className={styles.btn} size="large" type="primary">返回</Button>
                    </div>
                }
            </div>
        )
    }

    timestampToTime = now => {
        var year=now.getFullYear();  //取得4位数的年份
        var month=now.getMonth()+1;  //取得日期中的月份，其中0表示1月，11表示12月
        var date=now.getDate();      //返回日期月份中的天数（1到31）
        var hour=now.getHours();     //返回日期中的小时数（0到23）
        var minute=now.getMinutes(); //返回日期中的分钟数（0到59）
        var second=now.getSeconds(); //返回日期中的秒数（0到59）
        return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
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
            case 'WAITING':
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

    goBack = e => {
        router.goBack()
    }

}


export default JudeApprova