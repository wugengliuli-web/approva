import React, { Component } from 'react'
import styles from './index.less'
import { Button, Input, Modal, Upload, message, Timeline,Spin } from 'antd';
import {
    PhoneOutlined,
    TeamOutlined,
    CloseCircleOutlined,
    UserAddOutlined,
    InboxOutlined
} from '@ant-design/icons';
import PDF from 'react-pdf-js'
import rourte from 'dva'
const { Dragger } = Upload;
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios'
import { ip,notifyUrl } from '../../utils/ip.js'
import router from 'umi/router';
class Login extends Component {

    maxSize = 1024 * 1024 * 10

    uploadProps = {
        name: 'file',
        multiple:  false,
        showUploadList: false,
        beforeUpload: info => {
            const { type, size } = info
            if(!/application\/pdf/.test(type)) {
                message.error('格式不正确')
                return false
            }
            if(size > this.maxSize) {
                message.error('大小不超过10MB')
                return false
            }
            this.setState({isUploading: true, file: undefined})
            return true
        },
        customRequest: async info => {
            const { file } = info
            const fd = new FormData()
            fd.append('file', file)
            const res = await axios.post( ip + '/approval-process/upload-file', fd)
            const { data: { code, base64, fileWsid } } = res

            if(/0000$/.test(code)) {
                message.success('上传成功')
                this.setState({
                    file: 'data:application/pdf;base64,' + base64,
                    fileWsid,
                    isUploading:false
                })
            } else {
                message.error('上传失败')
            }
        }
    };

    state = {
        visible: false,
        modalLayOut: {
            cancelText: '取消',
            title: '添加审批组',
            centered: true,
            confirmLoading: false,
            okText: '添加',
            maskClosable: false,
            okButtonProps: {
                disabled: true
            }
        },
        formLayOut: [
            { id: Math.random() * 1000, name: '', phone: '' }
        ],
        approvas: [],  //待审批列表
        file: '',
        isUploading: false
    }

    get canGo() {
        if(this.state.approvas.length === 0 || !this.state.file) return true
        return false
    }

    render() {
        return (
            <div className={styles.page}>
                <div className={styles.head}>
                    <div className={styles.pdfWrapper}>
                        {
                            this.state.file ?
                                <iframe src={this.state.file} width="100%" height="100%"/>
                                :
                                <Dragger {...this.uploadProps}>
                                    {
                                        this.state.isUploading ?
                                            <Spin></Spin> :
                                            <p className="ant-upload-drag-icon">
                                                <InboxOutlined/>
                                                <p className="ant-upload-text">点击上传PDF文档</p>
                                            </p>
                                    }
                                </Dragger>
                        }
                    </div>
                    <div className={styles.approvas}>
                        <div>
                            <div className={styles.approvasTitle}>审批人列表</div>
                            <Timeline className={styles.approvasContent}>
                                {
                                    this.state.approvas.map((item, index) => {
                                        return (
                                            <Timeline.Item color="blue" key={index} className={styles.approvasItemWrapper}>
                                                <div className={styles.approvasItemTitle}>审批组{index + 1} <CloseCircleOutlined onClick={e => this.delApprover(index)} className={styles.close} /> </div>

                                                <Timeline>
                                                    {
                                                        item.contacts.map((key, value) => {
                                                            return <Timeline.Item color="blue" className={styles.approvasItemContent} key={key.phone + key.name + value}>
                                                                <p>
                                                                    <span className={styles.approvasName}>姓名：{key.name}</span>
                                                                    <span className={styles.approvasPhone}>手机：{key.phone}</span>
                                                                </p>
                                                            </Timeline.Item>
                                                        })
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
                <div className={styles.footer}>
                    {
                        this.state.file || this.state.isUploading ?
                            <Upload {...this.uploadProps} >
                                <Button>
                                    <UploadOutlined/>重新选择文件
                                </Button>
                            </Upload>
                            :
                            null
                    }
                    <Button onClick={this.showModel} className={styles.btn} size="large" type="primary">添加审批人</Button>
                    <Button onClick={this.go} disabled={this.canGo} className={styles.btn} size="large" type="primary">发起审批</Button>
                    <Button onClick={this.goBack}   className={styles.btn} size="large" type="primary">返回</Button>
                </div>

                <Modal
                    {...this.state.modalLayOut}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.onCancel}
                >
                    {
                        this.state.formLayOut.map((item, index) => {
                            return (
                                <div className={styles.formContainer} key={item.id}>
                                    <div className={styles.formTitle}>审批人{index + 1} {index >= 1 ? <CloseCircleOutlined onClick={e => this.del(index)} className={styles.close} /> : null} </div>
                                    <div className={styles.formWrapper}>
                                        <Input onChange={e => this.setFormLayOut(index, 'name', e.target.value)} className={styles.input} size="small" placeholder="请输入姓名" prefix={<TeamOutlined />} />
                                        <Input onChange={e => this.setFormLayOut(index, 'phone', e.target.value)} className={styles.input} size="small" placeholder="请输入手机号" prefix={<PhoneOutlined />} />
                                    </div>
                                </div>
                            )
                        })
                    }
                    {
                        this.state.formLayOut.length < 5 ?
                            <div className={styles.addWrapper}>
                                <UserAddOutlined onClick={this.add} className={styles.add} />
                            </div>
                            :
                            null
                    }
                </Modal>
            </div>
        )
    }

    canNext = e => {
        setTimeout(() => {
            const disabled = !(this.state.formLayOut.every(item => {
                return item.name && item.phone
            }))
            const modalLayOut = { ...this.state.modalLayOut }
            modalLayOut['okButtonProps']['disabled'] = disabled
            this.setState({
                modalLayOut
            })
        })
    }

    del = index => {
        this.canNext()
        const formLayOut = [...this.state.formLayOut]
        formLayOut.splice(index, 1)
        this.setState({
            formLayOut
        })
    }

    add = e => {
        this.canNext()
        const formLayOut = [...this.state.formLayOut]
        formLayOut.push({
            name: '',
            phone: '',
            id: Math.random()
        })
        this.setState({
            formLayOut
        })
    }

    setFormLayOut = (index, attribute, value) => {
        this.canNext()
        const formLayOut = [... this.state.formLayOut]
        formLayOut[index][attribute] = value
        this.setState({
            formLayOut
        })
    }

    //添加审批人
    handleOk = e => {
        this.canNext()
        const formLayOut = [...this.state.formLayOut]
        const approvas = [...this.state.approvas]
        approvas.push({
            contacts: formLayOut
        })
        this.setState({
            approvas,
            formLayOut: [
                { id: Math.random() * 1000, name: '', phone: '' }
            ],
            visible: false
        })
    }

    onCancel = e => {
        this.setState({
            visible: false
        })
    }

    //弹起model框
    showModel = e => {
        this.setState({
            visible: true
        })
    }

    //发起审批
    go = async e => {
        const res = await axios.post(ip + '/approval-process', {
            notifyUrl: notifyUrl,
            customTag: '123',
            approvalFileWsid: this.state.fileWsid,
            approvers: this.state.approvas
        })
        const { data: { code } } = res
        if(/0000$/.test(code)) {
            message.success('发起成功')
            setTimeout(() => {
                router.goBack()
            }, 2000)
        } else {
            message.error('发起失败')
        }
    }
    delApprover = index =>{
        console.log(index)
        const approvas = [...this.state.approvas]
        approvas.splice(index,1)
        this.setState({
            approvas
        })
    }
    goBack =()=>{
        router.goBack()
    }
}


export default Login