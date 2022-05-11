import './blingBox.stylus'
import 'swiper/css/swiper.css'

import { BigNumber } from '@ethersproject/bignumber'
import { useWeb3React } from '@web3-react/core'
import { Button, message } from 'antd'
import classnames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import Swiper from 'react-id-swiper'
import { Link, useHistory, useParams } from 'react-router-dom'

import ErrorDialog, { IErrorDialog } from '@/app/components/ErrorDialog'
import Layout from '@/app/components/Layout'
import useBlindBoxContract from '@/app/hooks/useBlindBoxContract'
import useNft1155Contract from '@/app/hooks/useNft1155Contract'
import useWindowSize from '@/app/hooks/useWindowSize'
import * as config from '@/app/utils/config'
import { useThemeContext } from '@/theme'

import Countdown from './components/Countdown'
import userRewardCreate from './hooks/userRewardCreate'

export default (): React.ReactElement => {
    const { library, account } = useWeb3React()
    const history = useHistory()
    const c = useThemeContext()
    let { height, width } = useWindowSize(true)
    const ErrorDialogRef = useRef<IErrorDialog>()
    const blindBoxContract = useBlindBoxContract()

    const nft1155Contract = useNft1155Contract()
    const [obj, setObj] = useState<{ [key: string]: string }>({})
    const { chainId } = useWeb3React()
    const [show, setShow] = useState<boolean>(false)
    const [isOpen, setOpen] = useState<boolean>(new Date() > new Date(config.openBlingBoxTime))

    const { index } = useParams<{ index: string }>()
    const [loading, setLoading] = useState(false)
    const [cardsParams, setCardsParams] = useState<any>()
    const [, httpRewordCreate] = userRewardCreate()

    useEffect(() => {
        const fetch = async (): Promise<void> => {
            if (!nft1155Contract || !account) return
            const obj = {}
            let totalNum = 0
            for (let i = 1; i < 7; i++) {
                const res = await nft1155Contract.balanceOf(config.blindBoxContract, i)
                obj[`lv${i}`] = res
                totalNum += Number(res)
            }
            obj['totalNum'] = totalNum
            setObj(obj)
        }
        fetch()
    }, [nft1155Contract, account])
    const isMobile = width < 768
    if (!isMobile && height < 600) height = 700
    useEffect(() => {
        // let font_size_value = (width || 0) / 19.2
        // if (font_size_value < 46) font_size_value = 46
        // document.documentElement.style.fontSize = font_size_value + 'px'
        // isMobile = width < 768
        const stretch_change = isMobile ? 0 : (1920 - (width || 0)) / 10
        setCardsParams({
            effect: 'coverflow',
            coverflowEffect: {
                rotate: 0,
                stretch: 230 - stretch_change,
                depth: 100,
                modifier: 1,
                slideShadows: false
            },
            autoplay: {
                delay: 2000
                // disableOnInteraction: false,
                // pauseOnMouseEnter:true
            },
            //  loop :true,
            // loopFillGroupWithBlank:true,
            // loopAdditionalSlides:0,
            // loopedSlides:2,
            slidesPerView: 'auto',

            centeredSlides: true,
            grabCursor: true,
            slideToClickedSlide: true,
            initialSlide: 2,
            spaceBetween: 32
        })
        return () => {
            // document.documentElement.style.fontSize = 14 + 'px'
            setCardsParams(undefined)
        }
    }, [width])
    const swiperRef = useRef<any>(null)

    const swiperMouseover = (e): void => {
        if (e.target?.getAttribute('data-index')) {
            swiperRef.current?.swiper.autoplay.stop()
        } else {
            swiperRef.current?.swiper.autoplay.start()
        }
    }

    const swiperMouseleave = (e): void => {
        swiperRef.current?.swiper.autoplay.start()
    }

    useEffect(() => {
        const rightBox = document.querySelector('.right-box')
        rightBox?.addEventListener('mouseover', swiperMouseover)
        // rightBox?.addEventListener('mouseleave', swiperMouseleave)

        return () => {
            document.removeEventListener('mouseover', swiperMouseover)
            document.removeEventListener('mouseleave', swiperMouseleave)
        }
    }, [])

    const handleOpenKira = async (): Promise<void> => {
        if (chainId !== 56 && config.env !== 'development') {
            ErrorDialogRef.current?.show()
            return
        }
        if (!blindBoxContract || !account) return
        if (Number(obj.lv2) !== 0 || Number(obj.lv3) !== 0 || Number(obj.lv4) !== 0 || Number(obj.lv5) !== 0 || Number(obj.lv6) !== 0) {
            try {
                setLoading(true)
                const estimatedGasLimit = await blindBoxContract.estimateGas.buyBlindBox(3, {
                    value: library?.utils.toWei('0.1', 'ether')
                })
                const buyBlineBox = await blindBoxContract.buyBlindBox(3, {
                    value: library?.utils.toWei('0.1', 'ether'),
                    gasLimit: estimatedGasLimit.mul(BigNumber.from(15000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
                })
                try {
                    const res = await buyBlineBox.wait()
                    console.log(res)
                    setLoading(false)
                    if (res.status === 1) {
                        let buyLv = 1
                        res.events.forEach(e => {
                            if (e.event === 'BuyBlindBox') {
                                buyLv = e.args.tokenId.toString()
                            }
                        })
                        await httpRewordCreate({
                            address: account,
                            token_id: buyLv
                        })
                        message.success(`You get an ordinary blind box with id ${buyLv}`)
                        history.push(`/reveser/${buyLv}`)
                    }
                } catch (error) {
                    setLoading(false)
                    message.success(`Error`)
                }
            } catch (error: any) {
                if (error?.data) {
                    message.error(error.data.message)
                }
                console.log(error)
                setLoading(false)
            }
        }
    }
    // console.log('height', height, window.innerHeight)
    return (
        <Layout className={classnames('page-blingBox')} isHide={true}>
            <div className="container" onClick={() => setShow(false)}>
                {/* <div className="header">
                    <Link className="logo" to="/" />
                    <div className="div-header-btn">MY NFT</div>
                </div> */}
                {!show ? (
                    <div className={classnames('content')} style={{ height }}>
                        <div className="header">
                            <Link className="logo" to="/" />
                            <div className="div-header-btn" onClick={() => history.push('/activity/mynft')}>
                                MY NFT
                            </div>
                        </div>
                        <div className="page-box">
                            <div className="blindbox">
                                <img src={require('./img/title.png')} alt="" />
                            </div>
                            <div className="NFTBomb">
                                <div className="box">
                                    <div className="img">
                                        <img src={require('./img/left.gif')} alt="" />
                                    </div>
                                    <div className="bottom">
                                        <div className="num">
                                            <div className="wenzi">Blind Box</div>
                                            <div className="residue">LEFT:{obj?.totalNum?.toString()}</div>
                                        </div>

                                        {/* <div className="kbox" onClick={() => setShow(true)}> */}
                                        <div
                                            className="kbox"
                                            onClick={e => {
                                                e.stopPropagation()
                                                if (isOpen) setShow(true)
                                            }}
                                        >
                                            {isOpen ? (
                                                'Open the Blind Box'
                                            ) : (
                                                <Countdown
                                                    pTime={config.openBlingBoxTime}
                                                    endCallback={() => {
                                                        setOpen(true)
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div className="residue-nft">
                                        <div className="item">
                                            <div className="name">
                                                <div className="dot" />
                                                SSSR
                                            </div>
                                            {/* <div className="nft-number">{obj?.lv6?.toString()}</div> */}
                                            <div className="nft-number">1</div>
                                        </div>
                                        <div className="item">
                                            <div className="name">
                                                <div className="dot" />
                                                SSR
                                            </div>
                                            {/* <div className="nft-number">{obj?.lv5?.toString()}</div> */}
                                            <div className="nft-number">10</div>
                                        </div>
                                        <div />
                                        <div className="item">
                                            <div className="name">
                                                <div className="dot" />
                                                SR
                                            </div>
                                            {/* <div className="nft-number">{obj?.lv4?.toString()}</div> */}
                                            <div className="nft-number">100</div>
                                        </div>
                                        <div className="item">
                                            <div className="name">
                                                <div className="dot" />R
                                            </div>
                                            {/* <div className="nft-number">{obj?.lv3?.toString()}</div> */}
                                            <div className="nft-number">9889</div>
                                        </div>
                                        <div className="item">
                                            <div className="name">
                                                <div className="dot" />N
                                            </div>
                                            {/* <div className="nft-number">{obj?.lv2?.toString()}</div> */}
                                            <div className="nft-number">10000</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="right-box">
                                    {cardsParams && (
                                        <Swiper {...cardsParams} ref={swiperRef}>
                                            <div className="item">
                                                <div className="ssr-name">N</div>
                                                <img data-index={0} src={require('./img/right_item_1.png')} alt="" />
                                            </div>
                                            <div className="item">
                                                <div className="ssr-name">SR</div>
                                                <img data-index={1} src={require('./img/right_item_2.png')} alt="" />
                                            </div>
                                            <div className="item">
                                                <div className="ssr-name">SSSR</div>
                                                <img data-index="2" src={require('./img/right_item_3.png')} alt="" />
                                            </div>
                                            <div className="item">
                                                <div className="ssr-name">R</div>
                                                <img data-index="3" src={require('./img/right_item_4.png')} alt="" />
                                            </div>
                                            <div className="item">
                                                <div className="ssr-name">SSR</div>
                                                <img data-index="4" src={require('./img/right_item_5.png')} alt="" />
                                            </div>
                                        </Swiper>
                                    )}
                                    {/* <div className="logos">
                                        <img src={require('./img/logo_1.png')} />
                                        <img src={require('./img/logo_2.png')} />
                                        <img src={require('./img/logo_3.png')} />
                                        <img src={require('./img/logo_4.png')} />
                                        <img src={require('./img/logo_1.png')} />
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div
                        className="content visible"
                        style={{ height }}
                        onClick={e => {
                            setShow(false)
                            e.stopPropagation()
                        }}
                    >
                        <div className="header">
                            <Link className="logo" to="/" />
                            <div className="div-header-btn">MY NFT</div>
                        </div>
                        <div
                            className={classnames('ordinary')}
                            onClick={e => {
                                e.stopPropagation()
                            }}
                        >
                            <Button
                                loading={loading}
                                className="ordinary-nft"
                                onClick={e => {
                                    e.stopPropagation()
                                    handleOpenKira()
                                }}
                            >
                                0.001 BNB open
                            </Button>
                        </div>
                    </div>
                )}

                {!show && (
                    <div className="page-box-content">
                        <div className="main-content">
                            <div className="div-bg" />
                            {/* <img src={require('./img/content.png')} alt="" /> */}
                            {isMobile ? (
                                <div className="div-content">
                                    <div className="header-title">Rare_Ki Blind Box rule</div>
                                    <div className="body">
                                        <div className="left">
                                            <div className="title-1 title">Price: 0.001 BNB per one</div>
                                            <div className="title-2 title">The Blind box contains:</div>
                                            <div className="table">
                                                <div className="row">
                                                    <div className="item">Level</div>
                                                    <div className="item">Name</div>
                                                    <div className="item">Quantity</div>
                                                    <div className="item">Extra Reward</div>
                                                </div>
                                                <div className="row">
                                                    <div className="item">SSSR</div>
                                                    <div className="item">Rare_Ki_01</div>
                                                    <div className="item">1</div>
                                                    <div className="item">10 BNB</div>
                                                </div>
                                                <div className="row">
                                                    <div className="item">SSR</div>
                                                    <div className="item">Rare_Ki_02</div>
                                                    <div className="item">10</div>
                                                    <div className="item">1000 NBP</div>
                                                </div>
                                                <div className="row">
                                                    <div className="item">SR</div>
                                                    <div className="item">Rare_Ki_01</div>
                                                    <div className="item">100</div>
                                                    <div className="item">100 NBP</div>
                                                </div>
                                                <div className="row">
                                                    <div className="item">R</div>
                                                    <div className="item">Rare_Ki_01</div>
                                                    <div className="item">9889</div>
                                                    <div className="item">10 NBP</div>
                                                </div>
                                                <div className="row">
                                                    <div className="item">N</div>
                                                    <div className="item">Altcard</div>
                                                    <div className="item">10000</div>
                                                    <div className="item">10 NBP</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="right">
                                            <div className="title-1 title">Total: 20,000</div>
                                            <div className="title-2 title">Rare_Ki rights</div>
                                            <ul>
                                                <li>Get NFT airdrop</li>
                                                <li>Be able to purchase the limited blind box</li>
                                                <li>Be able to purchase the limited blind box</li>
                                                <li>Be able to purchase the limited blind box</li>
                                            </ul>
                                            <div className="bottom">Altcard dosen’t have any right</div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <img src={require('./img/content.png')} alt="" />
                            )}
                        </div>
                    </div>
                )}
            </div>
            <ErrorDialog ref={ErrorDialogRef} chainId={chainId} />
        </Layout>
    )
}
