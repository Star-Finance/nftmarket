import './detail.stylus'

import { useWeb3React } from '@web3-react/core'
import { Form, Input } from 'antd'
import classnames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'

import Layout from '@/app/components/Layout'
import { useThemeContext } from '@/theme'

export default (): React.ReactElement => {
    const { account } = useWeb3React()
    const history = useHistory()
    const c = useThemeContext()
    const { id } = useParams<{ id: string }>()
    return (
        <Layout className={classnames('page-myNftDetail')} isHide>
            <div className="container">
                <div className="content">
                    <div className="div-bg" />
                    <div className="main-content">
                        {/* <img className="mynft" src={require('./img/mynft.png')} alt="" /> */}
                        {id === '6' ? <img className="mynft" src={require('./img/SSSR.png')} alt="" /> : null}
                        {id === '5' ? <img className="mynft" src={require('./img/SSR.png')} alt="" /> : null}
                        {id === '4' ? <img className="mynft" src={require('./img/SR.png')} alt="" /> : null}
                        {id === '3' ? <img className="mynft" src={require('./img/R.png')} alt="" /> : null}
                        {id === '2' ? <img className="mynft" src={require('./img/N.png')} alt="" /> : null}
                        {id === '1' ? <img className="mynft" src={require('./img/mynft.png')} alt="" /> : null}
                        <div className="right">
                            {id === '1' ? <div className="rare_Ki">Rare_Ki</div> : null}
                            {id === '2' ? <div className="rare_Ki">Altcard</div> : null}
                            {id === '3' ? <div className="rare_Ki">Rare_Ki_04</div> : null}
                            {id === '4' ? <div className="rare_Ki">Rare_Ki_03</div> : null}
                            {id === '5' ? <div className="rare_Ki">Rare_Ki_02</div> : null}
                            {id === '6' ? <div className="rare_Ki">Rare_Ki_01</div> : null}
                            {id !== '2' ? (
                                <div>
                                    <div className="series">
                                        Rare_Ki series is the official limited NFT by NFTBomb. With this NFT, you will have the following rights:
                                    </div>
                                    <ul className="cont">
                                        <li>Get NFT airdrop</li>
                                        <li>Be able to purchase the limited blind box</li>
                                        <li>Be able to purchase limited official joint NFT</li>
                                        <li>Be able to get the priority to participate the BOOM agreement</li>
                                    </ul>

                                    <div className="interests">
                                        The rights and interests will gradually increase with the development of the project, while the final
                                        interpretation right belongs to NFTBomb.org
                                    </div>
                                </div>
                            ) : null}
                            {id === '2' ? <div className="altcard">Altcard doesn’t have any right</div> : null}
                            {/* <div className="address">Contract Address: {account}</div> */}
                            <div className="address">Contract Address:0x871AB9Ac616cBaB658bc3555d888bA4eda738843</div>
                            <div className="id">Token ID: {id}</div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
