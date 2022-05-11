import './list.stylus'

import { useWeb3React } from '@web3-react/core'
import { message } from 'antd'
import classnames from 'classnames'
import copy from 'copy-to-clipboard'
import { getQueryStringByName } from 'mobile-browser'
import React, { useEffect, useState } from 'react'

import Go2Top from '@/app/components/Go2Top'
import Layout from '@/app/components/Layout'
import { IUserInfoResponseUser, userInfo } from '@/app/service/nftServer'
import { getShortenAddress } from '@/app/utils/tool'
import Icon from '@/assets/icons'
import { useThemeContext } from '@/theme'

import BlindBox from './blindBox'
import Collected from './collected'
import Sell from './sell'

export default (): React.ReactElement => {
    const { account } = useWeb3React()
    const { currentThemeName } = useThemeContext()
    // const [tab, setTab] = useState('BlindBox')
    const [tab, setTab] = useState('Collected')
    const [info, setInfo] = useState<IUserInfoResponseUser>()
    const address = getQueryStringByName('address') || null

    const copyText = (text: string | undefined | null): void => {
        if (!text) return
        message.destroy()
        if (copy(text)) {
            message.success(`Copy Success`)
        } else {
            message.error(`Copy Error`)
        }
    }

    useEffect(() => {
        const fetch = async (): Promise<void> => {
            if (!account) return
            const info = await userInfo({ address: address || account })
            if (info.data.data) {
                setInfo(info.data.data.userInfo)
            }
        }
        fetch()
    }, [account, address])

    return (
        <Layout className={classnames('page-MyNFTList', currentThemeName)}>
            <div className="content">
                <div className="banner">
                    <div
                        className="bannerBg"
                        style={{ backgroundImage: `url(${info && info.banner ? info.banner : require('./img/banner.png')})` }}
                    />
                    <div className="bannerMain">
                        <div className="user">
                            <div className="userAvatar" style={{ backgroundImage: `url(${info ? info?.avatar : require('./img/user.png')})` }}>
                                <Icon name="collect" />
                            </div>
                            <div className="userInfo">
                                <div className="username">{info ? info?.nick_name : 'Ponygirl'}</div>
                                <div className="userAddress" onClick={() => copyText(account)}>
                                    <Icon name="address" />
                                    <span>{getShortenAddress(account)}</span>
                                    <Icon name="copy" />
                                </div>
                                <div
                                    className="userDesc"
                                    dangerouslySetInnerHTML={{
                                        __html: info ? info?.description : ''
                                    }}
                                />
                            </div>
                        </div>
                        <div className="nav">
                            {/* {!address || address === account ? (
                                <div className={classnames('item', { cur: tab === 'BlindBox' })} onClick={() => setTab('BlindBox')}>
                                    Blind box
                                </div>
                            ) : null} */}
                            {/* <div className={classnames('item', { cur: tab === 'Created' })}>Created</div> */}
                            <div className={classnames('item', { cur: tab === 'Collected' })} onClick={() => setTab('Collected')}>
                                Collected
                            </div>
                            {!address || address === account ? (
                                <div className={classnames('item', { cur: tab === 'Sell' })} onClick={() => setTab('Sell')}>
                                    On sell
                                </div>
                            ) : null}
                            {/* <div className={classnames('item', { cur: tab === 'Participated' })}>Participated</div>
                            <div className={classnames('item', { cur: tab === 'Trading' })}>Trading</div> */}
                        </div>
                    </div>
                </div>
                <div className="box">
                    {tab === 'BlindBox' ? <BlindBox /> : null}
                    {tab === 'Collected' ? <Collected /> : null}
                    {tab === 'Sell' ? <Sell /> : null}
                </div>
            </div>
            <Go2Top />
        </Layout>
    )
}
