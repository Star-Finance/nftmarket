import './dialog.stylus'

import { Modal } from 'antd'
import classnames from 'classnames'
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import sleep from '../../utils/sleep'
import StatusToast, { IStatusToast } from '../StatusToast'

type IMsg = {
    title: string
    text: string
}

interface IProps {
    title?: string
    children?: React.ReactNode
    msg?: {
        loading?: IMsg
        pending?: IMsg
        confirm?: IMsg
        error?: IMsg
    }
    exec(callback: () => void): Promise<null | string>
    onSuccess?: () => void
    onCancel?: () => void
    className?: string
    width?: number
    showButton?: boolean
    confirmStyle?: string
}

export interface IRefDOM {
    show(): void
    hide(): void
    confirm(): void
}

export default forwardRef((props: IProps, ref) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const StatusToastRef = useRef<IStatusToast>()

    useImperativeHandle(ref, () => ({
        show: () => {
            setDialogOpen(true)
        },
        hide: () => {
            setDialogOpen(false)
        },
        confirm: () => {
            confirm()
        }
    }))

    const confirm = async (): Promise<void> => {
        if (!StatusToastRef.current) return
        StatusToastRef.current?.show({
            type: 'loading',
            title: props.msg?.loading?.title || 'Transaction Confirmation',
            text: props.msg?.loading?.text || 'Please confirm the transaction in your wallet'
        })
        const res = await props.exec(() => {
            if (!StatusToastRef.current) return
            StatusToastRef.current?.reset({
                type: 'pending',
                title: props.msg?.pending?.title || 'Transaction Confirmation',
                text: props.msg?.pending?.text || 'Transaction Pending'
            })
        })
        if (res) {
            StatusToastRef.current?.hide({
                type: 'successfully',
                title: props.msg?.confirm?.title || 'Transaction Confirmation',
                text: props.msg?.confirm?.text || 'Transaction Confirmed'
            })
            if (props.onSuccess) {
                await sleep(3)
                props.onSuccess()
            }
        } else {
            StatusToastRef.current?.hide({
                type: 'error',
                title: props.msg?.error?.title || 'Transaction Error',
                text: props.msg?.error?.text || 'Please try again'
            })
        }
        setDialogOpen(false)
    }

    const handleCancel = (): void => {
        setDialogOpen(false)
        if (props.onCancel) {
            props.onCancel()
        }
    }

    return (
        <>
            <Modal
                visible={dialogOpen}
                footer={null}
                wrapClassName="customModal"
                centered
                destroyOnClose={true}
                closable={false}
                width={props.width ? props.width : 450}
            >
                <div className="modalTitle">
                    <span>{props.title}</span>
                    <em onClick={() => handleCancel()}>x</em>
                </div>

                <div className="modalMain">
                    <div className={classnames('main', `${props.className}`)}>{props.children}</div>
                    {props.showButton !== false && (
                        <div className="btnWrap">
                            <div className="btn cancel" onClick={() => handleCancel()}>
                                Cancel
                            </div>
                            <div className="btn confirm" style={{ background: props.confirmStyle }} onClick={() => confirm()}>
                                Confirm
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
            <StatusToast ref={StatusToastRef} />
        </>
    )
})
