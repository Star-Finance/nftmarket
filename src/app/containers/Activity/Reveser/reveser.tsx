import './reveser.stylus'

import { useWeb3React } from '@web3-react/core'
import { Button, Form, Input, message } from 'antd'
import classnames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'

import Layout from '@/app/components/Layout'
import useBlindBoxContract from '@/app/hooks/useBlindBoxContract'
import { useThemeContext } from '@/theme'

export default (): React.ReactElement => {
    const { library, account } = useWeb3React()
    const history = useHistory()
    const c = useThemeContext()

    const [show, setShow] = useState(false)
    const [received, setReceived] = useState(false)
    const { successId } = useParams<{ successId: string }>()
    const blindBoxContract = useBlindBoxContract()
    const [loading, setLoading] = useState(false)

    // const handleClaimPrize = async (): Promise<void> => {
    //     setLoading(true)
    //     if (blindBoxContract && account) {
    //         //   const estimate = blindBoxContract.estimateGas.claimPrize;
    //         try {
    //             const response = await blindBoxContract.claimPrize(2, {
    //                 gasLimit: 2000000
    //             })
    //             try {
    //                 const res = await response.wait()
    //                 if (res.status === 1) {
    //                     setLoading(false)
    //                     setReceived(true)
    //                     message.success('Rewards received successfully')
    //                 }
    //             } catch (error) {
    //                 message.error('Error')
    //             }
    //         } catch (error) {
    //             setLoading(false)
    //             console.log(error)
    //         }
    //     }
    // }

    return (
        <Layout className={classnames('page-reveser')} isHide>
            <div className="container">
                <div className="content">
                    {/* <img className="mynft" src="successImg" alt="" /> */}
                    {successId === '6' ? <img src={require('./img/SSSR.png')} alt="" /> : null}
                    {successId === '5' ? <img src={require('./img/SSR.png')} alt="" /> : null}
                    {successId === '4' ? <img src={require('./img/SR.png')} alt="" /> : null}
                    {successId === '3' ? <img src={require('./img/R.png')} alt="" /> : null}
                    {successId === '2' ? <img src={require('./img/N.png')} alt="" /> : null}
                    <div className="right">
                        <div className="tulations">Congratulations!</div>

                        <div>
                            <div className="claim">Successfully claim Rare_Ki NFT</div>
                            {successId !== '2' ? <div className="lottery">Rare_Ki NFT can participate in the Star series NFT Blind Box</div> : null}
                        </div>
                        <div>
                            <div className="max">
                                <img className="img" src={require('./img/suprise.png')} alt="" />
                                {successId === '6' ? <div className="suprise">Surprise：10 BNB</div> : null}
                                {successId === '5' ? <div className="suprise">Surprise：1000 NBP</div> : null}
                                {successId === '4' ? <div className="suprise">Surprise：100 NBP</div> : null}
                                {successId === '3' ? <div className="suprise">Surprise：10 NBP</div> : null}
                                {successId === '2' ? <div className="suprise">Surprise：10 NBP</div> : null}
                            </div>
                            {/* <div className="sharenft">coming soon</div> */}
                            <div className="goon" onClick={() => history.push('/blingbox')}>
                                Open again
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
