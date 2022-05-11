import './sell.stylus'
// import './remSell.stylus'
import './components/listingDialog.stylus'

import { useWeb3React } from '@web3-react/core'
import { Button, Input, message, Modal, Popover } from 'antd'
import classnames from 'classnames'
import dayjs from 'dayjs'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'

import DatePicker from '@/app/components/DatePicker'
import Go2Top from '@/app/components/Go2Top'
import Image from '@/app/components/Image'
import Layout from '@/app/components/Layout'
import Card from '@/app/components/MyCard'
// import useIERC20 from '@/app/hooks/useIERC20'
import useKibombMarketV3UpgradeableContract from '@/app/hooks/useKibombMarketV3UpgradeableContract'
import useMessi721Contract from '@/app/hooks/useMessi721Contract'
import useNft721RoleContract from '@/app/hooks/useNft721RoleContract'
import { useDodoContract, useGateContract } from '@/app/hooks/useNft721RoleDodoContract'
import useNft1155Contract from '@/app/hooks/useNft1155Contract'
import useWindowSize from '@/app/hooks/useWindowSize'
import { GetNFTInfo } from '@/app/service/marketServer'
import * as config from '@/app/utils/config'
import { filterInput } from '@/app/utils/tool'
import Icon from '@/assets/icons'
import { useThemeContext } from '@/theme'

import ListingDialog, { IDialog as IListingDialog } from './components/listingDialog'
import ShareDialog, { IDialog as IShareDialog } from './components/shareDialog'
import useCreateOrder from './hooks/useCreateOrder'
import BNB from './img/BNB.png'
import NBP from './img/NFTB.png'

const PaymentToken = {
    BNB: '0x0000000000000000000000000000000000000001',
    NBP: config.nbp
}

const assetType = {
    '1155': '0x4e46543131353500000000000000000000000000000000000000000000000000',
    '721': '0x4e46543732310000000000000000000000000000000000000000000000000000',
    erc20: '0x4552433230000000000000000000000000000000000000000000000000000000'
}

interface IList {
    tokenID: number
    ownerCount: number
    count: number
    info: {
        asset_id: number
        name: string
        content: string
        attachment: string
        contract: string
        owner: string
        category_id: string
        current_price: string
        unit: string
        create_time: string
        author_address: string
        supply_num: number
    }
}

export default (): React.ReactElement => {
    const { library, account } = useWeb3React()
    const history = useHistory()
    const { currentThemeName } = useThemeContext()
    const ListingDialogRef = useRef<IListingDialog>()
    const ShareDialogRef = useRef<IShareDialog>()
    const params = useParams<{ address: string; id: string; type: string }>()

    const KibombMarketV3UpgradeableContract = useKibombMarketV3UpgradeableContract()
    const nft1155Contract = useNft1155Contract(account)
    const nft721Contract = useNft721RoleContract(account)
    const [type, setType] = useState('Fixed')
    const [unit, setUnit] = useState('NBP')
    const [visiblePopover, setVisiblePopover] = useState(false)
    const [show, setShow] = useState(false)
    const [price, setPrice] = useState<string>()
    const [exTime, setExTime] = useState<number | null>(dayjs().add(6, 'M').unix())
    const [approvalLoading, setApprovalLoading] = useState(false)
    const [createOrderLoading, setCreateOrderLoading] = useState(false)
    const [step, setStep] = useState(0)
    const [, httpCreateOrder] = useCreateOrder()
    const [nftInfo, setNftInfo] = useState<IList>()

    const messi721Contract = useMessi721Contract()
    const dodoContract = useDodoContract(account)
    const gateContract = useGateContract(account)

    // const nbpErc20 = useIERC20(config.nbp)

    const unitDownDom = (
        <div className="unitDownDomMain">
            <div
                className="item"
                onClick={() => {
                    setUnit('BNB')
                    setVisiblePopover(false)
                }}
            >
                <span>BNB</span>
                <img src={BNB} alt="" />
            </div>
            <div
                className="item"
                onClick={() => {
                    setUnit('NBP')
                    setVisiblePopover(false)
                }}
            >
                <span>NBP</span>
                <img src={NBP} alt="" />
            </div>
        </div>
    )

    const handlePriceChange = (amount: string): void => {
        const val = filterInput(amount)
        setPrice(val)
    }

    const handleSell = async (): Promise<void> => {
        if (
            !KibombMarketV3UpgradeableContract ||
            !exTime ||
            !price ||
            !nft1155Contract ||
            !nft721Contract ||
            !account ||
            !nftInfo ||
            !messi721Contract ||
            !dodoContract ||
            !gateContract
        )
            return
        setShow(true)
        try {
            setStep(1)
            setApprovalLoading(true)
            if (params.type === '1155') {
                // 上架1155
                const isApprovalAll = await nft1155Contract.isApprovedForAll(account, config.KibombMarketV3Upgradeable)
                if (!isApprovalAll) {
                    const nft115Asset = await nft1155Contract.attach(config.nft1155)
                    const nft1155Res = await nft115Asset.setApprovalForAll(config.KibombMarketV3Upgradeable, true)
                    await nft1155Res.wait()
                }
            }
            if (params.type === '721') {
                // 上架721
                if (params.address === config.KibombNft721Role) {
                    const isApprovalAll = await nft721Contract.isApprovedForAll(account, config.KibombMarketV3Upgradeable)
                    if (!isApprovalAll) {
                        const nft721Asset = await nft721Contract.attach(config.KibombNft721Role)
                        const nft721Res = await nft721Asset.setApprovalForAll(config.KibombMarketV3Upgradeable, true)
                        await nft721Res.wait()
                    }
                }
                if (params.address === config.nft721BallGameStar) {
                    const isApprovalAll = await messi721Contract.isApprovedForAll(account, config.KibombMarketV3Upgradeable)
                    if (!isApprovalAll) {
                        const messi721Asset = await messi721Contract.attach(config.nft721BallGameStar)
                        const messi721res = await messi721Asset.setApprovalForAll(config.KibombMarketV3Upgradeable, true)
                        await messi721res.wait()
                    }
                }
                if (params.address === config.dodoAsset) {
                    const isApprovalAll = await dodoContract.isApprovedForAll(account, config.KibombMarketV3Upgradeable)
                    if (!isApprovalAll) {
                        const dodo721Asset = await dodoContract.attach(config.dodoAsset)
                        const dodo721res = await dodo721Asset.setApprovalForAll(config.KibombMarketV3Upgradeable, true)
                        await dodo721res.wait()
                    }
                }
                if (params.address === config.gateAsset) {
                    const isApprovalAll = await gateContract.isApprovedForAll(account, config.KibombMarketV3Upgradeable)
                    if (!isApprovalAll) {
                        const gate721Asset = await gateContract.attach(config.gateAsset)
                        const gate721res = await gate721Asset.setApprovalForAll(config.KibombMarketV3Upgradeable, true)
                        await gate721res.wait()
                    }
                }
            }
            const market = await KibombMarketV3UpgradeableContract.attach(config.KibombMarketV3Upgradeable)
            setStep(2)
            setApprovalLoading(false)
            setCreateOrderLoading(true)
            console.log(params.address, params.id, 1, assetType[params.type], library?.utils.toWei(price, 'ether'), PaymentToken[unit], +exTime)
            const changeRes = await market.createOrder(
                params.address,
                params.id,
                1,
                assetType[params.type],
                library?.utils.toWei(price, 'ether'),
                PaymentToken[unit],
                +exTime
            )
            const res = await changeRes.wait()
            setCreateOrderLoading(false)
            res.events.forEach(async e => {
                if (e.event === 'CreateOrder') {
                    await httpCreateOrder({
                        order_id: `${e.args.orderId}`,
                        token_id: params.id,
                        asset_id: `${nftInfo.info.asset_id}`,
                        // asset_id: params.address,
                        from_address: account,
                        price: library?.utils.toWei(price, 'ether'),
                        unit,
                        contract: params.address,
                        amount: 1
                    })
                    history.push(`/MarketDetail/buy/${nftInfo.info.asset_id}/${e.args.orderId}?tip=1`)
                    ShareDialogRef.current?.show()
                }
            })
            console.log(res)
        } catch (error) {
            console.log(error)
            setApprovalLoading(false)
            setCreateOrderLoading(false)
        }
        setShow(false)
        setStep(0)
    }

    useEffect(() => {
        const fetch = async (): Promise<void> => {
            const nftInfo: any = await GetNFTInfo({
                token_id: params.id,
                contract: params.address
            })
            setNftInfo({
                tokenID: Number(params.id),
                info: nftInfo.data.data.assetInfo,
                ownerCount: 1,
                count: nftInfo.data.data.count
            })
        }
        fetch()
        return () => {}
    }, [params])

    return (
        <Layout className={classnames('page-MyNFTShell', currentThemeName)}>
            <div className="content">
                <div className="header">
                    <div className="headerMain">
                        <div className="back" onClick={() => history.go(-1)}>
                            <Icon name="back" />
                        </div>
                        <div className="userAvatar">
                            <Image className="cardImage" src={nftInfo?.info?.attachment} />
                        </div>
                        <div className="userInfo">
                            <div className="userLtd">NFTBomb Kirare</div>
                            <div className="username">{nftInfo?.info?.name}</div>
                        </div>
                    </div>
                </div>
                <div className="box">
                    <div className="left">
                        <div className="title">List item for sale</div>
                        <div className="item">
                            <div className="itemTitle">Type</div>
                            <div className="type">
                                <div className={classnames('typeItem', { cur: type === 'Fixed' })} onClick={() => setType('Fixed')}>
                                    <div className="typeTitle">
                                        <span>
                                            <Icon name="change" />
                                        </span>
                                        <span>Fixed Price</span>
                                    </div>
                                    <div className="typeDesc">Sell at a fixed price</div>
                                </div>
                                {/* <div
                                    className={classnames('typeItem', { cur: type === 'Auction' })}
                                    onClick={() => {
                                        setType('Auction')
                                        message.error('Coming soon')
                                    }}
                                >
                                    <div className="typeTitle">
                                        <span>
                                            <Icon name="auction" />
                                        </span>
                                        <span>Auction</span>
                                    </div>
                                    <div className="typeDesc">Auction to the highest bidder</div>
                                </div> */}
                            </div>
                        </div>
                        <div className="item">
                            <div className="itemTitle">Price</div>
                            <div className="input">
                                <Input
                                    placeholder="Please enter price"
                                    bordered={false}
                                    value={price}
                                    onChange={event => {
                                        handlePriceChange(event.target.value)
                                    }}
                                />
                                <Popover
                                    visible={visiblePopover}
                                    onVisibleChange={v => setVisiblePopover(v)}
                                    content={unitDownDom}
                                    placement="bottomRight"
                                    overlayClassName="unitDownDom"
                                    trigger="click"
                                >
                                    <div className="unitWrap">
                                        {unit === 'BNB' && (
                                            <div className="unit">
                                                <img src={BNB} alt="" />
                                                <span>BNB</span>
                                            </div>
                                        )}
                                        {unit === 'NBP' && (
                                            <div className="unit">
                                                <img src={NBP} alt="" />
                                                <span>NBP</span>
                                            </div>
                                        )}
                                    </div>
                                </Popover>
                            </div>
                        </div>
                        <div className="item">
                            <div className="itemTitle">Schedule listing</div>
                            <div className="date">
                                <div className="DatePicker">6 months</div>
                                {/* <div className="DatePicker">{dayjs().add(3, 'M')}</div>
                                <div>
                                    <div>6 months</div>
                                    <div>1 months</div>
                                    <div>1 weeks</div>
                                </div> */}
                                {/* <DatePicker
                                    bordered={false}
                                    allowClear={false}
                                    defaultValue={dayjs().add(6, 'M')}
                                    disabledDate={current => current && current < dayjs().endOf('day')}
                                    onChange={val => {
                                        setExTime(val)
                                    }}
                                    disabled
                                /> */}
                            </div>
                        </div>
                        <div className="item">
                            <div className="itemTitle">Fees</div>
                            <div className="fee">
                                <div className="feeTitle">Service Fee</div>
                                <div className="feeNumber">3%</div>
                            </div>
                        </div>
                        <Button className="btn" disabled={!exTime || !Number(price)} onClick={() => handleSell()}>
                            Complete listing
                        </Button>
                    </div>
                    <div className="right">
                        <div className="title">Preview</div>
                        {nftInfo && nftInfo.info ? (
                            <Card
                                src={nftInfo?.info.attachment}
                                type={'change'}
                                owned={nftInfo.info.owner}
                                name={nftInfo.info.name}
                                total={nftInfo.info.supply_num}
                                number={nftInfo.count || 1}
                                assetType={params.type}
                                isHideHeader={true}
                            />
                        ) : null}
                    </div>
                </div>
            </div>
            <Go2Top />
            <Modal
                visible={show}
                onCancel={() => setShow(false)}
                footer={null}
                wrapClassName="listingDialog"
                centered
                destroyOnClose={true}
                closable={false}
            >
                <div className="modalTitle">
                    <div className="title">Complete your listing</div>
                    <em onClick={() => setShow(false)}>x</em>
                </div>
                <div className="modalMain">
                    <div className="content">
                        {/* <div className="item">
                            <img src={require('./img/one.png')} alt="" />
                            <div className="text">
                                <div>Initialize your wallet</div>
                                <div>To get set up for selling on NFTBomb for the first time, you must initialize your wallet</div>
                            </div>
                            <Button className={classnames('btn', 'done')}>In progress</Button>
                        </div> */}
                        <div className="item">
                            <img src={require('./img/one.png')} alt="" />
                            <div className="text">
                                <div>Approve token</div>
                                <div>To get set up for listings for the first time, you must approve the token for trading</div>
                            </div>
                            <Button loading={approvalLoading} className={classnames('btn', { done: step === 2 })}>
                                {approvalLoading ? 'In progress' : 'Done'}
                            </Button>
                        </div>
                        <div className="item">
                            <img src={require('./img/two.png')} alt="" />
                            <div className="text">
                                <div>
                                    Confirm {price} {unit} listing
                                </div>
                                <div>Accept the signature request in your wallet and wait for your listing to process.</div>
                            </div>
                            <Button loading={createOrderLoading} className={classnames('btn')}>
                                {createOrderLoading ? 'In progress' : step === 1 ? 'Waiting for the Approve' : 'Done'}
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
            <ShareDialog ref={ShareDialogRef} />
        </Layout>
    )
}
