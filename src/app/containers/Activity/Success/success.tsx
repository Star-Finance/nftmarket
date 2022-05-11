import './success.stylus'

import { useWeb3React } from '@web3-react/core'
import { Form, Input, message } from 'antd'
import classnames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

import Layout from '@/app/components/Layout'
import { useThemeContext } from '@/theme'

export default (): React.ReactElement => {
    const { library, account } = useWeb3React()
    const history = useHistory()
    const c = useThemeContext()

    return (
        <Layout className={classnames('page-success')}>
            <div className="container">
                <div className="content">
                    <img className="mynft" src={require('./img/mynft.png')} alt="" />
                    <div className="tulations">Congratulations!</div>
                    <div className="claim">Successfully claim Rare_Ki NFT</div>
                    <div className="lottery">Rare_Ki NFT can participate in the Messi NFT Blind Box</div>
                    <div>
                        <div className="btn" onClick={() => history.push('/blingbox/2')}>
                            Messi NFT
                        </div>
                        <div className="share">Coming Soon</div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
