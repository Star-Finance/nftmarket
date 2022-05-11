import './ModalResult.stylus'

import { LoadingOutlined } from '@ant-design/icons'
import { useWeb3React } from '@web3-react/core'
import { Modal } from 'antd'
import { Spin } from 'antd'
import React, { forwardRef, useImperativeHandle, useState } from 'react'

import ShortAddress from '@/app/components/ShortAddress'
import Icon from '@/assets/icons'

interface IProps {
    loading: boolean
    txid: string
    nftImgSrc: string
    nftName: string
}

export default forwardRef((props: IProps, ref) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const { account } = useWeb3React()
    const { loading, txid, nftImgSrc, nftName } = props
    useImperativeHandle(ref, () => ({
        show: () => {
            setDialogOpen(true)
        },
        hide: () => {
            setDialogOpen(false)
        }
    }))

    const closeModal = (): void => setDialogOpen(false)

    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

    return account ? (
        <>
            <Modal
                visible={dialogOpen}
                onCancel={closeModal}
                footer={null}
                wrapClassName="ModalResult"
                centered
                destroyOnClose={true}
                closable={false}
                width={712}
            >
                <div className="modalTitle">
                    <div className="title">Your purchase has processing！</div>
                    <em onClick={closeModal}>x</em>
                </div>
                <div className="modalMain">
                    <div className="content">
                        {loading ? (
                            <p>Woot! You just purchased {nftName}.It should be confirmed on the blockchain shortly.</p>
                        ) : (
                            <p>Woot! You just purchased {nftName}.It's been confirmed on the blockchain.</p>
                        )}

                        <div className="body">
                            <div className="left" style={{ backgroundImage: `url(${nftImgSrc})` }} />
                            <div className="right">
                                <div className="top">
                                    <div className="t-left">
                                        <div className="name">Status</div>
                                        {!loading ? (
                                            <div className="value">
                                                <img src={require(`../img/chenggong.png`)} /> Complete
                                            </div>
                                        ) : (
                                            <div className="value">
                                                <Spin indicator={antIcon} /> Processing
                                            </div>
                                        )}
                                    </div>
                                    <div className="t-right">
                                        <div className="name">Transation Hash</div>
                                        <div className="value">
                                            <ShortAddress address={txid} />
                                        </div>
                                    </div>
                                </div>
                                <div className="bottom">
                                    <div className="title">SHARE</div>
                                    <div className="shares">
                                        <a href="https://twitter.com/NFTBomb" target="__blank">
                                            <Icon name="twitter" className="item" />
                                        </a>
                                        <a href="https://nftbomb-97786.medium.com" target="__blank">
                                            <Icon name="medium" className="item" />
                                        </a>
                                        <a href="https://t.me/NFTBombEn" target="__blank">
                                            <Icon name="telegram" className="item" />
                                        </a>
                                        <a target="__blank">
                                            <Icon name="sharelink" className="item" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    ) : null
})
