import './shareDialog.stylus'

import { useWeb3React } from '@web3-react/core'
import { Button, Modal } from 'antd'
import classNames from 'classnames'
import React, { forwardRef, useImperativeHandle, useState } from 'react'

import Image from '@/app/components/Image'
import Icon from '@/assets/icons'

interface IProps {
    img: string
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
        <Modal
            width={700}
            visible={show}
            onCancel={() => hide()}
            footer={null}
            wrapClassName="shareDialog"
            centered
            destroyOnClose={true}
            closable={false}
        >
            <div className="modalTitle">
                <div className="title">Your item is now listed for sale</div>
                <em onClick={() => hide()}>x</em>
            </div>
            <div className="modalMain">
                <div className="content">
                    <Image height={240} width={240} src={params?.img} className="img" />
                    <div className="btn" onClick={() => hide()}>
                        View item
                    </div>
                </div>
            </div>
            <div className="modalFooter">
                <a href="https://twitter.com/NFTBomb" target="__blank">
                    <Icon name="twitter" className="item" />
                </a>
                <a href="https://nftbomb-97786.medium.com" target="__blank">
                    <Icon name="medium" className="item" />
                </a>
                <Icon name="discord" className="item" />
                <a href="https://t.me/NFTBombEn" target="__blank">
                    <Icon name="telegram" className="item" />
                </a>
            </div>
        </Modal>
    )
})

export default LongDialog
