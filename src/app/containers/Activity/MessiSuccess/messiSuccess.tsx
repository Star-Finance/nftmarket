import './messiSuccess.stylus'

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
        <Layout className={classnames('page-messiSuccess')}>
            <div className="container">
                <div v-show="!visibie" className="content">
                    <img className="mynft" src={require('./img/messisuccess.png')} alt="" />
                    <div className="tulations">Congratulations!</div>
                    <div className="claim">Successfully claim rare NFT</div>
                    <div>
                        <div className="btn" onClick={() => history.push('/blingbox/2')}>
                            Open again
                        </div>
                        <div className="share" onClick={() => message.success('This function is not available')}>
                            Share NFT
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
