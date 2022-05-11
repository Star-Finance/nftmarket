import './dodo.stylus'
import 'swiper/css/swiper.css'

import { BigNumber } from '@ethersproject/bignumber'
import { useWeb3React } from '@web3-react/core'
import { Button, message } from 'antd'
import classnames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'

import Layout from '@/app/components/Layout'
import { verify, verify2 } from '@/app/service/dodoServer'
import * as config from '@/app/utils/config'

import useDodoContract from './hooks/useDodoContract'

export default (): React.ReactElement => {
    const { library, account } = useWeb3React()
    const history = useHistory()
    const contract = useDodoContract()
    const [proof, setProof] = useState()
    const [proof2, setProof2] = useState()
    const [disabled, setDisabled] = useState(true)
    const [disabled2, setDisabled2] = useState(true)
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [success, setSuccess] = useState(false)
    const [success2, setSuccess2] = useState(false)

    const Claim1155 = async (): Promise<void> => {
        if (!contract && !account) return
        try {
            setLoading2(true)
            const res = await contract?.claimAirDrop(config.dodo1155, 2, proof2)
            const response = await res.wait()
            await fetchVerify()
            setLoading2(false)
            setSuccess2(true)
            setDisabled2(true)
        } catch (error) {
            setLoading2(false)
            console.log(error)
        }
    }

    const Claim721 = async (): Promise<void> => {
        if (!contract && !account) return
        try {
            setLoading(true)
            const res = await contract?.claimAirDrop(config.dodo1155, 1, proof)
            const response = await res.wait()
            await fetchVerify()
            setLoading(false)
            setSuccess(true)
            setDisabled(true)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    const fetchVerify = async (): Promise<void> => {
        const res: any = await verify({ account })
        console.log(res.data.data.proof, '222')
        if (res?.data?.data) {
            setProof(res.data.data.proof) // 500 / tokenID:1
        }
        const res2: any = await verify2({ account })
        console.log(res2.data.data.proof, '111')
        if (res?.data?.data) {
            setProof2(res2.data.data.proof) // 671 / tokenID:2
        }
    }

    useEffect(() => {
        if (!account) return
        fetchVerify()
        return () => {}
    }, [account])

    useEffect(() => {
        if (contract && account && proof) {
            const fetch = async (): Promise<void> => {
                if (!contract) return
                try {
                    const res = await contract.checkWhiteList(config.dodo1155, 1, account, proof)
                    setDisabled(false)
                } catch (error) {
                    console.log(error, proof)
                }
            }
            fetch()
        }
        return () => {}
    }, [contract, account, proof])

    useEffect(() => {
        if (contract && account && proof2) {
            const fetch = async (): Promise<void> => {
                if (!contract) return
                try {
                    const res = await contract.checkWhiteList(config.dodo1155, 2, account, proof2)
                    setDisabled2(false)
                } catch (error) {
                    console.log(error, proof2)
                }
            }
            fetch()
        }
        return () => {}
    }, [contract, account, proof2])

    const mainDom = (
        <div className="main">
            <div className="header">
                To celebrate the NBP initial launch on Gate, as well as IDO conducted by DODO. The project has prepared an incentive plan for our
                users:
            </div>
            <div className="item">
                <img src={require('./img/1.png')} alt="" />
                <div className="right">
                    <div className="title">NFTBomb X Gate UNIQUE Unusual_Ki</div>
                    <div className="text">
                        This UNIQUE Unusual_Ki NFT will never be issued again, and it is limited to 500 worldwide. Receiving conditions: hold more
                        than 10,000 NBP (Checking time: 10:00 (UTC) on 23rd of November, 2021)
                    </div>
                    <Button disabled={disabled} loading={loading} className="btn" onClick={() => Claim721()}>
                        Claim
                    </Button>
                </div>
            </div>
            <div className="item">
                <img src={require('./img/2.png')} alt="" />
                <div className="right">
                    <div className="title">NFTBomb X DODO UNIQUE Unusual_Ki</div>
                    <div className="text">
                        This UNIQUE Unusual_Ki NFT will never be issued again, and it is limited to 671 worldwide. Receiving conditions: DODO IDO
                        whitelist + holding more than 100 NBP. (Checking time: 10:00 (UTC) on 23rd of November, 2021)
                    </div>
                    <Button disabled={disabled2} loading={loading2} className="btn" onClick={() => Claim1155()}>
                        Claim
                    </Button>
                </div>
            </div>
        </div>
    )

    return (
        <Layout className={classnames('page-dodo')}>
            <div className="container">
                {success || success2 ? (
                    <div className="success">
                        <div className="img">
                            {success && <img src={require('./img/1.png')} alt="" />}
                            {success2 && <img src={require('./img/2.png')} alt="" />}
                        </div>
                        <div className="info">
                            <div className="tit">
                                <span>Congratulations!</span>
                            </div>
                            <div className="txt">Successfully claim Unusual_Ki</div>
                            <div
                                className="btn"
                                onClick={() => {
                                    setSuccess(false)
                                    setSuccess2(false)
                                }}
                            >
                                Complete
                            </div>
                        </div>
                    </div>
                ) : (
                    mainDom
                )}
            </div>
        </Layout>
    )
}
