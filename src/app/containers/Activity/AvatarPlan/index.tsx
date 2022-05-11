import './index.stylus'
import 'swiper/css/swiper.css'
import '@/app/containers/Boom/Detail/font/font.css'

import { useWeb3React } from '@web3-react/core'
import { Button, message, Modal, Popover, Spin } from 'antd'
import classnames from 'classnames'
import copy from 'copy-to-clipboard'
import { getQueryStringByName } from 'mobile-browser'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import EN from '@/app/components/Header/img/language.png'
import CImage from '@/app/components/Image'
import Layout from '@/app/components/Layout'
import LogoutDialog, { ILogoutDialog } from '@/app/components/LogoutDialog'
import { injected } from '@/app/connectors'
import useIERC20 from '@/app/hooks/useIERC20'
import useNft1155Contract from '@/app/hooks/useNft1155Contract'
import useRareKiSocialContract from '@/app/hooks/useRareKiSocialContract'
import useWindowSize from '@/app/hooks/useWindowSize'
import { buyProgress, codeUse, GetCode, GetInvitationNum, getPic, RecordList, uploadBase64 } from '@/app/service/invitationServer'
import * as config from '@/app/utils/config'
import storage from '@/app/utils/storage'
import { formatDecimal, getShortenAddress, pow10 } from '@/app/utils/tool'
import Icon from '@/assets/icons'

import InvitationRecord from './components/InvitationRecord'
import ZH from './img/ZH.png'
let _timer = 0
const spends = [0, 4000, 3600, 2880, 2016, 1210, 605, 242, 73, 15]

const t_me_urls = {
    en_US: 'https://t.me/NFTBombEn',
    zh_CN: 'https://t.me/NFTBomb'
}

function GetUrlParms() {
    const args = new Object()
    const query = location.hash.substring(location.hash.indexOf('?') + 1) //获取查询串
    const pairs = query.split('&') //在&号处断开
    for (let i = 0; i < pairs.length; i++) {
        const pos = pairs[i].indexOf('=') //查找name=value
        if (pos == -1) continue //如果没有找到就跳过
        const argname = pairs[i].substring(0, pos) //提取name
        const value = pairs[i].substring(pos + 1) //提取value
        args[argname] = decodeURI(value) //存为属性
    }
    return args
}
export default (): React.ReactElement => {
    const { library, account, activate, chainId } = useWeb3React()
    const history = useHistory()
    const [t, i18n] = useTranslation()
    // const { ulang, ucode} = useParams<{ ulang: string; ucode: string; }>()
    // console.log('ucode',ucode,ulang)
    // console.log('location.search',location.search,'GetUrlParms',GetUrlParms())
    const changLng = (l: string, code: string): void => {
        setLang(l)
        i18n.changeLanguage(l)
        storage.set('language', l)
        // console.log('code', code)
        code && changeInvitationLink(code, l)
        const url_code = GetUrlParms()['code']
        if (url_code) history.replace(`?code=${url_code}&lng=${l}`)
    }
    useWindowSize(true)
    const [lang, setLang] = useState('en_US')
    const [code, setCode] = useState('')

    const [invitationLink, setInvitationLink] = useState('*****')
    const [invitationNum, setInvitationNum] = useState(0)
    const [spendToTopAmount, setSpendToTopAmount] = useState(0)

    const [visiblePopover, setVisiblePopover] = useState(false)
    const [showPopoverSurplus, setShowPopoverSurplus] = useState(true)
    const [followTwitter, setFollowTwitter] = useState(false)
    const [followTelegram, setFollowTelegram] = useState(false)

    const [isClaim, setIsClaim] = useState(false)
    const [hasPic, setHasPic] = useState(false)
    const [showPic, setShowPic] = useState(false)

    const [pic, setPic] = useState('')

    const [isTransfer, setTranfer] = useState(false)
    const [isBuy, setBuy] = useState(false)

    const [showPopoverSpend, setShowPopoverSpend] = useState(true)

    const [claimLoading, setClaimLoading] = useState(false)
    const [uploadLoading, setUploadLoading] = useState(false)
    const [buyLoading, setBuyLoading] = useState(false)
    const [reqImgLoading, setReqImgLoading] = useState(false)
    // const [uplodImgRight, setUplodImgRight] = useState(true)

    const nft1155Contract = useNft1155Contract()
    const [show, setShow] = useState<boolean>(false)

    const [loading, setLoading] = useState(false)
    const [balance, setBalance] = useState<string>()
    const LogoutDialogRef = useRef<ILogoutDialog>()
    const [records, setRecords] = useState<any[]>([])
    const storage_suffix = account + '_' + chainId
    const changeInvitationLink = (code, _lang) => {
        const url = location.origin + '/#/invitationRewards?code=' + code + '&lng=' + _lang
        // console.log('url', url)

        setInvitationLink(url)
    }
    const fetchCode = async (): Promise<void> => {
        setLoading(true)

        const res_code = await GetCode({
            address: account
        })
        if (res_code.status == 0) {
            // const href = location.href
            // console.log('1111',config.invitationActivityService + '/code/check')
            // const url = href.indexOf('?code') >= 0 ? href : res_code.data.url.replace(config.invitationActivityService + '/code/check', location.href)
            const _code = res_code.data.code
            changeInvitationLink(_code, lang)
            setCode(_code)
        }
        const res_num = await GetInvitationNum({
            address: account
        })
        // console.log('res_num', res_num)
        if (res_num.status == 0) {
            const num = res_num.data.num
            setInvitationNum(num)
            setBuy(num >= 100)
            const spend = spends[Math.floor(num / 10)]
            // console.log('spend', spend)
            setSpendToTopAmount(spend)

            fetchPic()
        }
    }
    const fetchPic = async (): Promise<void> => {
        setReqImgLoading(true)
        const res_pic = await getPic({
            address: account
        })
        setReqImgLoading(false)
        // console.log('res_pic', res_pic)
        if (res_pic.status == 0) {
            setHasPic(!!res_pic.data.pic)
            setPic(res_pic.data.pic)
        }
    }
    useEffect(() => {
        const fetch = async (): Promise<void> => {
            if (!nft1155Contract || !account) return
            const num = 0
            setInvitationNum(num)
            setBuy(num >= 100)
            setSpendToTopAmount(0)
            setInvitationLink('*****')
            setCode('')
            setPic('')
            setHasPic(false)
            setIsClaim(false)
            try {
                const res: number = await nft1155Contract.balanceOf(account, 7)
                // console.log('res 222222222', res)
                setIsClaim(res > 0)
                if (res > 0) {
                    fetchCode()
                }
            } catch (error) {
                console.log('nft1155Contract.balanceOf(account, 7) error', error)
            }
        }
        fetch()
    }, [nft1155Contract, account])
    useEffect(() => {
        changLng(GetUrlParms()['lng'] || storage.get('language') || 'en_US', '')
        if (account) {
            setFollowTwitter(!!storage.get('twitter_' + storage_suffix))
            setFollowTelegram(!!storage.get('telegram_' + storage_suffix))
            setTranfer(!!storage.get('trx_hash_' + storage_suffix))
            reqRecords()
        }
    }, [account])

    const reqRecords = async (): Promise<void> => {
        const res_records = await RecordList({
            // offset: ((page || 1) - 1) * pageSize,
            // limit: pageSize,
            address: account
        })
        // console.log('res_records', res_records)
        if (res_records.status == 0) {
            setRecords(res_records.data)
        }
    }

    // useEffect(() => {
    //     setCode(getQueryStringByName('code'))
    // }, [])

    const erc20 = useIERC20(config.nbp)
    useEffect(() => {
        if (erc20) {
            const fetch = async (): Promise<void> => {
                const balance = await erc20.balanceOf(account)
                setBalance(pow10(balance.toString(), 18))
            }
            if (account) fetch()
        }
        return () => { }
    }, [erc20, account])
    const onConnectClick = async (): Promise<void> => {
        await activate(injected)
        storage.set('isLogout', '')
    }

    const RareKiSocialContract = useRareKiSocialContract()
    const receive = async (): Promise<void> => {
        if (!account || !RareKiSocialContract) return
        setClaimLoading(true)

        try {
            const response = await RareKiSocialContract.claimAirDropFree(config.nft1155, 7)
            console.log('response', response)

            try {
                const res = await response.wait()
                setClaimLoading(false)
                if (res.status === 1) {
                    message.success('Claim successfully')
                    setIsClaim(true)
                    if (GetUrlParms()['code']) {
                        const codeUseRes = await codeUse({
                            code: GetUrlParms()['code'],
                            address: account
                        })
                        console.log('codeUseRes', codeUseRes)
                        if (codeUseRes.status != 0) {
                            message.error(codeUseRes.message)
                        }
                    }
                    fetchCode()

                    // history.push('/success')
                } else {
                    message.error('Error')
                }
            } catch (error) {
                console.log(error)
                message.error(error.message)
                setClaimLoading(false)
            }
        } catch (error) {
            console.log('error1111111', error)
            let msg = error.data?.message || error.message || 'Please check your network'
            if (msg.indexOf('redeem again') != -1) msg = 'Can not redeem again'
            message.error(msg)
            setClaimLoading(false)
        }
    }
    const copyText = (text: string): void => {
        message.destroy()
        if (copy(t('copy_invitation_text') + text)) {
            message.success(t('copySuccess'))
        } else {
            message.error(t('copyFail'))
        }
    }
    const langDownDom = (
        <div className="langDownDomMain">
            <div
                className="item"
                onClick={() => {
                    changLng('en_US', code)
                    setVisiblePopover(false)
                }}
            >
                <img src={EN} alt="" />
            </div>
            <div
                className="item"
                onClick={() => {
                    changLng('zh_CN', code)
                    setVisiblePopover(false)
                }}
            >
                <img src={ZH} alt="" />
            </div>
        </div>
    )

    const followClick = (type): void => {
        storage.set(type + '_' + storage_suffix, '1')

        if (type == 'twitter') {
            window.open('https://twitter.com/NFTBomb/')
            setFollowTwitter(true)
        } else {
            window.open(t_me_urls[lang])
            setFollowTelegram(true)
        }
    }

    const fileChange = function (event) {
        const file = event.target.files[0]
        console.log('file', file)

        const isJPGPNG = file.type === 'image/jpeg' || file.type === 'image/png'
        const isLt3M = file.size / 1024 < 3000

        if (!isJPGPNG || !isLt3M) {
            message.error(t('upload_tip'))
            return
        }

        setUploadLoading(true)
        getBase64Image(file).then(async res => {
            const base64 = res.data
            console.log('base64', base64)
            const upload_res = await uploadBase64({ address: account, data: base64 })
            console.log('upload_res', upload_res)
            if (upload_res.status == 0) {
                if (!hasPic) {
                    setShowPic(true)
                    setHasPic(true)
                }
                fetchPic()
            } else {
                message.error(upload_res.message)
            }
            setUploadLoading(false)
        })
        // $scope.fileName=file.name;
    }

    const getDividers = () => {
        return spends.slice(1).map((spendAmount, index) => {
            return (
                <Popover
                    key={index}
                    trigger="hover"
                    placement="bottom"
                    onVisibleChange={v => {
                        clearTimeout(_timer)
                        if (v) {
                            setShowPopoverSpend(false)
                        } else {
                            _timer = setTimeout(() => {
                                setShowPopoverSpend(true)
                            }, 300)
                        }
                    }}
                    content={
                        lang == 'zh_CN' ? (
                            <div className="popover-content">
                                {(index + 1) * 10}升100人需花费<span>{spendAmount} NBP</span>
                            </div>
                        ) : (
                            <div className="popover-content">
                                Spend <span>{spendAmount} NBP</span> to upgrade from {(index + 1) * 10} to 100 invation
                            </div>
                        )
                    }
                    overlayClassName="popover-surplus"
                >
                    <div className="divider" />
                </Popover>
            )
        })
    }

    const transfer = async () => {
        setBuyLoading(true)
        try {
            console.log('spendToTopAmount', spendToTopAmount)
            let trx_hash = ''
            if (isTransfer) {
                trx_hash = storage.get('trx_hash_' + storage_suffix)
            } else {
                const transfer_res = await erc20.transfer(
                    '0x7540fEa6CaefCd2359fae818F8296F4568fAa91E',
                    library.utils.toWei(spendToTopAmount + '', 'ether')
                )
                await transfer_res.wait()
                setTranfer(true)
                trx_hash = transfer_res.hash
                storage.set('trx_hash_' + account + storage_suffix, trx_hash)
            }

            console.log('trx_hash', trx_hash)

            const buy_res = await buyProgress({ address: account, tx: trx_hash })
            if (buy_res.status == 0) {
                setBuy(true)
                setInvitationNum(100)
            } else {
                message.error(buy_res.message)
            }
        } catch (error: any) {
            console.log('error', error)

            const msg = error.data?.message || error.message
            if (msg.indexOf('insufficient funds for transfer') != -1) msg = 'Insufficient balance'
            message.error(msg)
        }

        setBuyLoading(false)
    }
    const pageSize = 50
    // console.log('height', height, window.innerHeight)
    return (
        <Layout className={classnames('page-AvatarPlan')} isHide={true}>
            {/* <div className="page-AvatarPlan"> */}
            <div className={classnames('container', lang)} onClick={() => setShow(false)}>
                <div className="header">
                    <a className="logo" href="/" />
                    <div className="right">
                        {account ? (
                            <div className="div-account">
                                <div className="balance">
                                    <img src={require('@/app/components/Header/img/bnb.png')} />
                                    {formatDecimal(balance || 0, 2)} NBP
                                </div>
                                <a onClick={() => LogoutDialogRef.current?.show()}>{getShortenAddress(account)}</a>
                            </div>
                        ) : (
                            <div className="div-header-btn" onClick={onConnectClick}>
                                <span>{t('Connect')}</span>
                            </div>
                        )}

                        <Popover
                            visible={visiblePopover}
                            onVisibleChange={v => setVisiblePopover(v)}
                            content={langDownDom}
                            placement="top"
                            overlayClassName="langDownDom"
                            trigger="click"
                        >
                            <div className="langWrap">
                                {lang == 'en_US' ? (
                                    <div className="lang">
                                        <img src={EN} alt="" />
                                    </div>
                                ) : (
                                    <div className="lang">
                                        <img src={ZH} alt="" />
                                    </div>
                                )}
                            </div>
                        </Popover>
                    </div>
                </div>
                <div className={classnames('content')}>
                    <div className="page-box">
                        <div className="claim-nft">
                            <div className="left">
                                <img src={require('./img/1155_7.png')} />
                            </div>
                            <div className="right">
                                <div className="title">Rare_Ki social NFT</div>
                                <div className="intro">{t('claim_intro')}</div>
                                <div className="follow">
                                    <div className="item">
                                        <div className="top">
                                            <Icon name="twitter" />
                                            <span>@NFTBomb</span>
                                        </div>
                                        <div className="btn" onClick={() => followClick('twitter')}>
                                            {t('Follow')}
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="top">
                                            <Icon name="telegram" />
                                            <span>{t('t_me_name')}</span>
                                        </div>
                                        <div className="btn" onClick={() => followClick('telegram')}>
                                            {t('Follow')}
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    loading={claimLoading}
                                    disabled={!followTwitter || !followTelegram || isClaim || true}
                                    className="btn"
                                    type="primary"
                                    size="large"
                                    onClick={() => receive()}
                                >
                                    {/* {t(isClaim ? 'Already claimed' : 'Claim_rare_NFT')} */}
                                    {t('Stop Claim')}
                                </Button>
                            </div>
                        </div>
                        <div className="plan">
                            {lang == 'en_US' ? (
                                <div className="title">
                                    <div className="title-text">NBP community launches</div>
                                    <div className="title-text">CryptoPunks avatar incentive plan</div>
                                    <div
                                        className="page-link"
                                        onClick={() => {
                                            history.push('/stake')
                                        }}
                                    >
                                        <span>🔗</span>
                                        Incentive Funding：NBPPunks Avatar Mining
                                        <span>🔗</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="title">
                                    <div className="title-text">纯社区CryptoPunks头像激励计划</div>
                                    <div
                                        className="page-link"
                                        onClick={() => {
                                            history.push('/stake')
                                        }}
                                    >
                                        <span>🔗</span>
                                        激励基金：NBPPunks头像挖矿
                                        <span>🔗</span>
                                    </div>
                                </div>
                            )}
                            <div className="content">
                                {lang == 'zh_CN' ? (
                                    <div className={classnames('left', 'card', { 'left-upload-ok': hasPic })}>
                                        <div className="item">
                                            <div className="title">“二向箔”协议</div>
                                            <div className="desc">
                                                NFTBomb原创NFT协议"二向箔”协议 (Dual-vector Foil Protocol)面向社区
                                                启动内测。"二向箔"协议是元宇宙生态中 NFT头像自动生成协议，所有调用协议生
                                                成的NFT头像编号唯一且归制作者所有。 协议生成的NFT头像无预设，面向社区开
                                                放测试资格。测试期间的NFT头像所有权 归制作者，项目将会成立激励基金对其进
                                                行激励与宣发，共同推进项目生态繁荣。
                                            </div>
                                        </div>
                                        <div className="item">
                                            <div className="title">激励计划详情</div>
                                            <ul className="desc">
                                                <li>完成邀请任务的KOL获得通过“二向箔”协议生成NFT头像的资格</li>
                                                <li>
                                                    所有被邀请用户获得平台权益NFT<div>“Rare_Ki social”激励</div>
                                                </li>
                                                <li>所有NFT头像将享受1,000,000 NBP激励基金</li>
                                            </ul>
                                        </div>
                                        <div className="item">
                                            <div className="title">激励基金释放规则</div>
                                            <div className="desc">
                                                1,000,000 NBP激励基金将会链上智能合约自动释放。所有NFT头像资产注入链上 合约池，可均分每日产出的10,000
                                                NBP,优先完成邀请任务获得NFT头像即可优先瓜分NBP.
                                            </div>
                                        </div>
                                        <div className="item">
                                            <div className="title">邀请任务</div>
                                            <ul className="desc">
                                                <li>
                                                    通过邀请链接邀请100人领取平台权益<div>NFT“Rare_Ki social”</div>
                                                </li>
                                                <li>未满100人可消耗NBP进行任务补偿，提前完成任务</li>
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={classnames('left', 'card', { 'left-upload-ok': hasPic })}>
                                        <div className="item">
                                            <div className="title">"Dual-vector Foil Protocol"</div>
                                            <div className="desc">
                                                NFTBomb's original NFT protocol "Dual-vector Foil Protocol" launched an internal test for the
                                                community. The "Dual-vector Foil Protocol" is for automatically generating NFT avatars in the
                                                metaverse ecology. All NFT avatars generated by the protocol are unique and owned by the producer. The
                                                NFT avatar generated by the protocol has no preset and is open to the community to get test
                                                qualifications. During this period, the ownership of the NFT avatar belongs to the producer, and the
                                                project will set up an incentive fund to encourage and promote the ecological prosperity of the
                                                project.
                                            </div>
                                        </div>
                                        <div className="item">
                                            <div className="title">Incentive plan details</div>
                                            <ul className="desc">
                                                <li>
                                                    The KOL who completes the invitation task is eligible to generate NFT avatars through "Dual-vector
                                                    Foil Protocol"
                                                </li>
                                                <li>All invited users can get the platform equity NFT "Rare_Ki social"</li>
                                                <li>All NFT avatars will share 1,000,000 NBP incentive fund</li>
                                            </ul>
                                        </div>
                                        <div className="item">
                                            <div className="title">Incentive fund release rules</div>
                                            <div className="desc">
                                                The 1,000,000 NBP incentive fund will automatically release through the smart contract on the chain.
                                                All NFT avatar assets are injected into the contract pool on the chain, and can share the daily output
                                                (10,000 NBP). The earlier to finish the tasks, the earlier to share the daily output.
                                            </div>
                                        </div>
                                        <div className="item">
                                            <div className="title">Invitation task</div>

                                            <ul className="desc">
                                                <li>
                                                    Invite 100 users to receive platform equity NFT " Rare_Ki social " through your invitation link
                                                </li>
                                                <li>
                                                    If you are unable to invite 100 users, it is possible to consume NBP for task compensation to
                                                    complete the task earlier
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                                <div className="center">
                                    <div className="upload card">
                                        <div className="title">{t('Sample')}</div>
                                        <img src={require('./img/avatar.png')} />

                                        <input id="file" onChange={fileChange} type="file" name="file" accept="image/*" />
                                        {hasPic ? (
                                            <div className="bottom">
                                                <div className="upload-ok">{t('Uploaded successfully!')}</div>
                                                {lang == 'zh_CN' ? (
                                                    <div className="upload-ok-desc">NFT 头像将会在24小时内打入你的地址</div>
                                                ) : (
                                                    <div className="upload-ok-desc">
                                                        <p>The NFT avatar will be</p>
                                                        <p>sent to your address within 24 hours</p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div>
                                                <Button
                                                    onClick={() => {
                                                        document.getElementById('file')?.click()
                                                    }}
                                                    className="btn"
                                                    type="primary"
                                                    size="large"
                                                    disabled={!isBuy}
                                                    loading={uploadLoading}
                                                >
                                                    {t('Upload picture')}
                                                </Button>
                                                <div className="text">{t(isBuy ? 'upload_tip' : 'upload_intro')}</div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="invitation-info card">
                                        <div className="title">{t('Invitation information')}</div>
                                        <div className="row">
                                            {t('Wallet address')}：{account}
                                        </div>
                                        <div className="row">
                                            {t('Invitation link')}：{invitationLink}
                                        </div>
                                        <Button
                                            className="btn"
                                            type="primary"
                                            size="large"
                                            disabled={!invitationLink || !isClaim}
                                            onClick={() => copyText(invitationLink)}
                                        >
                                            {t('Click to copy')}
                                        </Button>
                                        {!isClaim && <div className="text">{t('Please receive Rare_Ki social NFT')}</div>}
                                    </div>
                                </div>
                                <div className="right">
                                    <div className={classnames('task-progress', 'card', { 'is-buy-progress': isBuy || isTransfer })}>
                                        <div className="title">{t('Task progress')}</div>
                                        <div className="div-progress-box">
                                            <div className="progress-box">
                                                <div className="progress">
                                                    <div className="divider-box">{getDividers()}</div>

                                                    <div className="complete-box">
                                                        <div className="complete" style={{ width: invitationNum + '%' }} />
                                                    </div>
                                                    {lang == 'zh_CN' ? (
                                                        <div className="surplus-box">
                                                            <div className="complete" style={{ width: invitationNum + '%' }} />
                                                            <Popover
                                                                placement="top"
                                                                visible={true}
                                                                content={
                                                                    <div className="popover-content">
                                                                        已成功邀请<span>{invitationNum}人</span>
                                                                        {invitationNum ? <span /> : ''}
                                                                    </div>
                                                                }
                                                                overlayClassName="popover-complete-value"
                                                            >
                                                                <div className="complete-value" />
                                                            </Popover>
                                                            <Popover
                                                                trigger="click"
                                                                placement="bottom"
                                                                visible={showPopoverSpend && invitationNum >= 10 && invitationNum < 100}
                                                                onVisibleChange={v => setShowPopoverSurplus(v)}
                                                                content={
                                                                    <div className="popover-content">
                                                                        花费<span>{spendToTopAmount} NBP</span>直接升到100人
                                                                    </div>
                                                                }
                                                                overlayClassName="popover-surplus"
                                                            >
                                                                <div className="surplus" />
                                                            </Popover>
                                                        </div>
                                                    ) : (
                                                        <div className="surplus-box">
                                                            <div className="complete" style={{ width: invitationNum + '%' }} />
                                                            <Popover
                                                                placement="top"
                                                                visible={true}
                                                                content={
                                                                    <div className="popover-content">
                                                                        Invited <span>{invitationNum} users</span>
                                                                        {invitationNum ? <span /> : ''}
                                                                    </div>
                                                                }
                                                                overlayClassName="popover-complete-value"
                                                            >
                                                                <div className="complete-value" />
                                                            </Popover>
                                                            <Popover
                                                                trigger="click"
                                                                placement="bottom"
                                                                visible={showPopoverSpend && invitationNum >= 10 && invitationNum < 100}
                                                                onVisibleChange={v => setShowPopoverSurplus(v)}
                                                                content={
                                                                    <div className="popover-content">
                                                                        Spend <span>{spendToTopAmount} NBP</span> to Complete the task
                                                                    </div>
                                                                }
                                                                overlayClassName="popover-surplus"
                                                            >
                                                                <div className="surplus" />
                                                            </Popover>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {!isBuy && (
                                            <div>
                                                <div className="title amount-title">{t('Complete the task')}</div>
                                                {invitationNum >= 10 ? (
                                                    <div className="amount" style={{ display: isTransfer ? 'none' : 'block' }}>
                                                        <span>{spendToTopAmount}</span>
                                                        <span>NBP</span>
                                                    </div>
                                                ) : (
                                                    <div className="amount-tip">{t('amount-tip')}</div>
                                                )}

                                                <Button
                                                    disabled={invitationNum < 10}
                                                    loading={buyLoading}
                                                    onClick={transfer}
                                                    className="btn"
                                                    type="primary"
                                                    size="large"
                                                >
                                                    {t(isTransfer ? 'Paid' : 'Complete the task immediately')}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="invitation-record card">
                                        <div className="title">{t('Invitation history')}</div>
                                        <InvitationRecord
                                            data={records}
                                        //   onChange={recordsChange}
                                        // pageSize={pageSize}
                                        //total={1}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <LogoutDialog ref={LogoutDialogRef} />

                <Modal
                    width="6.3rem"
                    visible={showPic}
                    onCancel={() => setShowPic(false)}
                    footer={null}
                    wrapClassName="picModal"
                    centered
                    destroyOnClose={true}
                    closable={false}
                    getContainer={document.querySelector('.page-AvatarPlan')}
                >
                    <div className="modalMain">
                        <div className="content">
                            {/* <img src={pic} className="img" /> */}
                            <div className="div-img">{reqImgLoading ? <Spin /> : <CImage width={'90%'} src={pic} className="img" />}</div>

                            <div className="footer">
                                <div className="btn" onClick={() => setShowPic(false)}>
                                    {t('Confirm')}
                                </div>
                                <Button
                                    onClick={() => {
                                        document.getElementById('file')?.click()
                                    }}
                                    loading={uploadLoading}
                                    className="btn"
                                    type="primary"
                                    size="large"
                                >
                                    {t('Upload again')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
            {/* </div> */}
        </Layout>
    )
}

export const getBase64Image = (file, maxWidth = 1080) => {
    const blob = isSupportcreateObjectURL(file)
    const img = new Image()
    img.src = blob

    return new Promise(resolve => {
        img.onload = function () {
            const quality = 1 //压缩图片质量0-1，值越大质量越好

            /** * 生成base64**/
            let base64 = ''

            //生成比例
            let w = this.width,
                h = this.height,
                scale = w / maxWidth

            if (w > maxWidth) {
                w = maxWidth
                h = h / scale
            }

            //生成config
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            canvas.width = w
            canvas.height = h
            ctx.drawImage(this, 0, 0, w, h)
            base64 = canvas.toDataURL('image/png', quality)
            resolve({ code: 1, data: base64 })
        }
    })
}

const isSupportcreateObjectURL = file => {
    if (window.URL) {
        return window.URL.createObjectURL(file)
    } else if (window.webkitURL) {
        return window.webkitURL.createObjectURL(file)
    } else {
        return null
    }
}
