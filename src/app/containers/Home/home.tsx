import 'swiper/css/swiper.css'
import './home.stylus'

import { useWeb3React } from '@web3-react/core'
import { message } from 'antd'
import classnames from 'classnames'
import dayjs from 'dayjs'
import React, { useEffect, useRef, useState } from 'react'
import Swiper from 'react-id-swiper'
import { useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'

import { setComingSoonVisible } from '@/app/actions/baseAction'
import Card from '@/app/components/Card'
import Go2Top from '@/app/components/Go2Top'
import Layout from '@/app/components/Layout'
import useWindowSize from '@/app/hooks/useWindowSize'
import * as config from '@/app/utils/config'
import { formatMoney, getShortenAddress } from '@/app/utils/tool'
import { useThemeContext } from '@/theme'

import useBoomList, { IHomeBoomListResponse } from './hooks/useBoomList'
import useCollectionList, { IHomeCollectionListResponse } from './hooks/useCollectionList'
import useMarketList, { IHomeMarketListResponse2 } from './hooks/useMarketList'

const checkInPage = el => {
    const pageHeight = document.documentElement.clientHeight
    const contentTop = el.getBoundingClientRect().top
    const contentHeight = el.offsetHeight
    return (contentTop < pageHeight && contentTop >= 0) || (contentTop < 0 && contentTop + contentHeight > 0)
}

export default (): React.ReactElement => {
    const dispatch = useDispatch()
    const { library, account } = useWeb3React()
    const history = useHistory()
    const { currentThemeName } = useThemeContext()
    const { height, width } = useWindowSize()
    const bannerHeight = Number(height) > 700 ? Number(height) + 40 : 700
    const collectionsRef = useRef<any>(null)
    const boomRef = useRef<any>(null)
    const bannerRef = useRef<any>(null)

    const [getMarketListLoading, getMarketList] = useMarketList()
    const [, getBoomList] = useBoomList()
    const [boomList, setBoomList] = useState<IHomeBoomListResponse[]>([])
    const [, getCollectionList] = useCollectionList()
    const [collectionList, setCollectionList] = useState<IHomeCollectionListResponse[]>([])
    const [collectionsParams, setCollectionsParams] = useState<{ slidesPerView: number | string; spaceBetween: number; pagination?: any }>()
    const [boomParams, setBoomParams] = useState<{ slidesPerView: number | string; spaceBetween: number; pagination?: any }>()
    const [isCollectionStart, setIsCollectionStart] = useState(true)
    const [isCollectionEnd, setIsCollectionEnd] = useState(false)
    const [isBoomStart, setIsBoomStart] = useState(true)
    const [isBoomEnd, setIsBoomEnd] = useState(false)
    const [marketList, setMarketList] = useState<IHomeMarketListResponse2['list']>([])
    const [pageTotal, setPageTotal] = useState(0)
    const [pageIndex, setPageIndex] = useState(1)
    const [loadMore, setLoadMore] = useState(false)
    const marketLoadMoreRef = useRef<any>(null)
    const [scrollTop, setScrollTop] = useState(0)
    const [moreText, setMoreText] = useState('Load More')

    const bannerParams = {
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        }
    }

    const mobileBannerParams = {
        // navigation: {
        //     nextEl: '.swiper-button-next',
        //     prevEl: '.swiper-button-prev'
        // }
    }

    const fetchList = async (): Promise<void> => {
        const collectionRes = await getCollectionList({ offset: 0, limit: 20 })
        if (collectionRes) {
            setCollectionList(collectionRes)
        }
        const boomRes = await getBoomList({ offset: 0, limit: 10 })
        if (boomRes) {
            setBoomList(boomRes)
        }
    }

    const fetchMarketList = async (index): Promise<void> => {
        const res = await getMarketList({ offset: (index - 1) * 20, limit: 20 })
        if (res) {
            setPageTotal(res.count)
            setMarketList([...marketList, ...res.list])
            setPageIndex(pageIndex + 1)
        }
    }

    const checkPage = async (): Promise<void> => {
        if (!marketLoadMoreRef.current) return
        const isVisible = checkInPage(marketLoadMoreRef.current)
        if (Math.ceil(pageTotal / 20) >= pageIndex && !getMarketListLoading && isVisible && loadMore) {
            await fetchMarketList(pageIndex)
        } else if (Math.ceil(pageTotal / 20) < pageIndex && loadMore) {
            setMoreText('No More')
        }
    }

    const onPageScroll = (): void => {
        const scrollTopNow = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        setScrollTop(scrollTopNow)
    }

    useEffect(() => {
        checkPage()
        return () => {}
    }, [scrollTop, loadMore])

    useEffect(() => {
        fetchList()
        fetchMarketList(pageIndex)
        window.addEventListener('scroll', onPageScroll)
        return () => window.removeEventListener('scroll', onPageScroll)
    }, [])

    useEffect(() => {
        if (Number(width) > 768) {
            setCollectionsParams({
                slidesPerView: 'auto',
                spaceBetween: 32
            })
            let slidesPerView

            if (Number(width) > 768) {
                slidesPerView = 2
            }
            if (Number(width) > 1020) {
                slidesPerView = 3
            }
            if (Number(width) > 1440) {
                slidesPerView = 4
            }
            setBoomParams({
                slidesPerView,
                spaceBetween: 28
            })
        } else {
            setCollectionsParams({
                slidesPerView: 1,
                spaceBetween: 0,
                pagination: {
                    el: '.swiper-pagination'
                }
            })
            setBoomParams({
                slidesPerView: 1,
                spaceBetween: 32,
                pagination: {
                    el: '.swiper-pagination'
                }
            })
        }
        return () => {}
    }, [width])

    return (
        <Layout className={classnames('page-home', currentThemeName)} isShowFooter>
            {Number(width) > 768 ? (
                <div className="banner" style={{ height: bannerHeight }}>
                    <Swiper {...bannerParams} ref={bannerRef}>
                        <div className="bannerItem banner6">
                            <div className="box">
                                <div className="left">
                                    <div className="title2" />
                                    <div className="text">
                                        The NFT avatar generated by the protocol has no preset and share 1,000,000 NBP incentive fund.
                                    </div>
                                    <div className="btnBox">
                                        <div className="Blind" onClick={() => history.push('/invitationRewards')}>
                                            <span>Enter</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="right" />
                            </div>
                        </div>
                        <div className="bannerItem banner0">
                            <div className="box">
                                <div className="left">
                                    <div className="title2" />
                                    {/* <div className="title">Rare_Ki Blind Box is coming!</div> */}
                                    <div className="text">
                                        To celebrate the NBP initial launch on Gate, NFTBomb will release 500 UNIQUE Unusual_Ki.
                                    </div>
                                    <div className="btnBox">
                                        <div className="Blind" onClick={() => history.push('/UnusualKi')}>
                                            <span>Claim</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="right" />
                            </div>
                        </div>
                        <div className="bannerItem banner1">
                            <div className="box">
                                <div className="left">
                                    <div className="title1" />
                                    <div className="text">12:00 (UTC) 17th of November</div>
                                    <div className="btnBox">
                                        <div
                                            className="Blind"
                                            onClick={() => {
                                                window.open('https://www.gate.ac/trade/NBP_USDT')
                                            }}
                                        >
                                            <span>GATE NBP/USDT</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="right" />
                            </div>
                        </div>

                        {/* <div className="bannerItem banner2">
                            <div className="box">
                                <div className="left">
                                    <div className="title2" />
                                    <div className="text">
                                        <div>We will raise 50,000 usdt for 1,000,000 tokens in each of three ido platforms.</div>
                                        <div className="btnWrap">
                                            <a
                                                className="btn"
                                                href="http://pokerbear.io/#/pools/detail/0x05794Ea23fC6a9b442AB512BDF8BA210E34A9de9"
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                PokerBear
                                            </a>
                                            <a className="btn" href="https://daostarter.pro/#/parameter/49983" target="_blank" rel="noreferrer">
                                                DAOStarter
                                            </a>
                                            <a
                                                className="btn"
                                                href="https://app.dodoex.io/cp/join/0x0a6ee04d642bdb97bae39756abddc0a12db3402c?network=bsc-mainnet"
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                DODO
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <a
                                    href="https://nftbomb-97786.medium.com/nftbomb-ido-whitelist-participation-tutorial-6146025e7d66"
                                    className="right"
                                />
                            </div>
                        </div> */}

                        <div className="bannerItem banner3">
                            <div className="box">
                                <div className="left">
                                    <div className="title2" />
                                    <div className="text">
                                        NFTBomb is the first NFT protocol ecological(PECO) project, dedicated to creating a new paradigm of NFT
                                        finance. NFTBomb is not only including the NFT market, but also carrying a rich NFT protocol ecology. The
                                        market module links the real world and Metaverse assets altogether, while the protocol ecology solves out the
                                        problem of NFT liquidity. NFTBomb can help high-quality NFT protocal to reach more valuable NFT assets quickly
                                        so that to serve more NFT users.
                                    </div>
                                </div>
                                <div className="right" />
                            </div>
                            <video
                                className="video"
                                autoPlay
                                playsInline
                                muted
                                loop
                                preload="auto"
                                src="/banner.mp4"
                                style={{ width, height: bannerHeight }}
                            />
                        </div>
                        {/* <div>
                        <div className="bannerItem banner1">
                            <div className="box">
                                <div className="left">
                                    <div className="title">Collect Modrić&#39;s rare NFT</div>
                                    <div className="text">
                                        An IP price discovery and NFT liquidity protocol. NFTBomb aims to satisfy the financial needs of NFT assets
                                        such as liquidation, lending, leasing, sharing and financing, etc. through the demand-driven price discovery
                                        mechanism of INO.
                                    </div>
                                    <div className="btnBox">
                                        <div className="Blind" onClick={() => history.push('/blingbox')}>
                                            <span>Blind box</span>
                                        </div>
                                        <div className="Messi">Messi</div>
                                    </div>
                                </div>
                                <div className="right" />
                            </div>
                        </div>
                    </div> */}
                    </Swiper>
                </div>
            ) : (
                <div className="banner">
                    <Swiper {...mobileBannerParams}>
                        <div className="bannerItem banner0">
                            <div className="box">
                                <div className="left">
                                    <div className="title">NFTBomb</div>
                                    <div className="text">
                                        First open ecosystem that integrates the NFT contract protocol layer and application layer.
                                    </div>
                                </div>
                                <div className="right" />
                            </div>
                        </div>
                    </Swiper>
                </div>
            )}

            <div className="content">
                <div className="box">
                    {collectionList ? (
                        <div className="collections">
                            <div className="header">
                                <div className="title">Top Artists</div>
                                <div className="more">Learn More</div>
                            </div>
                            <div className="main">
                                <Swiper {...collectionsParams} ref={collectionsRef} shouldSwiperUpdate rebuildOnUpdate>
                                    {collectionList?.map((item, index) => (
                                        <div className="item" key={index} onClick={() => dispatch(setComingSoonVisible(true))}>
                                            <div className="max">
                                                <div className="user">
                                                    <div className="avatar" style={{ backgroundImage: `url(${item.avatar})` }} />
                                                    <div className="name">{item.nick}</div>
                                                    <div className="address">{getShortenAddress(item.address)}</div>
                                                </div>
                                                <div className="img" style={{ backgroundImage: `url(${item.url})` }} />
                                            </div>
                                            <div className="min">
                                                <span style={{ backgroundImage: `url(${item.url1})` }} />
                                                <span style={{ backgroundImage: `url(${item.url2})` }} />
                                                <span style={{ backgroundImage: `url(${item.url3})` }} />
                                            </div>
                                        </div>
                                    ))}
                                </Swiper>
                                <div className="swiper-button-next" onClick={() => collectionsRef.current?.swiper.slideNext()} />
                                <div className="swiper-button-prev" onClick={() => collectionsRef.current?.swiper.slidePrev()} />
                            </div>
                        </div>
                    ) : null}
                    {boomList ? (
                        <div className="boom">
                            <div className="header">
                                <div className="title">Boom</div>
                                {/* <div className="more" onClick={() => history.push('./BoomList')}>
                                    Learn More
                                </div> */}
                                <div className="more" onClick={() => dispatch(setComingSoonVisible(true))}>
                                    Learn More
                                </div>
                            </div>
                            <div className="main">
                                <Swiper {...boomParams} ref={boomRef} shouldSwiperUpdate rebuildOnUpdate>
                                    {boomList.map(item => (
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
                                                {/* <div className="itemBtn" onClick={() => history.push('./BoomDetail')}>
                                                    coming soon
                                                </div> */}
                                                <div className="itemBtn" onClick={() => dispatch(setComingSoonVisible(true))}>
                                                    coming soon
                                                </div>
                                            </div>
                                            <img src={item.url} alt="" />
                                        </div>
                                    ))}
                                </Swiper>
                                <div className="swiper-button-next" onClick={() => boomRef.current?.swiper.slideNext()} />
                                <div className="swiper-button-prev" onClick={() => boomRef.current?.swiper.slidePrev()} />
                            </div>
                        </div>
                    ) : null}
                    <div className="newest">
                        <div className="header">
                            <div className="title">Newest</div>
                            <div className="more" onClick={() => history.push('/BoomList')}>
                                Learn More
                            </div>
                        </div>
                        <div className="main">
                            {marketList?.map((item, index) => (
                                <div
                                    className={classnames('item', { item1155: item.contract === config.nft1155 })}
                                    key={item.asset_id}
                                    onClick={() => history.push(`/MarketDetail/buy/${item.asset_id}/${item.order_id || ''}`)}
                                >
                                    <Card
                                        src={item.attachment}
                                        username={item.name}
                                        userAddress={item.owner}
                                        userAvatar={item.user_info && item.user_info.avatar ? item.user_info.avatar : require('./img/user.png')}
                                        isLike={false}
                                        likeNumber={item.like_num}
                                        type={'money'}
                                        typeList={[1, 3, 4]}
                                        price={`${formatMoney(library?.utils.fromWei(item.current_price))}${item.unit}`}
                                    />
                                </div>
                            ))}
                        </div>
                        {!getMarketListLoading ? (
                            <div
                                className={classnames('loadMore', { disable: moreText === 'No More' })}
                                ref={marketLoadMoreRef}
                                onClick={() => setLoadMore(true)}
                            >
                                <span>{moreText}</span>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
            <Go2Top />
        </Layout>
    )
}
