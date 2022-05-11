import './statusToast.stylus'

import { Modal } from 'antd'
import classnames from 'classnames'
import React, { forwardRef, useImperativeHandle, useState } from 'react'

import sleep from '../../utils/sleep'

export interface IStatusToast {
    show(params: IProps): void
    hide(params: IProps): void
    reset(params: IProps): void
}

export interface IProps {
    title: string | null
    text: string | null
    type: 'loading' | 'pending' | 'successfully' | 'error'
    callback?: () => void
}

export default forwardRef((props, ref) => {
    const [show, setShow] = useState(false)
    const [params, setParams] = useState<IProps>({
        title: null,
        text: null,
        type: 'loading'
    })

    useImperativeHandle(ref, () => ({
        show: (params: IProps) => {
            setShow(true)
            setParams(params)
        },
        hide: async (params: IProps) => {
            if (params) {
                setParams(params)
                await sleep(2)
                params.callback && params.callback()
            }
            setShow(false)
        },
        reset: async (params: IProps) => {
            setParams(params)
        }
    }))

    return (
        <Modal
            visible={show}
            onCancel={() => setShow(false)}
            footer={null}
            wrapClassName="statusToast"
            centered
            closable={false}
            width={380}
            maskClosable={false}
            destroyOnClose={true}
        >
            <div className={classnames('statsContent', params.type, { loading: params.type === 'pending' })}>
                <div className="statusIcon">
                    <div className="icon" />
                </div>
                <div className="statusMain">
                    <div className="statusTitle">{params.title}</div>
                    <div className="statusText">{params.text}</div>
                </div>
            </div>
        </Modal>
    )
})
