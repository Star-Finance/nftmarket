import './index.stylus'

import { LoadingOutlined } from '@ant-design/icons'
import { useWeb3React } from '@web3-react/core'
import { Button, message, Modal, Spin } from 'antd'
import classnames from 'classnames'
import * as ethers from 'ethers'
import { getQueryStringByName } from 'mobile-browser'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

import { setComingSoonVisible } from '@/app/actions/baseAction'
import { setMarketModalCheckoutVisble, setMarketModalReviewVisble } from '@/app/actions/baseAction'
import Image from '@/app/components/Image'
import Layout from '@/app/components/Layout'
import ShortAddress from '@/app/components/ShortAddress'
import ShareDialog, { IDialog as IShareDialog } from '@/app/containers/MyNFT/Sell/components/shareDialog'
import useIERC20 from '@/app/hooks/useIERC20'
import useKibombMarketV3UpgradeableContract from '@/app/hooks/useKibombMarketV3UpgradeableContract'
import useWindowSize from '@/app/hooks/useWindowSize'
import {
    GetContractInfo,
    GetDoDoTokenPrice,
    GetNFTInfo,
    GetPriceByGate,
    GetTokenPrice,
    getTrxHistory,
    OrderBuy,
    OrderClose,
    OrderList
} from '@/app/service/marketServer'
import { IUserInfoResponseUser, userInfo } from '@/app/service/nftServer'
import * as config from '@/app/utils/config'
import { countUsdt } from '@/app/utils/tokens'
import Icon from '@/assets/icons'

import HeadTitle from './components/headTitle'
import ModalCheckout from './components/ModalCheckout'
import ModalResult from './components/ModalResult'
import ModalReview from './components/ModalReview'
import Orders from './components/Orders'
import TrxHistory from './components/trxHistory'
import TrxTypeNav from './components/trxTypeNav'

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

const PaymentToken = {
    // '0x0000000000000000000000000000000000000001':'BNB',
    [config.nbp?.toLowerCase()]: 'NBP'
}

export default (): React.ReactElement => {
    const { library, account, chainId } = useWeb3React()
    const { height, width } = useWindowSize()

    const [accountInfo, setAccountInfo] = useState<IUserInfoResponseUser>()

    const history = useHistory()
    const ShareDialogRef = useRef<IShareDialog>()

    const { assetId, from, orderId } = useParams<{ assetId: string; from: string; orderId: string }>()
    const id = assetId
    const properties = ['Hidden', 'Value', 'Value', 'Value']
    const [propertiesIndex, setPropertiesIndex] = useState(0)
    const [loading, setLoading] = useState(false)
    const [closeLoading, setCloseLoading] = useState(false)
    const [checkoutLoading, setCheckoutLoading] = useState(false)
    const [resultLoading, setResultLoading] = useState(false)
    const [nftImgShow, setNftImgShow] = useState(false)
    const [isBuyNow, setIsBuyNow] = useState(false)
    const [showImgIcon, setShowImgIcon] = useState(false)
    const [showModalImgClose, setShowModalImgClose] = useState(false)

    const [showOrders, setShowOrders] = useState(true)
    const [showTrxs, setShowTrxs] = useState(true)
    const [showIntro, setShowIntro] = useState(true)

    const [txid, setTxid] = useState('09f7…jghq')
    const [seller, setSeller] = useState('')
    const [orderPrice, setOrderPrice] = useState('')
    const [orderUnit, setOrderUnit] = useState('')

    const [orderIndex, setOrderIndex] = useState('')
    // const [tokenId, setTokenId] = useState('')

    // eslint-disable-next-line @typescript-eslint/ban-types
    const [orders, setOrders] = useState<any[]>([])
    const [market, setMarket] = useState<any[]>([])

    const [orderTotal, setOrderTotal] = useState(0)
    const [trxsTotal, setTrxsTotal] = useState(0)

    const [trxHistorys, setTrxHistorys] = useState<any[]>([])

    const [nftInfo, setNFTInfo] = useState<unknown>()

    const [contractName, setContractName] = useState('')
    const [bnbPrice, setBNBPrice] = useState(0)
    const [nbpPrice, setNBPPrice] = useState(0)

    // const { viewWidth } = useSelector((state: IRootState) => state.base)
    const dispatch = useDispatch()
    const KibombMarketV3UpgradeableContract = useKibombMarketV3UpgradeableContract()

    const pageSize = 50
    // console.log('nftInfo', nftInfo)

    const fetch = async (): Promise<void> => {
        setLoading(true)
        const _market = await KibombMarketV3UpgradeableContract.attach(config.KibombMarketV3Upgradeable)

        setMarket(_market)

        const res_nft = await GetNFTInfo({
            asset_id: id
        })
        const assetInfo = res_nft.data.data.assetInfo
        // let current_price = assetInfo?.current_price || 0
        // if (current_price !== 0) current_price = library?.utils.fromWei(current_price)

        if (assetInfo) {
            // setTokenId(assetInfo?.token_id)
            if (from == 'sell') setOrderUnit(assetInfo?.unit)

            if (res_nft.data.code == 0) {
                setNFTInfo(assetInfo)
                const res_contract_info = await GetContractInfo({
                    contract: assetInfo.contract
                })
                console.log('res_contract_info', res_contract_info)
                if (res_contract_info.data.code == 0) setContractName(res_contract_info.data.data.name)
            }
        } else {
            message.info('NFT info null')
        }

        if (from == 'buy') {
            const orderInfo = await _market.orderList(orderId)
            // console.log(' await _market.orderList', await _market.name())
            // console.log('orderInfo', orderInfo, orderInfo.status == '1')
            setSeller(orderInfo.seller)
            setIsBuyNow(orderInfo.status == 1 && assetInfo?.owner)
            setOrderPrice(library?.utils.fromWei(orderInfo.price.toString()))
            setOrderUnit(PaymentToken[orderInfo.paymentToken?.toLowerCase()] || 'BNB')
        } else {
            setSeller(account || '')
            setIsBuyNow(assetInfo?.owner)
        }

        // console.log(
        //     'PaymentToken[orderInfo.paymentToken]',
        //     PaymentToken[orderInfo.paymentToken],
        //     orderInfo.paymentToken,
        //     orderInfo.paymentToken?.toLowerCase()==,
        //     PaymentToken
        // )
        // const [orderPrice, setOrderPrice] = useState('')
        // const [orderUnit, setOrderUnit] = useState('')

        if (getQueryStringByName('tip')) {
            history.replace(`/MarketDetail/${from}/${assetId}/${orderId}`)
            if (assetInfo) ShareDialogRef.current?.show({ img: assetInfo?.attachment })
        }

        setLoading(false)

        const res_bnb_price = await GetPriceByGate('BNB')
        if (res_bnb_price.data.code == 0) setBNBPrice(res_bnb_price.data.data.info.price)

        const res_nbp_price = await GetPriceByGate('NBP')
        console.log('res_nbp_price', res_nbp_price)

        if (res_nbp_price.data.code == 0) {
            setNBPPrice(res_nbp_price.data.data.info.price)
        }
    }

    useEffect(() => {
        // const assetInfo = {}
        if (KibombMarketV3UpgradeableContract) fetch()
        // if (history.location.query?.tip) ShareDialogRef.current?.show()
    }, [KibombMarketV3UpgradeableContract])
    useEffect(() => {
        if (nftInfo) {
            reqOrders(1)
            reqTrxHistory(1)
        }
    }, [nftInfo])
    const reqOrders = async (page): Promise<void> => {
        // console.log('nftInfo', nftInfo)
        const res_orders = await OrderList({
            offset: ((page || 1) - 1) * pageSize,
            limit: pageSize,
            token_id: nftInfo?.token_id,
            contract: nftInfo?.contract
        })
        if (res_orders.data.code == 0) {
            const { list, count } = res_orders.data.data
            setOrders(list)
            setOrderTotal(count)
        }
    }

    const reqTrxHistory = async (page): Promise<void> => {
        const res_trxs = await getTrxHistory({
            offset: ((page || 1) - 1) * pageSize,
            limit: pageSize,
            asset_id: id,
            address: '' // nftInfo.owner
        })

        if (res_trxs.data.code == 0) {
            const { list, count } = res_trxs.data.data
            setTrxHistorys(list)
            setTrxsTotal(count)
        }
    }
    // console.log('orders', orders)

    // const reviewCheckChange = e => {
    //     console.log('e', e)
    //     if (e.target.checked) {
    //         ModalReviewRef.current.hide()
    //         ModalCheckoutRef.current.show()
    //     }
    // }

    // const CheckoutCheckChange = e => {
    //     if (e.target.checked) {
    //         ModalReviewRef.current.hide()
    //         ModalCheckoutRef.current.show()
    //     }
    // }
    // console.log('library', library)

    const erc20 = useIERC20(config.nbp)

    const checkoutClick = async () => {
        setCheckoutLoading(true)
        try {
            if (orderUnit != 'BNB') {
                let is_allowance = await erc20.allowance(account, config.KibombMarketV3Upgradeable)
                is_allowance = Number(is_allowance.toString())
                console.log('is_allowance', !!is_allowance)

                if (!is_allowance) {
                    const approve_res = await erc20.approve(config.KibombMarketV3Upgradeable, ethers.constants.MaxUint256)
                    await approve_res.wait()
                }
            }

            console.log('orderId', orderId)
            // const market = await KibombMarketV3UpgradeableContract.attach(config.KibombMarketV3Upgradeable)

            let buyOrderParams
            if (orderIndex !== '') {
                //订单列表里面点购买
                buyOrderParams = orders[orderIndex]
                // buyOrderParams.price = library?.utils.fromWei(buyOrderParams.price)
            } else {
                //buy now
                if (from == 'sell') {
                    const res_orders = await OrderList({
                        offset: 0,
                        limit: 1,
                        token_id: assetId,
                        address: '', // nftInfo.owner
                        order_id: orderId || ''
                    })
                    if (res_orders.data.code == 0) {
                        const orders = res_orders.data.data.list
                        if (orders.length) buyOrderParams = orders[0]
                    }
                } else {
                    buyOrderParams = {
                        order_id: orderId,
                        from_address: nftInfo?.owner,
                        price: orderPrice,
                        unit: orderUnit
                    }
                }
            }
            if (!buyOrderParams) {
                message.error('No order!')
            }
            console.log('buyOrderParams', buyOrderParams)

            const { order_id, from_address, unit } = buyOrderParams

            const orderInfo = await market.orderList(order_id)
            const price = library?.utils.fromWei(orderInfo.price.toString())
            // console.log(' await _market.orderList', await _market.name())

            // console.log('orderPrice', orderPrice, price)
            let buy_res
            if (unit == 'BNB') {
                buy_res = await market.buyOne(order_id, { value: ethers.utils.parseEther(price) })
            } else {
                buy_res = await market.buyOne(order_id)
            }

            setCheckoutLoading(false)
            dispatch(setMarketModalCheckoutVisble(false))
            ModalResultRef.current?.show()

            setResultLoading(true)
            setTxid(buy_res.hash)

            await buy_res.wait()
            console.log('buy_res', buy_res)
            const order_buy_res = await OrderBuy({
                // asset_id: id,
                token_id: nftInfo?.token_id,
                from_address,
                to_address: account,
                order_id,
                price: library?.utils.toWei(price, 'ether'),
                unit,
                contract: nftInfo?.contract,
                amount: 1
            })
            await reqTrxHistory(1)
            await reqOrders(1)
            console.log('order_buy_res', order_buy_res)
            if (order_buy_res.data.code != 0) {
                message.error(order_buy_res.data.msg)
            }

            setResultLoading(false)

            history.push(`/MarketDetail/sell/${assetId}/${orderId}`)

            //config.KibombMarketV3Upgradeable, account, config.nft1155, id, 1, PaymentToken[_unit]
        } catch (error: any) {
            console.log('error', error)

            if (error?.data) {
                let msg = error.data.message
                if (msg.indexOf('insufficient funds for transfer') != -1) msg = 'Insufficient balance'
                message.error(msg)
            }
            setCheckoutLoading(false)
        }
    }

    const buySellClick = async orderIndex => {
        const hasOrderIndex = orderIndex !== undefined && orderIndex !== ''

        if (buyText == 'Close' && !hasOrderIndex) {
            try {
                setCloseLoading(true)
                const close_res = await market.cancelOrder(orderId)
                close_res.wait()
                const order_close_res = await OrderClose({
                    // asset_id: id,
                    order_id: orderId,
                    contract: nftInfo?.contract
                })
                await reqTrxHistory(1)
                await reqOrders(1)
                console.log('order_close_res', order_close_res)
                if (order_close_res.data.code != 0) {
                    message.error(order_close_res.data.msg)
                }
                // setCloseLoading(false)

                history.push(`/MarketDetail/sell/${assetId}/${orderId}`)
            } catch (e) {}
            setCloseLoading(false)

            return
        }
        if (!hasOrderIndex && from == 'sell') {
            const nftType = nftInfo?.contract == config.nft1155 ? 1155 : 721
            history.push(`/MyNFTShell/${nftInfo?.contract}/${nftInfo?.token_id}/${nftType}`)
            return
        }

        // orderIndex = hasOrderIndex ? orderIndex : orders.length ? 0 : ''
        // console.log('orderIndex', orderIndex)

        if (orderIndex !== '') {
            setOrderIndex(orderIndex)
        } else {
            setOrderIndex('')
            // message.error('No order!')
        }
        dispatch(setMarketModalReviewVisble(true))
    }
    const ordersChange = pagination => {
        console.log('pagination', pagination)
        reqOrders(pagination.current)
    }
    const trxHistoryChange = pagination => {
        console.log('pagination', pagination)
        reqTrxHistory(pagination.current)
    }
    // const buyText = {
    //     buy: 'Buy now',
    //     sell: 'Sell'
    // }[from]

    let buyText = ''
    switch (from) {
        case 'buy':
            buyText = 'Buy now'
            if (seller == account) buyText = 'Close'
            break
        case 'sell':
            buyText = 'On sell'
            break
    }

    const ModalResultRef = useRef<any>(null)

    const nftImgSrc = nftInfo?.attachment

    const isPC = width ? width > 768 : true

    const hasVideo = nftInfo?.contract == config.nft721BallGameStar && nftInfo?.json_url
    const orderTokenPrice = orderUnit == 'BNB' ? bnbPrice : nbpPrice
    const checkoutUnit = orderIndex === '' ? orderUnit : orders[orderIndex].unit

    useEffect(() => {
        const fetch = async (): Promise<void> => {
            if (!account) return
            const info = await userInfo({ address: account })
            if (info.data.data && info.data.data.userInfo) {
                setAccountInfo(info.data.data.userInfo)
            }
        }
        fetch()
    }, [account])

    console.log(from == 'buy' ? `/MyNFTList?address=${seller == account ? account : nftInfo?.user_info?.address}` : '/MyNFTList', nftInfo?.user_info)

    return (
        <Layout className={classnames('page-marketDetail')}>
            <div className="container">
                <TrxTypeNav activeIndex={3} emitComingSoon={() => dispatch(setComingSoonVisible(true))} />
                <ModalReview nftInfo={nftInfo} contractName={contractName} />
                <ModalCheckout
                    transitionName=""
                    orderTokenPrice={checkoutUnit == 'BNB' ? bnbPrice : nbpPrice}
                    nftInfo={nftInfo}
                    checkout={checkoutClick}
                    loading={checkoutLoading}
                    isPC={isPC}
                    contractName={contractName}
                    current_price={orderIndex === '' ? orderPrice : library?.utils.fromWei(orders[orderIndex].price)}
                    orderUnit={orderIndex === '' ? orderUnit : orders[orderIndex].unit}
                />
                <ModalResult ref={ModalResultRef} txid={txid} loading={resultLoading} nftImgSrc={nftImgSrc} nftName={nftInfo?.name} />

                <div className="content">
                    <div className={classnames('div-img', { 'div-video': hasVideo })}>
                        {hasVideo && !showImgIcon && <Spin indicator={antIcon} />}
                        {/* <img src={nftImgSrc} /> */}
                        {hasVideo ? (
                            <video
                                className="video"
                                autoPlay
                                playsInline
                                muted
                                loop
                                preload="auto"
                                onCanPlay={() => {
                                    console.log(22222222)
                                    setShowImgIcon(true)
                                }}
                                onClick={() => {
                                    setNftImgShow(true)
                                }}
                                src={nftInfo?.json_url}
                                style={{ width: '100%', height: '100%' }}
                            />
                        ) : (
                            nftInfo && (
                                <Image
                                    src={nftImgSrc}
                                    height={isPC ? 334 : 250}
                                    onClick={() => {
                                        setNftImgShow(true)
                                    }}
                                    onLoad={() => {
                                        setTimeout(() => {
                                            setShowImgIcon(true)
                                        }, 1000)
                                    }}
                                />
                            )
                        )}
                        {/* {nftImgSrc && showImgIcon && (
                            <div
                                className="div-icon"
                                onClick={() => {
                                    setNftImgShow(true)
                                }}
                            >
                                <ArrowsAltOutlined style={{ fontSize: '20px', color: '#fff' }} />
                            </div>
                        )} */}
                        {showImgIcon && <img src={require('./img/nft_img_left.png')} className="left-shadow" />}
                        {showImgIcon && <img src={require('./img/nft_img_right.png')} className="right-shadow" />}

                        <div className="top-icons">
                            <img
                                onClick={() => {
                                    dispatch(setComingSoonVisible(true))
                                }}
                                src={require('./img/start.png')}
                            />
                            <img
                                onClick={() => {
                                    dispatch(setComingSoonVisible(true))
                                }}
                                src={require('./img/share.png')}
                            />
                        </div>
                        {/* <div className="right-shadow" /> */}
                        {!isPC && <TrxTypeNav activeIndex={3} emitComingSoon={() => dispatch(setComingSoonVisible(true))} />}
                    </div>
                    <div className="main-box-c">
                        <div className={classnames('main-box', from)}>
                            <div className="nft-title">
                                <div className="meme">{contractName}</div>
                                <div className="nft-name">
                                    <span className="name">{nftInfo?.name || 'Rare_Ki_01'}</span>
                                    <span className="order-id">#{nftInfo?.token_id}</span>
                                </div>
                            </div>
                            <div className="head">
                                <div className="left">
                                    <div className="item">
                                        <div
                                            className="avatar"
                                            style={{
                                                backgroundImage: `url(${
                                                    nftInfo && nftInfo.user_info?.avatar ? nftInfo.user_info?.avatar : require('./img/avatar.png')
                                                })`
                                            }}
                                            onClick={() =>
                                                history.push(
                                                    from == 'buy'
                                                        ? `/MyNFTList?address=${seller == account ? account : nftInfo.user_info?.address}`
                                                        : '/MyNFTList'
                                                )
                                            }
                                        />
                                        <div
                                            className="info"
                                            onClick={() =>
                                                history.push(
                                                    from == 'buy'
                                                        ? `/MyNFTList?address=${seller == account ? account : nftInfo.user_info?.address}`
                                                        : '/MyNFTList'
                                                )
                                            }
                                        >
                                            <div className="nickname">
                                                <span>{nftInfo && nftInfo.user_info?.nick_name ? nftInfo.user_info?.nick_name : 'ponygirl'}</span>
                                                <Icon name="medal" />
                                            </div>
                                            <div className="address">{nftInfo && <ShortAddress address={from == 'buy' ? seller : account} />}</div>
                                        </div>
                                    </div>
                                    {/* <div className="item">#{id}</div> */}
                                </div>

                                <div className="right right-div-btn" style={{ opacity: isBuyNow ? 1 : 0 }}>
                                    {from != 'sell' && (
                                        <div className="r-title">
                                            {/* <Icon name="auction" className="icon" />
                                    <span>Current Bid</span> */}
                                            {/* <Icon name="mdprice" className="icon" /> */}
                                            <img style={{ marginRight: '14px' }} src={require('./img/market-detail-price.png')} />
                                            <span>Price</span>
                                        </div>
                                    )}
                                    {from != 'sell' && (
                                        <div className="center">
                                            <div className="item buy">
                                                <div className="name" title={orderPrice}>
                                                    {orderPrice || 0} {orderUnit}
                                                </div>
                                                <div className="value">${countUsdt(orderPrice, orderTokenPrice, orderUnit)}</div>
                                            </div>
                                            {/* <div className="item">
                                        <div className="name">Auction ending in</div>
                                        <div className="value">12:34:23</div>
                                    </div> */}
                                        </div>
                                    )}
                                    {/* <div className="div_btn">Place a bid</div> */}
                                    <Button
                                        className="div_btn"
                                        type="primary"
                                        size="large"
                                        disabled={!isBuyNow}
                                        loading={closeLoading}
                                        onClick={() => {
                                            buySellClick('')
                                        }}
                                    >
                                        {buyText}
                                    </Button>
                                </div>
                            </div>
                            <div className="body">
                                <div className="left">
                                    <div
                                        className="view item-box"
                                        onClick={(): void => {
                                            let url = `https://bscscan.com/address/${nftInfo?.contract}`
                                            if (chainId == 97) url = `https://testnet.bscscan.com/address/${nftInfo?.contract}`
                                            window.open(url)
                                        }}
                                    >
                                        <HeadTitle icon="lookup" text="View on Bscscan" rightIcon="share" />
                                    </div>
                                    <div className={classnames('Description', 'item-box', { 'hide-item-box': !showIntro })}>
                                        <HeadTitle
                                            icon="description"
                                            text="Description"
                                            showFold={!isPC}
                                            foldChange={isFlod => {
                                                setShowIntro(!isFlod)
                                            }}
                                        />
                                        <div className="box">
                                            {/* */}
                                            {nftInfo?.content ||
                                                `NFT numbered 1/1 - UNIQUE COPY ! Lixia is part of Viva Danza, a personal project in which I develomy own
                                        vision:how to faithfully transpose the movement, the essence of dance and of its beauty`}
                                        </div>
                                    </div>
                                    <div className="Properties item-box">
                                        <HeadTitle icon="star" text="Properties" />
                                        {/* <div className="box">
                                            {properties.map((item, index) => {
                                                return (
                                                    <div className="item-c" key={index} onClick={() => setPropertiesIndex(index)}>
                                                        <div className={classnames('item', { 'active-item': propertiesIndex === index })}>{item}</div>
                                                    </div>
                                                )
                                            })}
                                        </div> */}
                                    </div>
                                </div>
                                <div className="center">
                                    <div className={classnames('Listings', 'item-box', { 'hide-item-box': !showOrders })}>
                                        <HeadTitle
                                            icon="listings"
                                            text="Listings"
                                            showFold={!isPC}
                                            foldChange={isFlod => {
                                                setShowOrders(!isFlod)
                                            }}
                                        />
                                        <Orders
                                            data={orders}
                                            buyClick={buySellClick}
                                            onChange={ordersChange}
                                            pageSize={pageSize}
                                            isPC={isPC}
                                            total={orderTotal}
                                            bnbPrice={bnbPrice}
                                            nbpPrice={nbpPrice}
                                        />
                                    </div>
                                </div>
                                <div className="right">
                                    <div className={classnames('TrxHistory', 'item-box', { 'hide-item-box': !showTrxs })}>
                                        <HeadTitle
                                            icon="history"
                                            text="Transactions History"
                                            showFold={!isPC}
                                            foldChange={isFlod => {
                                                setShowTrxs(!isFlod)
                                            }}
                                        />
                                        <TrxHistory
                                            trxHistorys={trxHistorys}
                                            onChange={trxHistoryChange}
                                            pageSize={pageSize}
                                            isPC={isPC}
                                            total={trxsTotal}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {!isPC && isBuyNow && (
                        <div className="right-div-btn">
                            {from != 'sell' && (
                                <div className="left">
                                    <div className="r-title">
                                        <img style={{ marginRight: '14px' }} src={require('./img/market-detail-price.png')} />
                                        <span>Price</span>
                                    </div>
                                    <div className="center">
                                        <div className="item buy">
                                            <div className="name" title={orderPrice}>
                                                {orderPrice || 0} {orderUnit}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <Button
                                className="div_btn"
                                type="primary"
                                size="large"
                                disabled={!isBuyNow}
                                loading={closeLoading}
                                onClick={() => {
                                    buySellClick('')
                                }}
                            >
                                {buyText}
                            </Button>
                        </div>
                    )}
                </div>
                <Modal
                    visible={nftImgShow}
                    onCancel={() => setNftImgShow(false)}
                    footer={null}
                    wrapClassName="nftImgDialog"
                    centered
                    destroyOnClose={true}
                    closable={false}
                    width="auto"
                    getContainer={document.querySelector('.page-marketDetail')}
                >
                    <div className="modalTitle">
                        {showModalImgClose && (
                            <em
                                onClick={() => {
                                    setNftImgShow(false)
                                    // setShowModalImgClose(false)
                                }}
                            >
                                x
                            </em>
                        )}
                    </div>
                    <div className="modalMain">
                        {hasVideo ? (
                            <video
                                className="video"
                                autoPlay
                                playsInline
                                muted
                                loop
                                preload="auto"
                                src={nftInfo?.json_url}
                                style={{ width: '100%', height: (height || 500) - 200 }}
                            />
                        ) : (
                            <Image
                                src={nftImgSrc}
                                height={(height || 500) - 200}
                                // onLoad={() => {
                                //     setShowModalImgClose(true)
                                // }}
                            />
                        )}

                        {/* <img src={nftImgSrc} style={{ height: height - 300 + 'px' }} /> */}
                    </div>
                </Modal>

                <ShareDialog ref={ShareDialogRef} />
            </div>
        </Layout>
    )
}
