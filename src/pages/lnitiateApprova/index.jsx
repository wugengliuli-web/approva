import React, { Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Button, Input, Modal, Upload, message } from 'antd';
import {
    PhoneOutlined,
    TeamOutlined,
    CloseCircleOutlined,
    UserAddOutlined,
    InboxOutlined
} from '@ant-design/icons';
import PDF from 'react-pdf-js';
const { Dragger } = Upload;
import axios from 'axios'
@connect(({ test }) => ({ test }))
class Login extends Component {
    uploadProps = {
        name: 'file',
        multiple:  false,
        showUploadList: false,
        beforeUpload(info) {
            const { type } = info
            if(!/application\/pdf/.test(type)) {
                message.error('格式不正确')
                return Promise.resolve(info)
            }
            return Promise.reject(info)
        },
        onChange: info => {
            console.log(info)
        }
    };

    state = {
        visible: false,
        modalLayOut: {
            cancelText: '取消',
            title: '发起审批',
            centered: true,
            confirmLoading: false,
            okText: '发起',
            maskClosable: false,
            okButtonProps: {
                disabled: true
            }
        },
        formLayOut: [
            { id: Math.random() * 1000, name: '', phone: '' },
            { id: Math.random() * 1000, name: '', phone: '' }
        ],
        approvas: [],  //待审批列表
        file: 'file:///C:/Users/DELL/Desktop/西南科技大学+21届+web前端(暑期实习)_马羽.pdf'
    }

    componentDidMount() {

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
                            <div className={styles.approvasTitle}>待审批列表</div>
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
                        <div className={styles.uploadPDFWrapper}>
                            <Dragger {...this.uploadProps}>
                                <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">点击上传PDF文档</p>
                            </Dragger>
                        </div>
                    </div>
                </div>
                <div className={styles.footer}>
                    <Button onClick={this.showModel} className={styles.btn} size="large" type="primary">添加审批人</Button>

                    <Button  className={styles.btn} size="large" type="primary">发起审批</Button>
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
                                    <div className={styles.formTitle}>审批人{index + 1} {index >= 2 ? <CloseCircleOutlined onClick={e => this.del(index)} className={styles.close} /> : null} </div>
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
        const formLayOut = [...this.state.formLayOut]
        const approvas = [...this.state.approvas] 
        approvas.push({
            contacts: formLayOut
        })
        this.setState({
            approvas,
            formLayOut: [
                { id: Math.random() * 1000, name: '', phone: '' },
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
}


export default Login