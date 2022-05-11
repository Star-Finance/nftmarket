import './messiBlindBox.stylus'
import 'swiper/css/swiper.css'

import { BigNumber } from '@ethersproject/bignumber'
import { useWeb3React } from '@web3-react/core'
import { Button, message } from 'antd'
import classnames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'

import Layout from '@/app/components/Layout'
import useMeixiContract from '@/app/hooks/useMeixiContract'
import useNft721Contract from '@/app/hooks/useNft721Contract'
import useNft1155Contract from '@/app/hooks/useNft1155Contract'
import useWindowSize from '@/app/hooks/useWindowSize'
import * as config from '@/app/utils/config'

export default (): React.ReactElement => {
    const { library, account } = useWeb3React()
    const history = useHistory()
    const { height } = useWindowSize()

    const meiXiContract = useMeixiContract()
    const nft1155Contract = useNft1155Contract()
    const nft721Contract = useNft721Contract()
    const [obj, setObj] = useState<{ [key: string]: string }>({})
    const [meiXiObj, setMeiXiObj] = useState<{ [key: string]: string }>({})
    const [show, setShow] = useState<boolean>(false)
    const [loading, setLoading] = useState(false)

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

    useEffect(() => {
        const fetch = async (): Promise<void> => {
            if (!nft721Contract || !account) return
            const obj = {}
            let totalNum = 0
            for (let i = 1; i < 7; i++) {
                const res = await nft721Contract.balanceOf(account, i)
                obj[`lv${i}`] = res
                totalNum += Number(res)
            }
            obj['totalNum'] = totalNum
            setMeiXiObj(obj)
        }
        fetch()
    }, [nft721Contract, account])

    const handleOpenMeixi = async (): Promise<void> => {
        if (!meiXiContract || !account) return
        if (Number(obj.lv1) !== 0 || Number(obj.lv3) !== 0 || Number(obj.lv4) !== 0 || Number(obj.lv5) !== 0) {
            try {
                setLoading(true)
                const estimatedGasLimit = await meiXiContract.estimateGas.buyBlindBoxNft721(1, config.nft721, {
                    value: library?.utils.toWei('0.3', 'ether')
                })
                const buyBlineBox = await meiXiContract.buyBlindBoxNft721(2, {
                    value: library?.utils.toWei('0.3', 'ether'),
                    gasLimit: estimatedGasLimit.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
                })
                try {
                    const res = await buyBlineBox.wait()
                    setLoading(false)
                    if (res.status === 1) {
                        let buyLv = 1
                        res.events.forEach(e => {
                            if (e.event === 'BuyBlindBoxNft721') {
                                buyLv = e.args.tokenId721.toString()
                            }
                        })
                        message.success(`You get the Messi blind box with id ${buyLv}`)
                        history.push(`/messisuccess/${buyLv}`)
                    }
                } catch (error) {
                    setLoading(false)
                    message.error('Error')
                }
            } catch (error) {
                console.log(error)
                setLoading(false)
            }
        } else {
            message.warn("Don't have permission to buy Messi Blind Box")
        }
    }
    return (
        <Layout className={classnames('page-messiBlindBox')} isHide>
            <div className="container" onClick={() => setShow(false)}>
                {!show ? (
                    <div className={classnames('content')} style={{ height }}>
                        <div className="MessiNFT">
                            <div className="title">
                                <img src={require('./img/title.png')} alt="" />
                            </div>
                            <div className="main">
                                <div className="left">
                                    <img className="messi" src={require('./img/messi.png')} alt="" />
                                    {/* onClick={e => {
                                            e.stopPropagation()
                                            setShow(true)
                                        }} */}
                                    <div className="messi-nft">coming soon</div>
                                </div>
                                <div className="right">
                                    <div className="row">
                                        <img className="messi1" src={require('./img/messi1.png')} alt="" />
                                        <img className="messi2" src={require('./img/messi2.png')} alt="" />
                                    </div>
                                    <div className="row">
                                        <img className="messi3" src={require('./img/messi3.png')} alt="" />
                                        <img className="messi4" src={require('./img/messi4.png')} alt="" />
                                        <img className="messi5" src={require('./img/messi5.png')} alt="" />
                                    </div>
                                </div>
                            </div>
                            {/* <p className="messi-nftTotal">{meiXiObj?.totalNum?.toString()}</p> */}
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
                        <div className={classnames('ordinary')}>
                            <Button
                                loading={loading}
                                className="ordinary-nft"
                                onClick={e => {
                                    e.stopPropagation()
                                    handleOpenMeixi()
                                }}
                            >
                                0.3 BNB open
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )
}
