import './userSwapToken.stylus'

import { useWeb3React } from '@web3-react/core'
import { Button, Input, Modal, Popover } from 'antd'
import classnames from 'classnames'
import * as ethers from 'ethers'
import React, { useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import Go2Top from '@/app/components/Go2Top'
import Layout from '@/app/components/Layout'
import useIERC20 from '@/app/hooks/useIERC20'
import useNft1155Contract from '@/app/hooks/useNft1155Contract'
// import useIERC20 from '@/app/hooks/useIERC20'
import useTokenSwaperContract from '@/app/hooks/useTokenSwaperContract'
import * as config from '@/app/utils/config'
import { filterInput } from '@/app/utils/tool'
import Icon from '@/assets/icons'
import { useThemeContext } from '@/theme'

import NBP from './img/nbp.png'
import NFTB from './img/NFTB.png'

export default (): React.ReactElement => {
    const { library, account } = useWeb3React()
    const history = useHistory()
    const { currentThemeName } = useThemeContext()
    const params = useParams<{ address: string; id: string }>()

    const tokenSwaperContract = useTokenSwaperContract()
    const [fromAmount, setFromAmount] = useState<string>()
    // const [toAmount, setToAmount] = useState<string>()
    const [fromBalance, setFromBalance] = useState<string>('0')
    const [loading, setLoading] = useState(false)

    // const nbpErc20 = useIERC20(config.nbp)
    const nftbErc20 = useIERC20(config.nftb)

    const getBalance = async () => {
        // const _fromAmount = await nftbErc20.balanceOf(account)

        setFromBalance(ethers.utils.formatEther(await nftbErc20.balanceOf(account)))
        console.log('fromBalance', fromBalance)
    }
    useEffect(() => {
        if (nftbErc20) getBalance()
    }, [nftbErc20])

    const handleFromChange = (amount: string): void => {
        const val = filterInput(amount)
        setFromAmount(val)
    }

    const swapToken = async (): Promise<void> => {
        // if (!tokenSwaperContract || fromAmount || !account) return
        try {
            setLoading(true)
            let is_allowance = await nftbErc20.allowance(account, config.token_swaper_address)
            console.log('is_allowance', is_allowance, is_allowance.toString(), !!is_allowance.toString(), !Number(is_allowance.toString()))
            is_allowance = Number(is_allowance.toString())
            if (!is_allowance) {
                const approve_res = await nftbErc20.approve(config.token_swaper_address, ethers.constants.MaxUint256)
                await approve_res.wait()
            }

            const tokenSwaper = await tokenSwaperContract.attach(config.token_swaper_address)
            console.log(`library.utils.toWei(fromAmount, 'ether')`, library.utils.toWei(fromAmount, 'ether'))
            const res = await tokenSwaper.swapToken(config.nftb, library.utils.toWei(fromAmount, 'ether'))
            await res.wait()
            setLoading(false)
            getBalance()
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    return (
        <Layout className={classnames('page-userSwapToken', currentThemeName)} balance={fromBalance}>
            <div className="content">
                {/* <div className="header">
                    <div className="headerMain">
                        <div className="back" onClick={() => history.push('/')}>
                            <Icon name="back" />
                        </div>
                        <div className="userInfo">
                            <div className="username">Transfer</div>
                            <div className="userLtd">Instant trading token</div>
                        </div>
                    </div>
                </div> */}
                <div className="box">
                    <div className="left">
                        <h2>Claim New Token</h2>
                        <div className="item">
                            <div className="itemTitle">
                                <span>From</span>
                                <span>Balance: {fromBalance}</span>
                            </div>
                            <div className="input">
                                <Input
                                    placeholder="0.0"
                                    bordered={false}
                                    value={fromAmount}
                                    onChange={event => {
                                        handleFromChange(event.target.value)
                                    }}
                                />
                                <div className={classnames('unitWrap', 'from')}>
                                    <div className="unit">
                                        <img src={NFTB} alt="" />
                                        NFTB
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="item">
                            <div className="itemTitle">To</div>
                            <div className="input">
                                <Input
                                    placeholder="0.00"
                                    bordered={false}
                                    value={fromAmount}
                                    disabled
                                    // onChange={event => {
                                    //     handleToChange(event.target.value)
                                    // }}
                                />
                                <div className="unitWrap">
                                    <div className="unit">
                                        <img src={NBP} alt="" />
                                        NBP
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button className="btn" loading={loading} disabled={!Number(fromAmount) || !Number(fromBalance)} onClick={swapToken}>
                            Query the Contract
                        </Button>
                        <div className="intro">
                            The latest 2.0 version of NFTBomb has launched already, which supports the NFT protocol ecology and is aimed to create a
                            new paradigm of NFT finance. The platform token NFTB is upgraded into NBP (NFTBomb Protocol). NBP will perfectly support
                            the smart contracts in the NFT protocol ecology and provide sufficient financial support. This page supports the
                            transaction between the old token NFTB and the new token NBP, while the exchange rate is 1:1.
                        </div>
                    </div>
                </div>
            </div>
            <Go2Top />
        </Layout>
    )
}
