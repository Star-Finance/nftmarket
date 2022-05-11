import './Exchange.stylus'
import '@/app/utils/time'

import { useWeb3React } from '@web3-react/core'
import { Button, message } from 'antd'
import classnames from 'classnames'
import * as ethers from 'ethers'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

import IntrusionPortalNft721_ABI from '@/abi/IntrusionPortalNft721.json'
import Countdown from '@/app/components/Countdown'
import Layout from '@/app/components/Layout'
import ShortAddress from '@/app/components/ShortAddress'
import SuccessModal, { IDialog as ISuccessModal } from '@/app/components/SuccessModal'
import useERC20Contract from '@/app/hooks/useERC20Contract'
import useInstrusionSwapperContract from '@/app/hooks/useInstrusionSwapperContract'
import useWindowSize from '@/app/hooks/useWindowSize'
import * as config from '@/app/utils/config'
import nft721ContractFunc from '@/app/utils/contract/nft721Contract'
import copy from '@/app/utils/copy'
import { toast } from '@/app/utils/message'
import Icon from '@/assets/icons'
import { useThemeContext } from '@/theme'

const buyData = [
    { seqName: 'First issue', limit: 50, price: 5000, startTime: '2021/12/10 00:00:01', endTime: '2021/12/20 23:59:59' },
    { seqName: 'Second issue', limit: 50, price: 7000, startTime: '2021/12/21 00:00:01', endTime: '2021/12/31 23:59:59' },
    { seqName: 'Third issue', limit: 50, price: 9000, startTime: '2022/01/01 00:00:01', endTime: '2022/01/03 23:59:59' }
]

const unHackTokenAddress = '0x6F841e0c5A00aD44B336f20fd37364D8e0b5452E'
export default (): React.ReactElement => {
    const { library, account } = useWeb3React()
    const history = useHistory()
    useWindowSize(true)

    const { currentThemeName } = useThemeContext()

    const [buyLoading, setBuyLoading] = useState(true)
    const [exchangeLoading, setExchangeLoading] = useState(true)

    const [approveNBP, setApproveNBP] = useState(false)

    const [ticketNum, setTicketNum] = useState(0)
    const [tokenIdsTicket721, setTokenIdsTicket721] = useState<number[]>([])
    const [tokenIdsPortal721, setTokenIdsPortal721] = useState<number[]>([])

    const [isApproveTicket, setApproveTicket] = useState(false)
    const [isApprovePortal, setApprovePortal] = useState(false)
    const [portalSupply, setPortalSupply] = useState(0)

    const instrusionSwapperContract = useInstrusionSwapperContract()
    const successModalRef = useRef<ISuccessModal>()
    const [balance, setBalance] = useState(0)

    const { erc20: erc20nbp, isApproveToken: _isApproveNBP, balance: balanceNBP } = useERC20Contract(config.nbp, config.instrusionSwapperContract)

    const pId = 1
    // const sId = 1
    const nId = 1

    useEffect(() => {
        if (_isApproveNBP) {
            setApproveNBP(_isApproveNBP)
        }
    }, [_isApproveNBP])

    useEffect(() => {
        setApproveNBP(false)
        if (instrusionSwapperContract) get721TicketAndPortal()
        // return () => { }
    }, [account, instrusionSwapperContract])

    const buyPortal = async (index: number): Promise<void> => {
        // successModalRef.current?.show()

        const activityItem = buyData[index]
        if (balanceNBP < activityItem.price) {
            toast('Insufficient Balance', 'info')
            return
        }
        if (!tokenIdsTicket721.length) {
            toast('No tickets available', 'info')
            return
        }
        if (instrusionSwapperContract) {
            setBuyLoading(true)
            try {
                const tokenIdTicket721 = JSON.parse(JSON.stringify(tokenIdsTicket721)).shift()

                const res = await instrusionSwapperContract.buy(pId, tokenIdTicket721)
                await res.wait()
                tokenIdsTicket721.shift()
                get721TicketAndPortal()
                successModalRef.current?.show()
                setBuyLoading(false)
            } catch (error: any) {
                message.error(error.data?.message || error.message)
                setBuyLoading(false)
            }
        }
    }

    const get721TicketAndPortal = async (): Promise<void> => {
        if (!account) return
        try {
            if (erc20nbp) setBalance(await erc20nbp.balanceOf(account))

            const nft721TicketContract = await nft721ContractFunc(config.nft721TicketContract, IntrusionPortalNft721_ABI, account)
            const balanceTicket: number = await nft721TicketContract.balanceOf(account)
            console.log('+balanceTicket', +balanceTicket)
            // setTicketNum(+balance)
            const tokenIDsTicket721: number[] = []
            let tokenIdTicket = 0

            for (let i = 0; i < balanceTicket; i++) {
                tokenIdTicket = await nft721TicketContract.tokenOfOwnerByIndex(account, i)
                tokenIdTicket = +tokenIdTicket
                if (tokenIdTicket > 0) {
                    const isUsed = await instrusionSwapperContract.markSellInfoByNftId(config.nft721TicketContract, tokenIdTicket, pId)
                    console.log('isUsed', isUsed)
                    if (!isUsed) tokenIDsTicket721.push(tokenIdTicket)
                }
            }
            setTokenIdsTicket721(tokenIDsTicket721)
            console.log('tokenIDsTicket721', tokenIDsTicket721)

            const nft721PortalContract = await nft721ContractFunc(config.nft721PortalContract, IntrusionPortalNft721_ABI, account)
            const balancePortal: number = await nft721PortalContract.balanceOf(account)
            console.log('+balancePortal', +balancePortal)
            // setTicketNum(+balance)
            const _tokenIdsPortal721: number[] = []
            for (let i = 0; i < balancePortal; i++) {
                const res = await nft721PortalContract.tokenOfOwnerByIndex(account, i)
                if (res > 0) {
                    _tokenIdsPortal721.push(+res)
                }
            }
            setTokenIdsPortal721(_tokenIdsPortal721)
            console.log('_tokenIdsPortal721', _tokenIdsPortal721)

            // if (!isApproveTicket) {
            //     const _isApproveTicket = await nft721TicketContract.isApprovedForAll(account, config.instrusionSwapperContract)
            //     setApproveTicket(_isApproveTicket)
            //     console.log('_isApproveTicket', _isApproveTicket)
            // }

            if (!isApprovePortal) {
                const _isApprovePortal = await nft721PortalContract.isApprovedForAll(account, config.instrusionSwapperContract)
                setApprovePortal(_isApprovePortal)
                console.log('_isApprovePortal', _isApprovePortal)
            }

            if (instrusionSwapperContract) {
                const swappersRes = await instrusionSwapperContract.sellInfos(pId)
                console.log('swappersRes', swappersRes)
                setPortalSupply(+swappersRes.supply)
                console.log('supply', +swappersRes.supply)
            }
        } catch (error) {
            console.log('get721TicketAndPortal error', error)
        }
        setExchangeLoading(false)
        setBuyLoading(false)
    }

    const exchangeToken = async (): Promise<void> => {
        if (!tokenIdsPortal721.length) {
            toast('No portal', 'info')
            return
        }
        if (instrusionSwapperContract) {
            setExchangeLoading(true)
            try {
                const tokenIdPortal721 = JSON.parse(JSON.stringify(tokenIdsPortal721)).shift()

                const res = await instrusionSwapperContract.exchangeToken(nId, tokenIdPortal721)
                await res.wait()
                tokenIdsTicket721.shift()
                get721TicketAndPortal()
                toast('Receive Success')
                setExchangeLoading(false)
            } catch (error: any) {
                message.error(error.data?.message || error.message)
                setExchangeLoading(false)
            }
        }
    }

    const Approve721AndToken = async (type: string): Promise<void> => {
        console.log('erc20nbp', erc20nbp)
        try {
            console.log('approveNBP', approveNBP)
            if (erc20nbp) {
                if (type == 'nbp') {
                    if (!approveNBP) {
                        setBuyLoading(true)
                        const approve_res = await erc20nbp.approve(config.instrusionSwapperContract, ethers.constants.MaxUint256)
                        await approve_res.wait()
                        setApproveNBP(true)
                        setBuyLoading(false)
                    }
                }
            }

            // if (type == 'ticket') {
            //     if (!isApproveTicket) {
            //         setBuyLoading(true)
            //         const nft721TicketContract = await nft721ContractFunc(config.nft721TicketContract, IntrusionPortalNft721_ABI, account)
            //         const nft721TicketRes = await nft721TicketContract.setApprovalForAll(config.instrusionSwapperContract, true)
            //         await nft721TicketRes.wait()
            //         setApproveTicket(true)
            //         setBuyLoading(false)
            //     }
            // }
            if (type == 'portal') {
                if (!isApprovePortal) {
                    setExchangeLoading(true)
                    const nft721PortalContract = await nft721ContractFunc(config.nft721PortalContract, IntrusionPortalNft721_ABI, account)
                    const nft721PortalRes = await nft721PortalContract.setApprovalForAll(config.instrusionSwapperContract, true)
                    await nft721PortalRes.wait()
                    setApprovePortal(true)
                    setExchangeLoading(false)
                }
            }
        } catch (error) {
            console.log('error', error)
            message.error(error.data?.message || error.message)
            setExchangeLoading(false)
            setBuyLoading(false)
        }
    }

    const getBuyBtnText = (item: any): any => {
        const now = new Date()
        if (now > new Date(item.endTime) || portalSupply < 1) {
            return 'End'
        } else if (now < new Date(item.startTime)) {
            return (
                <Countdown
                    pTime={item.startTime}
                // endCallback={() => {
                //     setOpen(true)
                // }}
                />
            )
        } else {
            return 'Buy Now'
        }
    }
    return (
        <Layout className={classnames('page-Exchange', currentThemeName)} balance={balance}>
            <div className="content bg-cover">
                <div className="opt-container bg-cover">
                    <div className="opt-box">
                        <img src={require('./img/exchange_card.png')} />
                        <div className="right">
                            <div className="title">
                                INTRUSION <span>“Interstellar Portal”</span> INO
                            </div>
                            <div className="link">
                                <a>Participating condit: </a>
                                <Link className="logo" to="/PortalGetKey">
                                    🔗 hold a portal card 🔗
                                </Link>
                            </div>
                            <div className="desc">
                                "Interstellar Portal" is the NFT asset in INTRUSION. After opening it, you can get 5,000,000 HACK. This NFT sale will
                                come through three periods with totally 150 pieces, and the discount percentage is gradually reduced. Please be
                                attention, the quantity is limited, FCFS.
                            </div>
                            <div className="buy-list">
                                {buyData.map((item, index) => {
                                    const isEnd = new Date() > new Date(item.endTime) || portalSupply < 1
                                    return (
                                        <div className={classnames('row', { 'row-end': isEnd })} key={index}>
                                            <div className="seq">{item.seqName}</div>
                                            <div className="limit">
                                                Limit：<span>{item.limit}</span>
                                            </div>
                                            <div className="price">
                                                <div className="new">
                                                    <span>{item.price}</span>
                                                    NBP
                                                </div>
                                                <div className="old">10000NBP</div>
                                            </div>
                                            <Button
                                                loading={buyLoading && getBuyBtnText(item) == 'Buy Now'}
                                                onClick={() => {
                                                    if (getBuyBtnText(item) != 'Buy Now') return
                                                    if (approveNBP) {
                                                        buyPortal(index)
                                                    } else {
                                                        Approve721AndToken('nbp')
                                                    }
                                                }}
                                                disabled={isEnd}
                                                size="large"
                                                className="btn"
                                            >
                                                {!approveNBP && getBuyBtnText(item) == 'Buy Now' ? 'Approve' : getBuyBtnText(item)}
                                            </Button>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="intro-container">
                    <div className="intro-box">
                        <div className="title">Interstellar Portal exchange HACK</div>
                        <div className="center">
                            <img src={require('./img/exchange_one_card.png')} />
                            <div className="right">
                                <div className="row">
                                    <div className="title">Redemption instruction: </div>
                                    <div className="desc">
                                        After opening "Interstellar Portal" in INTRUSION, you will get 5,000,000 unHACK and your "Interstellar Portal"
                                        will be destroyed at the same time. UnHACK is the pre-mined currency in the game INTRUSION. After the game is
                                        launched officially, you can exchange un HACK into HACK as 1:1.
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="title">Project introduction:</div>
                                    <div className="desc">
                                        INTRUSION is the first GameFi project incubated by NFTBomb. Meanwhile, it is the first cryptocurrency native
                                        financial strategy chain game. The smart contract on the chain are the rules of the game, realizing a real
                                        currency war.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="south">
                            <div className="div-p-box">
                                <div className="div-p">
                                    <div className="name">Project name</div>
                                    <div className="value">INTRUSION</div>
                                </div>
                                <div className="div-p">
                                    <div className="name">Token name</div>
                                    <div className="value">unHACK</div>
                                </div>
                                <div className="div-p">
                                    <div className="name">Contract address</div>
                                    <div className="value">
                                        <ShortAddress address={unHackTokenAddress} />
                                        <span onClick={() => copy(unHackTokenAddress)}>
                                            <Icon name="copy" className="copy" />
                                        </span>
                                    </div>
                                </div>
                                <div className="div-p">
                                    <div className="name">Total supply</div>
                                    <div className="value">100,000,000,000</div>
                                </div>
                            </div>
                            <div className="links-box">
                                <div className="icons">
                                    <a href="https://intrusion.finance/" target="__blank">
                                        <Icon name="website" className="item" />
                                    </a>
                                    <a href="https://intrusion-finance.gitbook.io/docs/" target="__blank">
                                        <Icon name="docs" className="item" />
                                    </a>
                                    <a href="https://twitter.com/intrusion_" target="__blank">
                                        <Icon name="twitter" className="item" />
                                    </a>
                                    <a href="https://discord.gg/gqWpDTxrqs" target="__blank">
                                        <Icon name="discord" className="item" />
                                    </a>
                                </div>
                                <div className="amount">5,000,000 unHACK</div>
                            </div>
                        </div>
                        <div className="footer">
                            <Button
                                loading={exchangeLoading}
                                onClick={() => {
                                    if (isApprovePortal) {
                                        exchangeToken()
                                    } else {
                                        Approve721AndToken('portal')
                                    }
                                }}
                                size="large"
                                className="btn"
                            >
                                {isApprovePortal ? 'Receive' : 'Approve'}
                            </Button>
                        </div>
                    </div>
                </div>
                <SuccessModal width="4.8rem" img={require('./img/exchange_one_card.png')} ref={successModalRef} />
            </div>
        </Layout>
    )
}
