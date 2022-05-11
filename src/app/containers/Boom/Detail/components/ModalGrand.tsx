import './ModalGrand.stylus'

import { Button, message } from 'antd'
import classnames from 'classnames'
import React, { forwardRef, useImperativeHandle, useState } from 'react'

import Modal from '@/app/components/Modal'
import ShortAddress from '@/app/components/ShortAddress'
import useBoomContract from '@/app/hooks/useBoomContract'

import { grandItem } from '../index'

interface IProps {
    grandBoom: grandItem
    account: string
}

export default forwardRef((props: IProps, ref) => {
    const { grandBoom, account } = props
    const [dialogOpen, setDialogOpen] = useState(false)
    const [claimLoading, setClaimLoading] = useState(false)
    const [isClaimedAmount, setIsClaimedAmount] = useState(false)

    useImperativeHandle(ref, () => ({
        show: () => {
            setDialogOpen(true)
        },
        hide: () => {
            setDialogOpen(false)
        }
    }))

    const BoomContract = useBoomContract()

    const claimGrand = async (): Promise<void> => {
        if (!BoomContract) return
        setClaimLoading(true)

        try {
            const boomClaimRes = await BoomContract.claimStar(grandBoom.whiteCardTokenId)
            const res = await boomClaimRes.wait()
            message.success('Already claim')
            setIsClaimedAmount(true)
        } catch (error: any) {
            console.log('error', error)
            message.error(error.data?.message || error.message)
        }

        setClaimLoading(false)
    }

    const closeModal = (): void => setDialogOpen(false)

    const isOwner = grandBoom.address == account
    return (
        <Modal
            transitionName=""
            visible={dialogOpen}
            closeModal={closeModal}
            closable={false}
            noScroll={true}
            width="100%"
            height="100%"
            getContainer={document.querySelector('.BoomDetail')}
        >
            <div className="modal-content-box ModalGrand bg-cover">
                <div className="modal-content">
                    <div className="modalTitle">
                        <img onClick={closeModal} src={require('../img/guanbi.png')} />
                    </div>
                    <div className="modalMain">
                        <div className="title">Grang</div>
                        <div className="amount">5,000,000 NBP</div>
                        <div className={classnames('combination', { openWinCombination: grandBoom.address })}>
                            <img src={grandBoom.first_img || require('../img/grand_0.png')} />
                            <img src={grandBoom.first_img || require('../img/grand_1.png')} />
                        </div>
                        {grandBoom.address ? (
                            <div className={classnames('win-info', { owner: isOwner })}>
                                <div className="token-id">
                                    #{grandBoom.first_token_id} & #{grandBoom.second_token_id}
                                </div>
                                <div className="address">
                                    <span>Lucky user:</span>
                                    <ShortAddress name={grandBoom.address} address={grandBoom.address} />
                                </div>
                                {isOwner && (
                                    <Button
                                        onClick={claimGrand}
                                        loading={claimLoading}
                                        disabled={isClaimedAmount || grandBoom.isClaimed}
                                        className="btn"
                                        type="primary"
                                        size="large"
                                    >
                                        {grandBoom.isClaimed ? 'Already claim' : 'Claim rewards'}
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="intro">
                                The special prize is 5,000,000 NBP, which will be randomly selected from all collided NFT combinations after the event
                                ends!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    )
})
