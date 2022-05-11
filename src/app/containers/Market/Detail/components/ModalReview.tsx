import './ModalReview.stylus'

import { InfoCircleOutlined } from '@ant-design/icons'
import { useWeb3React } from '@web3-react/core'
import { Checkbox, Modal, Popover, Progress } from 'antd'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Action } from 'redux-actions'

import ShortAddress from '@/app/components/ShortAddress'

import { setMarketModalCheckoutVisble, setMarketModalReviewVisble } from '../../../../actions/baseAction'
import { IRootState } from '../../../../reducers/RootState'
import { getTimeTo } from '../../../../utils/time'

interface IProps {
    nftInfo: any
    contractName: string
}

export default forwardRef((props: IProps, ref) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const { account, deactivate, chainId } = useWeb3React()
    const { marketModalReviewVisble } = useSelector((state: IRootState) => state.base)
    const { nftInfo, contractName } = props
    // console.log('props', props)
    useImperativeHandle(ref, () => ({
        show: () => {
            setDialogOpen(true)
        },
        hide: () => {
            setDialogOpen(false)
        }
    }))

    useEffect(() => {
        setDialogOpen(marketModalReviewVisble)
    }, [marketModalReviewVisble])

    const dispatch = useDispatch()

    const closeModal = (): Action<boolean> => dispatch(setMarketModalReviewVisble(false))
    return account ? (
        <Modal
            visible={dialogOpen}
            onCancel={closeModal}
            footer={null}
            wrapClassName="ModalReview"
            centered
            destroyOnClose={true}
            closable={false}
            width={712}
        >
            <div className="modalTitle">
                <div className="title">Review Collection details</div>
                <em onClick={closeModal}>x</em>
            </div>
            <div className="modalMain">
                <div className="content">
                    <p>As an open marketplace,anyone can upload content,including content that may resemble others. Pelase review</p>
                    <div className="score-box">
                        <div className="head">
                            <div className="left">
                                <span>NFTBomb Confidence Score</span>
                                <Popover
                                    placement="right"
                                    content={
                                        <div style={{ width: '250px', fontSize: '12px' }}>
                                            based on the data we have，we provide a confidence score on collection and users to prevent fraud
                                        </div>
                                    }
                                    title=""
                                >
                                    <img src={require('../img/info-circle-fill.png')} />
                                    {/* <InfoCircleOutlined /> */}
                                </Popover>
                            </div>
                            <div className="right">
                                <Progress
                                    percent={50}
                                    showInfo={false}
                                    strokeColor={{
                                        '0%': '#FF00E5',
                                        '100%': '#FFA200'
                                    }}
                                />
                            </div>
                        </div>
                        <div className="body">
                            <div className="item">
                                <div className="name">Name</div>
                                <div className="value">{nftInfo?.name}</div>
                            </div>
                            <div className="item">
                                <div className="name">Created</div>
                                <div className="value">{getTimeTo(nftInfo?.create_time)}</div>
                            </div>
                            <div className="item">
                                <div className="name">Sales</div>
                                <div className="value">{nftInfo?.supply_num} Sales</div>
                            </div>
                            <div className="item">
                                <div className="name">Creator</div>
                                <div className="value" onClick={() => {}}>
                                    {/* {contractName} */}
                                    {nftInfo?.author_address ? <ShortAddress address={nftInfo?.author_address} name={contractName} /> : contractName}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="ModalBtn">
                <Checkbox
                    onChange={() => {
                        closeModal()
                        dispatch(setMarketModalCheckoutVisble(true))
                    }}
                >
                    I have reviewd this information and this is the correct collection
                </Checkbox>
            </div>
        </Modal>
    ) : null
})
