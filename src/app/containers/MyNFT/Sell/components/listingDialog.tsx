import './listingDialog.stylus'

import { useWeb3React } from '@web3-react/core'
import { Button, Modal } from 'antd'
import classNames from 'classnames'
import React, { forwardRef, useImperativeHandle, useState } from 'react'

import Icon from '@/assets/icons'

interface IProps {
    number: number
}

export interface IDialog {
    show(): void
    hide(): void
}

const LongDialog = forwardRef((props, ref) => {
    const [params, setParams] = useState<IProps>()
    const [show, setShow] = useState(false)
    const { account, deactivate, chainId } = useWeb3React()

    const hide = (): void => {
        setShow(false)
        setParams(undefined)
    }

    useImperativeHandle(ref, () => ({
        show: (openProps: IProps) => {
            setParams(openProps)
            setShow(true)
        },
        hide
    }))

    return (
        <Modal visible={show} onCancel={() => hide()} footer={null} wrapClassName="listingDialog" centered destroyOnClose={true} closable={false}>
            <div className="modalTitle">
                <div className="title">Complete your listing</div>
                <em onClick={() => hide()}>x</em>
            </div>
            <div className="modalMain">
                <div className="content">
                    <div className="item">
                        <img src={require('../img/one.png')} alt="" />
                        <div className="text">
                            <div>Initialize your wallet</div>
                            <div>To get set up for selling on NFTBomb for the first time, you must initialize your wallet</div>
                        </div>
                        <Button className={classNames('btn', 'done')}>In progress</Button>
                    </div>
                    <div className="item">
                        <img src={require('../img/two.png')} alt="" />
                        <div className="text">
                            <div>Approve token</div>
                            <div>To get set up for listings for the first time, you must approve the token for trading</div>
                        </div>
                        <Button className={classNames('btn')}>In progress</Button>
                    </div>
                    <div className="item">
                        <img src={require('../img/three.png')} alt="" />
                        <div className="text">
                            <div>Confirm {params?.number} BTC listing</div>
                            <div>Accept the signature request in your wallet and wait for your listing to process.</div>
                        </div>
                        <Button className={classNames('btn', 'done')}>In progress</Button>
                    </div>
                </div>
            </div>
        </Modal>
    )
})

export default LongDialog
