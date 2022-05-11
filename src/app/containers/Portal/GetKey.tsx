import './GetKey.stylus'
import '@/app/utils/time'

import { LoadingOutlined } from '@ant-design/icons'
import { useWeb3React } from '@web3-react/core'
import { Button, message, Spin } from 'antd'
import classnames from 'classnames'
import * as ethers from 'ethers'
import React, { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'

import IntrusionPortalNft721_ABI from '@/abi/IntrusionPortalNft721.json'
import Layout from '@/app/components/Layout'
import SuccessModal, { IDialog as ISuccessModal } from '@/app/components/SuccessModal'
import useERC20Contract from '@/app/hooks/useERC20Contract'
import useInstrusionSwapperContract from '@/app/hooks/useInstrusionSwapperContract'
import useWindowSize from '@/app/hooks/useWindowSize'
import * as config from '@/app/utils/config'
import nft721ContractFunc from '@/app/utils/contract/nft721Contract'
import { toast } from '@/app/utils/message'
import Icon from '@/assets/icons'
import { useThemeContext } from '@/theme'

const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />

const parseMs = (milliseconds: number): IUseCountDown => {
    const days = Math.floor(milliseconds / 86400000)
    const hours = Math.floor(milliseconds / 3600000) % 24
    const minutes = Math.floor(milliseconds / 60000) % 60
    const seconds = Math.floor(milliseconds / 1000) % 60
    return {
        days: days < 10 ? `0${days}` : days,
        hours: hours < 10 ? `0${hours}` : hours,
        minutes: minutes < 10 ? `0${minutes}` : minutes,
        seconds: seconds < 10 ? `0${seconds}` : seconds
    }
}

export default (): React.ReactElement => {
    const { library, account } = useWeb3React()
    const history = useHistory()
    useWindowSize(true)
    const { currentThemeName } = useThemeContext()

    // const [approveNBPLoading, setApproveNBPLoading] = useState(true)
    // const [approveTicket721Loading, setApproveTicket721Loading] = useState(true)

    const [buyLoading, setBuyLoading] = useState(true)
    const [sellLoading, setSellLoading] = useState(true)

    const [showBgGif, setShowBgGif] = useState(false)
    const [approveNBP, setApproveNBP] = useState(false)
    const instrusionSwapperContract = useInstrusionSwapperContract()
    const successModalRef = useRef<ISuccessModal>()
    const [approve721, setApprove721] = useState(false)
    const [ticketSupply, setTicketSupply] = useState(0)
    const [ticketNum, setTicketNum] = useState(0)
    const [balance, setBalance] = useState(0)

    const [tokenIds721, setTokenIds721] = useState<number[]>([])

    const { erc20: erc20nbp, isApproveToken: _isApproveNBP, balance: balanceNBP } = useERC20Contract(config.nbp, config.instrusionSwapperContract)

    const sId = 1

    useEffect(() => {
        if (_isApproveNBP) {
            setApproveNBP(_isApproveNBP)
        }
    }, [_isApproveNBP])

    useEffect(() => {
        setApproveNBP(false)
        setApprove721(false)
        if (instrusionSwapperContract) get721Ticket()
        // return () => { }
    }, [account, instrusionSwapperContract])

    const ApproveSwaper = async (type: string): Promise<void> => {
        console.log('erc20nbp', erc20nbp)
        try {
            if (erc20nbp) {
                console.log('approveNBP', approveNBP)
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

            if (type == 'nft721') {
                if (!approve721) {
                    setSellLoading(true)
                    const nft721Contract = await nft721ContractFunc(config.nft721TicketContract, IntrusionPortalNft721_ABI, account)
                    const nft721Res = await nft721Contract.setApprovalForAll(config.instrusionSwapperContract, true)
                    await nft721Res.wait()
                    setApprove721(true)
                    setSellLoading(false)
                }
            }
        } catch (error) {
            console.log('error', error)
            message.error(error.data?.message || error.message)
            setSellLoading(false)
            setBuyLoading(false)
        }
    }

    const get721Ticket = async (): Promise<void> => {
        if (!account || !instrusionSwapperContract) return
        try {
            if (erc20nbp) setBalance(await erc20nbp.balanceOf(account))

            const nft721Contract = await nft721ContractFunc(config.nft721TicketContract, IntrusionPortalNft721_ABI, account)
            const balance: number = await nft721Contract.balanceOf(account)
            console.log('+balance', +balance)
            // setTicketNum(+balance)
            const tokenIDs721: number[] = []
            for (let i = 0; i < balance; i++) {
                const res = await nft721Contract.tokenOfOwnerByIndex(account, i)
                const claimExTime = await instrusionSwapperContract.claimExTimeByNftId(config.nft721TicketContract, res)

                console.log('+res', +res, 'claimExTime', +claimExTime)
                if (res > 0 && +claimExTime) {
                    tokenIDs721.push(+res)
                }
            }
            // const _tokenIDs721 = tokenIDs721.sort((a, b) => {
            //     return b - a
            // })
            setTokenIds721(tokenIDs721)
            console.log('tokenIDs721', tokenIDs721)

            if (!approve721) {
                const isApproval721 = await nft721Contract.isApprovedForAll(account, config.instrusionSwapperContract)
                setApprove721(isApproval721)
                console.log('isApproval721', isApproval721)
            }
            if (instrusionSwapperContract) {
                const swappersRes = await instrusionSwapperContract.swappers(sId)
                console.log('swappersRes', swappersRes)
                setTicketSupply(+swappersRes.supply)
                console.log('supply', +swappersRes.supply)
            }
        } catch (error) {
            console.log('get721Ticket error', error)
        }
        setSellLoading(false)
        setBuyLoading(false)
    }

    const claimAssetByNft = async (): Promise<void> => {
        // successModalRef.current?.show()
        // toast('赎回成功')
        if (instrusionSwapperContract) {
            setSellLoading(true)
            try {
                // const nft721Contract = await nft721ContractFunc(config.nft721TicketContract, IntrusionPortalNft721_ABI, account)

                // const isApprovalAll = await nft721Contract.isApprovedForAll(account, config.instrusionSwapperContract)
                // if (!isApprovalAll) {
                //     const nft721Res = await nft721Contract.setApprovalForAll(config.instrusionSwapperContract, true)
                //     await nft721Res.wait()
                //     setApprove721(true)
                // }
                const tokenIdTicket721 = JSON.parse(JSON.stringify(tokenIds721)).shift()
                console.log('tokenIds721', tokenIds721, 'tokenIdTicket721', tokenIdTicket721)
                let claimExTime = await instrusionSwapperContract.claimExTimeByNftId(config.nft721TicketContract, tokenIdTicket721)
                claimExTime = claimExTime * 1000
                console.log('claimExTime', +claimExTime)
                if (claimExTime == 0) {
                    toast('Invalid ticket', 'info')
                    setSellLoading(false)
                    return
                }

                if (new Date() < claimExTime) {
                    console.log('parseMs', parseMs)
                    const { days, hours, minutes, seconds } = parseMs(new Date().getTime() - claimExTime)
                    toast(`Redemption countdown: ${Number(days)} days ${hours}:${minutes}:${seconds}`, 'info')
                    setSellLoading(false)
                    return
                }

                const res = await instrusionSwapperContract.claimAssetByNft(config.nft721TicketContract, tokenIdTicket721)
                await res.wait()
                // successModalRef.current?.show()
                tokenIds721.shift()
                toast('赎回成功')
                get721Ticket()
            } catch (error) {
                console.log('error', error)
                message.error(error.data?.message || error.message)
            }
            setSellLoading(false)
        }
    }

    const swap = async (): Promise<void> => {
        // successModalRef.current?.show()
        if (balanceNBP < 10000) {
            toast('Insufficient Balance', 'info')
            return
        }
        if (instrusionSwapperContract) {
            setBuyLoading(true)
            try {
                const res = await instrusionSwapperContract.swap(sId)
                await res.wait()
                get721Ticket()
                successModalRef.current?.show()
                setBuyLoading(false)
            } catch (error: any) {
                message.error(error.data?.message || error.message)
                setBuyLoading(false)
            }
        }
    }
    // const getBtnText = (): string => {
    //     if (!approveNBP) return 'Approve'
    //     if (tokenIds721.length) return '赎回'

    //     return 'portal card 兑换10000NBP'
    // }
    // const btnText = getBtnText()
    const optBgStyle = {
        backgroundImage: 'url(https://qc-shop-1258490024.file.myqcloud.com/bomb/' + (showBgGif ? 'getKeyOptBoxBg3.gif' : 'getKeyOptBoxBg.jpg') + ')'
    }
    return (
        <Layout className={classnames('page-GetKey', currentThemeName)} balance={balance}>
            <div className="content">
                <div className="opt-container bg-cover" style={optBgStyle}>
                    <img
                        className="bg-gif"
                        style={{ display: 'none' }}
                        onLoad={() => {
                            setTimeout(() => {
                                setShowBgGif(true)
                            }, 1000)
                        }}
                        src="https://qc-shop-1258490024.file.myqcloud.com/bomb/getKeyOptBoxBg3.gif"
                    />
                    {showBgGif && (
                        <div
                            className="div-portal"
                            onClick={() => {
                                history.push('/PortalExcahnge')
                            }}
                        >
                            <img src={require('./img/plane.gif')} />
                        </div>
                    )}
                    <div className="opt-box">
                        <img style={{ opacity: showBgGif ? 0 : 0 }} src="https://qc-shop-1258490024.file.myqcloud.com/bomb/card.png" />
                        <div className="right">
                            <div className="cost-title">0 cost to get</div>
                            <div className="cost-title">Interstellar Portal Key</div>
                            <div className="desc">
                                The portal card is a precondition for the NFT asset "Interstellar Portal" in the INTRUSION game. Hold a portal card to
                                participate in the purchase of "Interstellar Portal". Stake 10,000 NBP to obtain the portal card. After 7X24 hours,
                                you can consume the portal card to redeem the pledged 10,000 NBP.
                            </div>
                            <div className="price-title">Portal card</div>
                            <div className="price">
                                <span>10000</span>
                                NBP
                            </div>
                            <div className="btns">
                                {/* <div
                                    className="btn"
                                    onClick={() => {
                                        history.push('/PortalExcahnge')
                                    }}
                                >
                                </div> */}
                                <Button
                                    loading={buyLoading}
                                    disabled={ticketSupply < 1}
                                    onClick={() => {
                                        approveNBP ? swap() : ApproveSwaper('nbp')
                                    }}
                                    // ghost
                                    className="btn"
                                >
                                    {approveNBP ? 'Pledge' : 'Approve'}
                                </Button>
                                <Button
                                    loading={sellLoading}
                                    disabled={approve721 ? tokenIds721.length == 0 : false}
                                    onClick={() => {
                                        approve721 ? claimAssetByNft() : ApproveSwaper('nft721')
                                    }}
                                    // ghost
                                    className="btn btn-exchange"
                                >
                                    {approve721 ? 'Redemption' : 'Approve'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="intro-container">
                    <div className="intro-box">
                        <div className="title">INTRUSION game trailer</div>
                        <div className="video-box">
                            <div className="div-iframe bg-cover">
                                <Spin indicator={antIcon} size="large" />
                                <iframe
                                    src="https://www.youtube.com/embed/SA95UidpDNw"
                                    title="INTRUSION.FINANCE"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                        <div className="div-p-box">
                            <div className="div-p">
                                <div className="name">NFT：</div>
                                <div className="value">Interstellar Portal Key</div>
                            </div>
                            <div className="div-p">
                                <div className="name">Address：</div>
                                <div className="value">
                                    <div className="text">Total NFT Supply: 1000</div>
                                    <div className="text">Project name: INTRUSION</div>
                                </div>
                            </div>
                            <div className="div-p">
                                <div className="name">Project introduction：</div>
                                <div className="value">
                                    INTRUSION is the first GameFi project incubated by NFTBomb, and it is also the first cryptocurrency native
                                    financial strategy chain game. The smart contracts on the chain are the rules of the game, realizing a real
                                    currency war.
                                </div>
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
                            {/* <div className="links">
                                <a href="https://intrusion.finance/" target="__blank">
                                    Website: https://intrusion.finance/
                                </a>
                                <a href="https://intrusion-finance.gitbook.io/docs/" target="__blank">
                                    DOCS: https://intrusion-finance.gitbook.io/docs/
                                </a>
                                <a href="https://twitter.com/intrusion_" target="__blank">
                                    Project Twitter: https://twitter.com/intrusion_
                                </a>
                                <a href="https://discord.gg/gqWpDTxrqs" target="__blank">
                                    Discord: https://discord.gg/gqWpDTxrqs
                                </a>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
            <SuccessModal width="4.8rem" img={require('./img/one_card.png')} ref={successModalRef} />
        </Layout>
    )
}
