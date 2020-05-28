import React, { Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Button, Input, Modal } from 'antd';
import {
    PhoneOutlined,
    TeamOutlined,
    CloseCircleOutlined,
    UserAddOutlined
  } from '@ant-design/icons';
@connect(({ test }) => ({ test }))
class Login extends Component {

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
            { id: '456', name: '', phone: '' },
            { id: '789', name: '', phone: '' }
        ]
    }

    componentDidMount() {
        
    }

    

    render() {
        return (
            <div className={styles.page}>
                <div className={styles.head}>
                    <div className={styles.pdfWrapper}>
                    
                    </div>
                    <div className={styles.approvas}></div>
                </div>
                <div className={styles.footer}>
                    <Button onClick={this.showModel} className={styles.btn} size="large" type="primary">发起审批</Button>
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
                                    <div className={styles.formTitle}>审批人{index + 1} { index >= 2 ? <CloseCircleOutlined onClick={e => this.del(index)} className={styles.close} /> : null } </div>
                                    <div className={styles.formWrapper}>
                                        <Input onChange={ e => this.setFormLayOut(index, 'name', e.target.value) } className={styles.input} size="small" placeholder="请输入姓名" prefix={<TeamOutlined />} />
                                        <Input onChange={ e => this.setFormLayOut(index, 'phone', e.target.value) } className={styles.input} size="small" placeholder="请输入手机号" prefix={<PhoneOutlined />} />
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
            const modalLayOut = {...this.state.modalLayOut}
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

    onOk = e => {

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