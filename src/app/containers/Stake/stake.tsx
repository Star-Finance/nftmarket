import './stake.stylus'

import { useWeb3React } from '@web3-react/core'
import { Button, message } from 'antd'
import { Spin } from 'antd'
import BigNumber from 'bignumber.js'
import classnames from 'classnames'
import dayjs from 'dayjs'
import * as ethers from 'ethers'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Image from '@/app/components/Image'
import Layout from '@/app/components/Layout'
import useCountDown from '@/app/hooks/useCountDown'
import useIERC20 from '@/app/hooks/useIERC20'
import useMerge from '@/app/hooks/useMerge'
import useNft1155Contract from '@/app/hooks/useNft1155Contract'
import useVault from '@/app/hooks/useVault'
import useWindowSize from '@/app/hooks/useWindowSize'
import * as config from '@/app/utils/config'
import nft721ContractFunc from '@/app/utils/nft721Contract'
import { request } from '@/app/utils/request'
import { formatDecimal, formatMoney, pow10 } from '@/app/utils/tool'

import Header from './components/header'
import SuccessModal, { IDialog as ISuccessModal } from './components/successModal'
const progress = (number: number): React.ReactElement => (
    <div className="progress">
        <div className="progressBar">
            <div className="progressBarMain">
                <div style={{ width: `${number}%` }} />
            </div>
        </div>
        <div className="progressText">{number.toFixed(2)}%</div>
    </div>
)

export default (): React.ReactElement => {
    const { library, account } = useWeb3React()
    const [balance, setBalance] = useState<string>()
    const [t, i18n] = useTranslation()
    const vaultContract = useVault()
    const mergeContract = useMerge()

    // const nft721Contract = useNft721RoleContract(account)
    const [isApprovalAll, setIsApprovalAll] = useState(false)
    const [approvalLoading, setApprovalLoading] = useState(false)
    const [stakeLoading, setStakeLoading] = useState(false)
    const [unStakeLoading, setUnStakeLoading] = useState(false)
    const [combiningPlanLoading, setCombiningPlanLoading] = useState(false)
    const [nftCount, setNftCount] = useState(0)
    const [progressValue, setProgressValue] = useState(0)
    const [remain, setRemain] = useState(0)
    const [endTime, setEndTime] = useState(0)
    const [end, setEnd] = useState(0)
    const { hours, minutes, seconds } = useCountDown(endTime)
    const [claimAmount, setClaimAmount] = useState(0)
    const [isStake, setIsStake] = useState(false)
    const [stakeIndex, setStakeIndex] = useState(0)
    const [fresh, setFresh] = useState(false)
    const [tokenId, setTokenId] = useState<number>()
    const [imgUri, setImgUri] = useState<string>()
    const [nftAddress, setNftAddress] = useState<string>()
    const [start, setStart] = useState()
    const [nft11557Num, setNft11557Num] = useState(0)
    const [approveNBP, setApproveNBP] = useState(false)
    const [approve11557, setApprove11557] = useState(false)
    const nft1155Contract = useNft1155Contract(account)
    const successModalRef = useRef<ISuccessModal>()
    useWindowSize(true)

    const approval = async (): Promise<void> => {
        if (vaultContract && account && nftAddress) {
            setApprovalLoading(true)
            try {
                if (!isApprovalAll) {
                    const nft721Contract = await nft721ContractFunc(nftAddress, account)
                    const nft721Asset = await nft721Contract.attach(nftAddress)
                    const nft721Res = await nft721Asset.setApprovalForAll(config.vault, true)
                    await nft721Res.wait()
                    setIsApprovalAll(true)
                    setApprovalLoading(false)
                    setFresh(true)
                }
            } catch (error) {
                setApprovalLoading(false)
                console.log(error)
            }
        }
    }

    const stake = async (): Promise<void> => {
        if (+Number(start) > dayjs().unix()) return
        if (vaultContract && account && tokenId) {
            setStakeLoading(true)
            try {
                const res = await vaultContract.stake(tokenId)
                await res.wait()
                setStakeLoading(false)
                setFresh(true)
            } catch (error) {
                setStakeLoading(false)
                console.log(error)
            }
        }
    }

    const unStake = async (): Promise<void> => {
        if (vaultContract) {
            setUnStakeLoading(true)
            try {
                const res = await vaultContract.unstake()
                await res.wait()
                setUnStakeLoading(false)
                setIsStake(false)
                setFresh(true)
            } catch (error) {
                setUnStakeLoading(false)
            }
        }
    }

    const Combine = async (): Promise<void> => {
        // successModalRef.current?.show()
        if (mergeContract) {
            setCombiningPlanLoading(true)
            try {
                const res = await mergeContract.forge(1, [7], [25])
                await res.wait()
                successModalRef.current?.show()
                get1155_7()
                setCombiningPlanLoading(false)
            } catch (error) {
                message.error(error.data?.message || error.message)
                setCombiningPlanLoading(false)
            }
        }
    }

    const CombineApprove = async (): Promise<void> => {
        if (erc20nbp && nft1155Contract) {
            setCombiningPlanLoading(true)
            try {
                console.log('approveNBP', approveNBP)
                if (!approveNBP) {
                    const approve_res = await erc20nbp.approve(config.merge, ethers.constants.MaxUint256)
                    await approve_res.wait()
                    setApproveNBP(true)
                }
                if (!approve11557) {
                    const nft1155Res = await nft1155Contract.setApprovalForAll(config.merge, true)
                    await nft1155Res.wait()
                    setApprove11557(true)
                }
                setCombiningPlanLoading(false)
            } catch (error) {
                console.log('error', error)
                message.error(error.data?.message || error.message)
                setCombiningPlanLoading(false)
            }
        }
    }

    const getNftInfo = async (stakeIndex?: number): Promise<void> => {
        if (!vaultContract || !account) return
        try {
            const address = await vaultContract.nftAddress()
            const nft721Contract = await nft721ContractFunc(address, account)
            setNftAddress(address)
            if (stakeIndex) {
                const res = await vaultContract.vaults(stakeIndex)
                const uri = await nft721Contract.tokenURI(+res.tokenId)
                const json = await request(uri + '.json')
                if (json && json.data) {
                    setImgUri(json.data.image)
                }
            } else {
                const balance = await nft721Contract.balanceOf(account)
                for (let i = 0; i < balance; i++) {
                    const res = await nft721Contract.tokenOfOwnerByIndex(account, i)
                    if (res > 0 && balance - 1 === i) {
                        setTokenId(+res)
                        const uri = await nft721Contract.tokenURI(+res)
                        const json = await request(uri + '.json')
                        if (json && json.data) {
                            setImgUri(json.data.image)
                        }
                    }
                }
            }

            const isApprovalAll = await nft721Contract.isApprovedForAll(account, config.vault)
            setIsApprovalAll(isApprovalAll)
        } catch (error) {
            console.log(error)
        }
    }

    const fetch = async (): Promise<void> => {
        reset()
        if (vaultContract) {
            const NftCount = await vaultContract.NftCount()
            const TotalAmount = await vaultContract.TotalAmount()
            const leftAmount = await vaultContract.leftAmount()
            const start = await vaultContract.start()
            const Round = await vaultContract.Round()
            const end = 100 - +Round.toString()
            const remain = new BigNumber(pow10(TotalAmount.toString())).minus(pow10(leftAmount.toString()))
            const isStop = await vaultContract.isStop()
            setRemain(+remain)
            setProgressValue(+remain.div(pow10(TotalAmount.toString())).multipliedBy(100))
            setNftCount(NftCount.toString())
            setEnd(end)
            if (!end) {
                setEndTime(+dayjs.unix(start.toString()).add(100 - +Round.toString(), 'day'))
            }
            setStart(start)

            if (account) {
                try {
                    const index = await vaultContract.userStakeIndex(account)
                    getNftInfo(+index)
                    setStakeIndex(+index)
                    const ClaimAmount = await vaultContract.claimAmount(account)
                    const ClaimAmountValue = +pow10(ClaimAmount.toString()).toString()
                    setClaimAmount(ClaimAmountValue)
                    if (ClaimAmountValue && !isStop) {
                        setIsStake(true)
                    }
                } catch (error) { }
            }
            setFresh(false)
        }
    }

    const reset = (): void => {
        setNftAddress(undefined)
        setStakeIndex(0)
        setClaimAmount(0)
        setIsStake(false)
        setImgUri(undefined)
        setTokenId(undefined)
    }

    const get1155_7 = async (): Promise<void> => {
        if (!nft1155Contract || !account || !erc20nbp) return
        setCombiningPlanLoading(true)
        try {
            const res: number = await nft1155Contract.balanceOf(account, 7)
            setNft11557Num(+res)
            console.log('11557 num res 222222222', +res)
            if (!approveNBP) {
                let is_allowance = await erc20nbp.allowance(account, config.merge)
                is_allowance = Number(is_allowance.toString())
                setApproveNBP(!!is_allowance)
            }
            if (!approve11557) {
                // const RareKiSocialContract = await nft721ContractFunc(config.RareKiSocialContract, account)
                //     const nft1155Res = await RareKiSocialContract.setApprovalForAll(config.merge, true)
                const isApproval11557 = await nft1155Contract.isApprovedForAll(account, config.merge)
                setApprove11557(isApproval11557)
                console.log('isApproval11557', isApproval11557)
            }

            const _balance = await erc20nbp.balanceOf(account)
            setBalance(pow10(_balance.toString(), 18))
        } catch (error) {
            console.log('nft1155Contract.balanceOf(account, 7) error', error)
        }
        setCombiningPlanLoading(false)
    }

    const erc20nbp = useIERC20(config.nbp)
    useEffect(() => {
        setApproveNBP(false)
        setApprove11557(false)
        get1155_7()
        return () => { }
    }, [nft1155Contract, account, erc20nbp])

    useEffect(() => {
        fetch()
        return () => { }
    }, [vaultContract, account])

    useEffect(() => {
        if (fresh) {
            fetch()
        }
        return () => { }
    }, [fresh])
    const nft1155_7_data = [1, 2, 3, 4, 5]
    const isApproveCombineAll = approveNBP && approve11557
    return (
        <Layout className={classnames('page-stake', { en: i18n.language === 'en_US' })} isHide={true}>
            <Header />
            <div className="banner">
                <div className="bannerMain">
                    <div className="bannerTitle">
                        <span dangerouslySetInnerHTML={{ __html: t('stake.bannerTitle') }} />
                    </div>
                    <div className="bannerDesc" dangerouslySetInnerHTML={{ __html: t('stake.bannerDesc') }} />
                </div>
            </div>
            <div className="generate-plan">
                <div className="title">{t('combiningPlan.title')}：</div>
                <div className="intro">{t('combiningPlan.intro')}</div>
                <div className="body">
                    <div className="left-imgs">
                        {nft1155_7_data.map((group, index) => {
                            return (
                                <div key={index} className={classnames('item-box', index % 2 == 0 ? 'lb-origin' : 'lt-origin')}>
                                    <div className={classnames('div-img', { active: nft11557Num >= 1 + index * 5 })} />
                                    <div className={classnames('div-img', { active: nft11557Num >= 2 + index * 5 })} />
                                    <div className={classnames('div-img', { active: nft11557Num >= 3 + index * 5 })} />
                                    <div className={classnames('div-img', { active: nft11557Num >= 4 + index * 5 })} />
                                    <div className={classnames('div-img', { active: nft11557Num >= 5 + index * 5 })} />
                                </div>
                            )
                        })}
                    </div>
                    <div className="opt">
                        <div className="num">{nft11557Num} social NFT</div>
                        <div className="amount">3000 NBP</div>
                        <Button
                            onClick={isApproveCombineAll ? Combine : CombineApprove}
                            disabled={isApproveCombineAll ? nft11557Num < 25 : false}
                            loading={combiningPlanLoading}
                            className="btn"
                        >
                            {t(isApproveCombineAll ? 'combiningPlan.Combine' : 'combiningPlan.Approve')}
                        </Button>
                    </div>
                    <div className="right-img">
                        <img src={require('./img/g_plan.png')} />
                    </div>
                </div>
            </div>
            <div className="block">
                <div className="blockTitle">
                    <span>
                        <em>1,000,000</em> {t('stake.blockTitle')}
                    </span>
                </div>
                <div className="blockBox">
                    <div className="imgWrap">
                        {!imgUri && tokenId ? (
                            <div className="img">
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                    <Spin />
                                </div>
                            </div>
                        ) : null}
                        {imgUri ? <Image src={imgUri} height="100%" width="100%" /> : <div className="img" />}
                        {!tokenId && !stakeIndex ? <div className="emptyText">{t('stake.emptyText')}</div> : null}
                        {!isApprovalAll ? (
                            <Button
                                disabled={start ? +Number(start) > dayjs().unix() : true}
                                loading={approvalLoading}
                                className={classnames('btn', { empty: !tokenId })}
                                onClick={() => approval()}
                            >
                                {t('stake.imgBtnTextApprove')}
                            </Button>
                        ) : null}
                        {isApprovalAll && !stakeIndex ? (
                            <Button
                                disabled={!tokenId}
                                loading={stakeLoading}
                                className={classnames('btn', { empty: !tokenId })}
                                onClick={() => stake()}
                            >
                                {t('stake.imgBtnTextStake')}
                            </Button>
                        ) : null}
                    </div>
                    <div className="info">
                        <div className="title">{t('stake.infoTitle')}</div>
                        <div className="desc">{t('stake.infoDesc')}</div>
                        <div className="progressWrap">
                            {progress(progressValue)}
                            <div className="coin">
                                {t('stake.progressWrapText')}: {remain ? formatMoney(remain) : 0} NBP
                            </div>
                        </div>
                        <div className="totalWrap">
                            <div className="item">
                                <div>
                                    {Number(nftCount) ? Number(nftCount ? formatDecimal(+new BigNumber(10000).div(nftCount).toString(), 2) : 0) : 0}{' '}
                                    NBP
                                </div>
                                <span>{t('stake.expect')}</span>
                            </div>
                            <div className="item">
                                <div>{nftCount} NFT</div>
                                <span>{t('stake.deposit')}</span>
                            </div>
                            <div className="item">
                                {end > 1 ? (
                                    <div>{end} day</div>
                                ) : (
                                    <div>
                                        {hours} : {minutes} : {seconds}
                                    </div>
                                )}
                                <span>{t('stake.time')}</span>
                            </div>
                        </div>
                        <div className="reword">
                            {t('stake.obtain')}: <span>{claimAmount ? formatDecimal(claimAmount, 2) : 0} NBP</span>
                        </div>
                        <Button disabled={!isStake} loading={unStakeLoading} className="btn" onClick={() => unStake()}>
                            {t('stake.claim')}
                        </Button>
                    </div>
                </div>
                <SuccessModal ref={successModalRef} />
            </div>
        </Layout>
    )
}
