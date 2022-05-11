import './blingHome.stylus'

import { useWeb3React } from '@web3-react/core'
import { Button, Form, Input, message } from 'antd'
import classnames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

import storage from '@/app//utils/storage'
import ErrorDialog, { IErrorDialog } from '@/app/components/ErrorDialog'
import Layout from '@/app/components/Layout'
import { injected } from '@/app/connectors'
import useKirareContract from '@/app/hooks/useKirareContract'
import useNft1155FreeContract from '@/app/hooks/useNft1155FreeContract'
import * as config from '@/app/utils/config'
import { useThemeContext } from '@/theme'

import useNftVerifyAddress from './hook/useNftVerifyAddress'

export default (): React.ReactElement => {
    const { activate, account } = useWeb3React()
    const history = useHistory()
    const ErrorDialogRef = useRef<IErrorDialog>()
    const c = useThemeContext()
    const [, reload] = useNftVerifyAddress()
    const kirareContract = useKirareContract()
    const [redeemCount, setRedeemCount] = useState()
    const [isRedeemed, setIsRedeemed] = useState()
    const [loading, setLoading] = useState(false)

    const nft1155FreeContract = useNft1155FreeContract()

    const receive = async (): Promise<void> => {
        if (config.env !== 'tmp') {
            if (!account || !kirareContract) return
            setLoading(true)
            try {
                const data = await reload(account)
                // if (!data.proof.length) return message.error('Unfortunately you are not in the whitelist')
                if (!data.proof.length) {
                    setLoading(false)
                    return message.error({
                        content: 'Unfortunately you are not in the whitelist',
                        duration: 10
                    })
                }
                const args = [config.nft1155, 1, data.proof]
                const response = await kirareContract.claimAirDrop(...args, {
                    gasLimit: 200000
                })
                try {
                    const res = await response.wait()
                    setLoading(false)
                    if (res.status === 1) {
                        message.success('Received the blind box successfully')
                        history.push('/success')
                    } else {
                        message.error('Error')
                    }
                } catch (error) {
                    message.error('This is an error message')
                    console.log(error)
                    setLoading(false)
                }
            } catch (error) {
                console.log(error)
                setLoading(false)
            }
        } else {
            if (!account || !nft1155FreeContract) return
            setLoading(true)
            try {
                const response = await nft1155FreeContract.claimAirDropFree(config.nft1155, 1)
                try {
                    const res = await response.wait()
                    setLoading(false)
                    if (res.status === 1) {
                        message.success('Received the blind box successfully')
                        history.push('/success')
                    } else {
                        message.error('Error')
                    }
                } catch (error) {
                    message.error('This is an error message')
                    console.log(error)
                    setLoading(false)
                }
                // }
            } catch (error) {
                console.log(error)
                setLoading(false)
            }
        }
    }

    const onConnectClick = async (): Promise<void> => {
        await activate(injected)
        storage.set('isLogout', '')
    }

    useEffect(() => {
        if (!kirareContract || !account) return
        const fetch = async (): Promise<void> => {
            // console.log('xx:', config.nft1155)
            // console.log(kirareContract)
            const nft11RedeemCount = await kirareContract.redeemCount(config.nft1155, 1)
            const isRedeemed = await kirareContract.isRedeemed(config.nft1155, 1, account)
            setRedeemCount(nft11RedeemCount.toString())
            setIsRedeemed(isRedeemed)
        }
        fetch()
    }, [kirareContract, account])

    console.log(isRedeemed, redeemCount)

    return (
        <Layout className={classnames('page-blingHome')}>
            <div className="container">
                <div className="header">NFTBomb Platform NFT airdrops</div>
                <div className="main">
                    <div className="left">
                        <img className="mynft" src={require('./img/mynft.png')} alt="" />
                        <div className="redeemCount">{redeemCount} LEFT</div>
                    </div>
                    <div className="right">
                        <div className="rarenft">Rare_Ki NFT</div>
                        <div className="blind">
                            Rare_Ki is NFTBomb official limited NFT. This airdrop activity is totally for free. Each address can only claim for once！
                            Otherwise, rare blind box is coming, people can get Rare_Ki by open blind boxes for mutiple times, and win the big award
                            up to 10 BNB.
                        </div>
                        {account ? (
                            <div className="swathto">
                                {Number(redeemCount) > 0 && !isRedeemed ? (
                                    <Button loading={loading} className="white" onClick={() => receive()}>
                                        Claim
                                    </Button>
                                ) : null}
                                {isRedeemed ? <div className="white">Already claimed</div> : null}
                                {Number(redeemCount) === 0 ? <div className="white">Unable to claim</div> : null}
                                <div className="openbox" onClick={() => history.push('/blingbox')}>
                                    Open the blind box
                                </div>
                            </div>
                        ) : (
                            <div className="swath" onClick={() => onConnectClick()}>
                                Connect
                            </div>
                        )}
                        <div className="messi">Messi series limited NFT Blind Box</div>
                        <div className="Owning">
                            To open the Messi series limited NFT blind box, you need to hold Rare_Ki NFT. The blind box contains the right to take
                            photos with Messi (face to face), click preview for more detailed information
                        </div>
                        <div className="nftzs" onClick={() => history.push('/MessiBlindBox')}>
                            <img className="img1" src={require('./img/nft1.png')} alt="" />
                            <img className="img2" src={require('./img/nft2.png')} alt="" />
                            <img className="img3" src={require('./img/nft3.png')} alt="" />
                            <img className="img4" src={require('./img/nft4.png')} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
