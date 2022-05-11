import './index.stylus'
import './font/font.css'

import { useWeb3React } from '@web3-react/core'
import { Button, message } from 'antd'
import classnames from 'classnames'
import React, { useEffect, useMemo, useRef, useState } from 'react'

// import { Link, useHistory } from 'react-router-dom'
import Layout from '@/app/components/Layout'
import Modal from '@/app/components/Modal'
import useBoomContract from '@/app/hooks/useBoomContract'
import useWindowSize from '@/app/hooks/useWindowSize'
import { GetNFTInfos } from '@/app/service/boomDetailServer'
import * as config from '@/app/utils/config'
import storage from '@/app/utils/storage'

import Banner, { format_number } from './components/banner'
import Boom, { winItem } from './components/boom'
import ModalGrand from './components/ModalGrand'
import MyBoomHistory from './components/myBoomHistory'
import Winner from './components/winner'

export interface grandItem {
    address: string
    first_token_id: number
    second_token_id: number
    first_img: string
    second_img: string
    whiteCardTokenId?: string
    isClaimed: boolean
}

export const gradesNBP = [0, 100000, 10000, 1000, 10, 5000000]
export const grades = ['', '1st Prize', '2nd Prize', '3rd Prize', '4th Prize', 'Grand prize']

export default (): React.ReactElement => {
    const { account } = useWeb3React()
    // const history = useHistory()
    useWindowSize(true)

    const BoomRef = useRef<any>(null)
    const BoomHistoryRef = useRef<any>(null)
    const [showWinType, setShowWinType] = useState(-1)
    const [progress, setProgress] = useState(0)
    const [grandBoom, setGrandBoom] = useState<grandItem>({
        address: '',
        first_token_id: 0,
        second_token_id: 0,
        first_img: '',
        second_img: '',
        isClaimed: false,
        whiteCardTokenId: ''
    })

    const [claimLoading, setClaimLoading] = useState(false)
    const [isClaimedAmount, setIsClaimedAmount] = useState(false)

    const [curWin, setCurWin] = useState<winItem>({
        prize: 0,
        first_token_id: 0,
        second_token_id: 0,
        first_img: '',
        second_img: ''
    })
    const BoomContract = useBoomContract()

    useEffect(() => {
        let _fetchProgressTimer = 0

        //0 no start 1 start 2 end 3 winner 4 claim
        const fetchProgress = async (): Promise<void> => {
            const res_progress = await BoomContract.progress()
            //模拟活动状态中途变化
            // if(new Date()>new Date('2021/12/5 9:42:30')&&new Date()<new Date('2021/12/5 9:42:33')){
            //     res_progress=4
            // }
            setProgress(res_progress)

            if (res_progress < 4) {
                if (res_progress < 3) {
                    // console.log(`storage.get('openedGrand')`,storage.get('openedGrand'))

                    if (!storage.get('openedGrand') && _fetchProgressTimer == 0) {
                        ModalGrandRef.current?.show()
                        storage.set('openedGrand', 1, 60 * 60)
                    }
                }

                _fetchProgressTimer = setTimeout(() => {
                    fetchProgress()
                }, 3000)
            } else {
                fetchClaimedAmount()
                getGrandBoom()
            }
        }

        if (BoomContract) {
            fetchProgress()
        }

        return () => {
            clearTimeout(_fetchProgressTimer)
        }
    }, [BoomContract])

    const openWinModal = (showWinType: number, curWin: winItem): void => {
        if (showWinType == 2) {
            ModalGrandRef.current?.show()
        } else {
            setShowWinType(showWinType)
            setCurWin(curWin)
        }
    }

    //获得grand boom信息
    const getGrandBoom = async (): Promise<void> => {
        try {
            const _grandBoomId = +(await BoomContract.winnerStarPrize())

            console.log('_grandBoomId', +_grandBoomId)
            if (_grandBoomId > 0) {
                const boomInfo = await BoomContract.boomInfo(_grandBoomId)
                console.log('boomInfo', boomInfo)
                let [first_token_id, second_token_id] = boomInfo.boxId.split(',')
                first_token_id = first_token_id.replace(/\u0000/g, '')
                second_token_id = second_token_id.replace(/\u0000/g, '')
                const nftInfos_res: any = await GetNFTInfos({
                    token_ids: first_token_id + ',' + second_token_id,
                    contract: config.nft721BallGameStar
                })
                const _grandBoom = {
                    address: boomInfo.user,
                    first_token_id,
                    second_token_id,
                    first_img: '',
                    second_img: '',
                    whiteCardTokenId: '',
                    isClaimed: false
                }
                console.log('nftInfos_res', nftInfos_res)
                if (nftInfos_res.data.code == 0) {
                    const { assetInfos } = nftInfos_res.data.data
                    assetInfos.forEach(item => {
                        if (item.token_id == first_token_id) {
                            _grandBoom.first_img = item.attachment
                        } else {
                            _grandBoom.second_img = item.attachment
                        }
                    })
                }
                if (boomInfo.user == account) {
                    _grandBoom.isClaimed = (await BoomContract.claimedStarAmount(account)).claimed
                    if (!_grandBoom.isClaimed) _grandBoom.whiteCardTokenId = await BoomRef.current?.getCards()
                }
                setGrandBoom(_grandBoom)
                if (!_grandBoom.isClaimed) {
                    if (!storage.get('openedGrand')) {
                        ModalGrandRef.current?.show()
                        storage.set('openedGrand', 1, 60 * 60)
                    }
                }
            }
        } catch (error: any) {
            message.error(error.data.message)
        }
    }

    //判断是否领取小奖
    const fetchClaimedAmount = async (): Promise<void> => {
        try {
            const boomClaimRes = await BoomContract.claimedAmount(account)
            // console.log('boomClaimRes', boomClaimRes)
            setIsClaimedAmount(boomClaimRes.claimed)
        } catch (error: any) {
            message.error(error.data.message)
        }
    }

    const _Boom = useMemo(
        () => (
            <Boom
                ref={BoomRef}
                account={account || ''}
                onPlayComplete={() => {
                    BoomHistoryRef.current?.fetchBooms()
                }}
                onOpenWinModal={openWinModal}
                progress={progress}
            />
        ),
        [progress, account]
    )
    // const _Banner = useMemo(() =>  <Banner />, [progress])
    const _Winner = useMemo(() => <Winner progress={progress} grandBoom={grandBoom} />, [progress, grandBoom])

    const _MyBoomHistory = useMemo(
        () => <MyBoomHistory onOpenWinModal={openWinModal} grandBoom={grandBoom} ref={BoomHistoryRef} account={account || ''} progress={progress} />,
        [account, progress, grandBoom]
    )

    //领取小奖
    const claimPrize = async (): Promise<void> => {
        if (!BoomContract) return
        setClaimLoading(true)

        const _BoomContract = await BoomContract.attach(config.boomContract)
        const whiteCardTokenId = await BoomRef.current?.getCards()
        console.log('whiteCardTokenId', whiteCardTokenId)
        if (whiteCardTokenId) {
            try {
                const boomClaimRes = await _BoomContract.claim(whiteCardTokenId)
                // const boomClaimRes = await _BoomContract.claimedStarAmount(account)
                console.log('boomClaimRes', boomClaimRes)
                const res = await boomClaimRes.wait()
                message.success('Already claim')
                setIsClaimedAmount(true)
                console.log('res', res)
            } catch (error: any) {
                console.log('error', error)
                message.error(error.data?.message || error.message)
            }
        } else {
            message.error('Platform equity card required.')
        }
        setClaimLoading(false)
    }

    const ModalGrandRef = useRef<any>(null)

    return (
        <Layout className={classnames('page-success', 'BoomDetail')}>
            <div
                className="container"
                onClick={e => {
                    if (!e.target.closest('.boom>.left')) {
                        BoomRef.current?.hideCheckNFTS()
                    }
                }}
            >
                <Banner />
                {_Boom}
                {_Winner}
                {_MyBoomHistory}
                {/* <MyBoomHistory onOpenWinModal={openWinModal} ref={BoomHistoryRef} account={account || ''} /> */}
            </div>
            <ModalGrand ref={ModalGrandRef} grandBoom={grandBoom} account={account || ''} />
            <Modal
                transitionName=""
                visible={showWinType != -1}
                closeModal={() => {
                    BoomRef.current?.openWin()
                }}
                closable={false}
                width="100%"
                maskClosable={true}
                getContainer={document.querySelector('.BoomDetail')}
            >
                <div className="modal-content-box modal-win-prize">
                    {showWinType != 0 ? (
                        <div className="modal-content modal-content-win">
                            <div className="left">
                                <div className="combination">
                                    <div className="item one">
                                        {curWin && <div className="div-img bg-cover" style={{ backgroundImage: `url(${curWin?.first_img})` }} />}
                                    </div>
                                    <div className="item two">
                                        {curWin && <div className="div-img bg-cover" style={{ backgroundImage: `url(${curWin?.second_img})` }} />}
                                    </div>
                                </div>
                            </div>
                            <div className="right">
                                <div className="top">
                                    <div className="title">{grades[curWin?.prize]}</div>
                                    <div className="boom-num">
                                        #{curWin?.first_token_id} & #{curWin?.second_token_id}
                                    </div>
                                </div>
                                <div className="bottom">
                                    <div className="prize-amount">
                                        <span>{curWin?.prize ? format_number(gradesNBP[curWin?.prize]) : 0}</span>NBP
                                    </div>
                                    <Button
                                        onClick={claimPrize}
                                        loading={claimLoading}
                                        className="btn"
                                        type="primary"
                                        size="large"
                                        disabled={progress != 4 || isClaimedAmount}
                                    >
                                        {isClaimedAmount ? 'Already claim' : 'Claim rewards'}
                                    </Button>
                                    <div className="desc"> · Rewards need to be claimed after the event end</div>
                                </div>
                            </div>
                        </div>
                    ) : showWinType == 0 ? (
                        <div className="modal-content modal-content-lose">
                            <img src={require('./img/fail.png')} />
                            <div className="title">Unfortunately</div>
                            <div className="desc">Your combination is not in the winning list.</div>
                        </div>
                    ) : null}
                </div>
            </Modal>
        </Layout>
    )
}

window.Element &&
    (function (ElementPrototype) {
        ElementPrototype.matches =
            ElementPrototype.matches ||
            ElementPrototype.matchesSelector ||
            ElementPrototype.webkitMatchesSelector ||
            ElementPrototype.msMatchesSelector ||
            function (selector) {
                const node = this
                const nodes = (node.parentNode || node.document).querySelectorAll(selector)
                let i = -1
                while (nodes[++i] && nodes[i] != node);
                return !!nodes[i]
            }
    })(Element.prototype)

window.Element &&
    (function (ElementPrototype) {
        ElementPrototype.closest =
            ElementPrototype.closest ||
            function (selector) {
                let el = this
                while (el.matches && !el.matches(selector)) el = el.parentNode
                return el.matches ? el : null
            }
    })(Element.prototype)
