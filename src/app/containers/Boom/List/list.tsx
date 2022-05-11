import './list.stylus'

import { useWeb3React } from '@web3-react/core'
import classnames from 'classnames'
import dayjs from 'dayjs'
import { getQueryStringByName } from 'mobile-browser'
import React, { useEffect, useRef, useState } from 'react'
import Swiper from 'react-id-swiper'
import { Link, useHistory } from 'react-router-dom'

import Go2Top from '@/app/components/Go2Top'
import Layout from '@/app/components/Layout'
import useBoomList, { IHomeBoomListResponse } from '@/app/containers/Home/hooks/useBoomList'
import useWindowSize from '@/app/hooks/useWindowSize'
import * as config from '@/app/utils/config'
import { formatMoney } from '@/app/utils/tool'

const tag = {
    '1': {
        name: 'End',
        className: 'end'
    },
    '2': {
        name: 'On sale',
        className: 'sell'
    },
    '3': {
        name: 'Coming soon',
        className: 'sell'
    }
}

export default (): React.ReactElement => {
    const { library, account } = useWeb3React()
    const history = useHistory()
    const [cardParams, setCardParams] = useState<{ slidesPerView: number | string; spaceBetween?: number; pagination?: any }>()
    const itemsRef = useRef<Array<HTMLDivElement | null>>([])
    const { width } = useWindowSize()
    const [, getBoomList] = useBoomList()
    const [boomList, setBoomList] = useState<IHomeBoomListResponse[]>([])

    const fetchList = async (): Promise<void> => {
        const boomRes = await getBoomList({ offset: 0, limit: 10 })
        if (boomRes) {
            setBoomList(boomRes)
        }
    }

    useEffect(() => {
        itemsRef.current = itemsRef.current.slice(0, boomList.length)
    }, [boomList])

    useEffect(() => {
        setCardParams({
            slidesPerView: 'auto',
            spaceBetween: 26
        })
        return () => {}
    }, [width])

    useEffect(() => {
        fetchList()
        return () => setBoomList([])
    }, [])

    return (
        <Layout className={classnames('page-boomList')}>
            <div className="content">
                <div className="banner">
                    <div className="block">
                        <div className="left">
                            <div className="name" />
                            <div className="title">
                                The {boomList && boomList[0] ? formatMoney(boomList[0].reward) : '0'} NBP jackpot is waiting for you
                            </div>
                            <div className="video">
                                <video className="frequency" controls playsInline loop preload="auto" src="/modric.mp4" />
                            </div>
                            <div className="btn">Participate now</div>
                        </div>
                        <div className="right">
                            {boomList.map((item, index) => {
                                if (index > 2) return null
                                return (
                                    <div className="item" key={item.id}>
                                        <div className="itemMain">
                                            <div className="itemTitle">
                                                <div className="itemText">{item.name}</div>
                                                <div className="itemTime">
                                                    <span>{dayjs(item.end_time).format('HH:mm:ss')}</span>
                                                </div>
                                            </div>
                                            <div className="itemNumber">{formatMoney(item.reward)} NBP</div>
                                            <div className="itemType">{item.description}</div>
                                        </div>
                                        <img src={item.url} alt="" />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div className="list">
                    {boomList.map((item, i) => {
                        if (item.status !== 1) return null
                        return (
                            <div className="item" key={i}>
                                <div className="img" style={{ backgroundImage: `url(${item.url})` }}>
                                    {/* <div className={classnames('tag', tag[item.status].className)}>{tag[item.status].name}</div> */}
                                    <div className={classnames('tag', 'sell')}>On Sell</div>
                                </div>
                                <div className="info">
                                    <div className="title">
                                        <span className="titleTxt">{item.name}</span>
                                        <span className="titleTime">End in {item.end_time}</span>
                                        {/* {item.status === 1 ? <span className="titleTag">End</span> : null}
                                        {item.status === 2 ? <span className="titleTime">End in {item.end_time}</span> : null}
                                        {item.status === 3 ? <span className="titleTime">Start sale in {item.start_time}</span> : null} */}
                                    </div>
                                    <div className="txt">
                                        The Messi Prize is only for users who have Messi’s rare NFT. The first prize is a combination of two
                                        designated NFTs to get more Messi NFTs and form more decks. Win the Messi prize home.
                                    </div>
                                    <div className="price">{formatMoney(boomList[0].reward)} NBP</div>
                                    <div className="card">
                                        <Swiper {...cardParams} shouldSwiperUpdate rebuildOnUpdate ref={el => (itemsRef.current[i] = el)}>
                                            <div className="cardItem">
                                                <img src={require('./img/blindBox/1.png')} alt="" />
                                            </div>
                                            <div className="cardItem">
                                                <img src={require('./img/blindBox/2.png')} alt="" />
                                            </div>
                                            <div className="cardItem">
                                                <img src={require('./img/blindBox/3.png')} alt="" />
                                            </div>
                                            <div className="cardItem">
                                                <img src={require('./img/blindBox/4.png')} alt="" />
                                            </div>
                                            <div className="cardItem">
                                                <img src={require('./img/blindBox/5.png')} alt="" />
                                            </div>
                                            <div className="cardItem">
                                                <img src={require('./img/blindBox/6.png')} alt="" />
                                            </div>
                                            <div className="cardItem">
                                                <img src={require('./img/blindBox/7.png')} alt="" />
                                            </div>
                                            <div className="cardItem">
                                                <img src={require('./img/blindBox/8.png')} alt="" />
                                            </div>
                                            <div className="cardItem">
                                                <img src={require('./img/blindBox/9.png')} alt="" />
                                            </div>
                                            <div className="cardItem">
                                                <img src={require('./img/blindBox/10.png')} alt="" />
                                            </div>
                                        </Swiper>
                                        <div className="swiper-button-next" onClick={() => (itemsRef.current[i] as any)?.swiper.slideNext()} />
                                        <div className="swiper-button-prev" onClick={() => (itemsRef.current[i] as any)?.swiper.slidePrev()} />
                                    </div>
                                    <div className="btnWrap">
                                        <div className="btn buy" onClick={() => history.push(`/market?contract=${config.nft721BallGameStar}`)}>
                                            Purchase NFT
                                        </div>
                                        <div className="btn boom" onClick={() => history.push('/BoomDetail')}>
                                            <div>
                                                <span>View the winning list</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* {item.status === 2 ? (
                                        <div className="btnWrap">
                                            <div className="btn buy" onClick={() => history.push('/market')}>
                                                Purchase NFT
                                            </div>
                                            <div className="btn boom" onClick={() => history.push('/BoomDetail')}>
                                                <div>
                                                    <span>View the winning list</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="btnWrap">
                                            <div className="btn buy" onClick={() => history.push('/BoomDetail')}>
                                                Participate BOOM
                                            </div>
                                        </div>
                                    )} */}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <Go2Top />
        </Layout>
    )
}
