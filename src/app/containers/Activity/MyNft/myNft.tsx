import './myNft.stylus'

import { useWeb3React } from '@web3-react/core'
import { Form, Input } from 'antd'
import classnames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

import Layout from '@/app/components/Layout'
import useNft1155Contract from '@/app/hooks/useNft1155Contract'
import { useThemeContext } from '@/theme'

export default (): React.ReactElement => {
    const { account } = useWeb3React()
    const history = useHistory()
    const c = useThemeContext()

    const nft1155Contract = useNft1155Contract()
    const [obj, setObj] = useState<{ [key: string]: string }>({})

    useEffect(() => {
        const fetch = async (): Promise<void> => {
            if (!nft1155Contract) return
            const obj = {}
            let totalNum = 0
            for (let i = 1; i < 7; i++) {
                const res = await nft1155Contract.balanceOf(account, i)
                obj[`lv${i}`] = res
                totalNum += Number(res)
                console.log(res)
            }
            setObj(obj)
        }
        fetch()
    }, [nft1155Contract])

    console.log(obj)

    const lv1detail = () => {}

    return (
        <Layout className={classnames('page-myNft')}>
            <div className="container">
                <div className="content">
                    <div className="series">NFTBomb series</div>
                    <div className="my">My assets</div>
                    <div className="nftList">
                        <div className="listMain">
                            {obj.lv1 && obj.lv1.toString() !== '0' ? (
                                <div className="listitem lv1" onClick={() => history.push(`/activity/mynft/detail/1`)}>
                                    <div className="img">
                                        <img className="img5" src={require('./img/nft1155.png')} alt="" />
                                        <div className="my-number">Number:{obj.lv1.toString()}</div>
                                    </div>
                                </div>
                            ) : null}
                            {obj.lv2 && obj.lv2.toString() !== '0' ? (
                                <div className="listitem lv2" onClick={() => history.push(`/activity/mynft/detail/2`)}>
                                    <div className="img">
                                        <img className="img5" src={require('./img/N.png')} alt="" />
                                        <div className="my-number">Number:{obj.lv2.toString()}</div>
                                    </div>
                                </div>
                            ) : null}
                            {obj.lv3 && obj.lv3.toString() !== '0' ? (
                                <div className="listitem lv3" onClick={() => history.push(`/activity/mynft/detail/3`)}>
                                    <div className="img">
                                        <img className="img4" src={require('./img/R.png')} alt="" />
                                        <div className="my-number">Number:{obj.lv3.toString()}</div>
                                    </div>
                                </div>
                            ) : null}
                            {obj.lv4 && obj.lv4.toString() !== '0' ? (
                                <div className="listitem lv4" onClick={() => history.push(`/activity/mynft/detail/4`)}>
                                    <div className="img">
                                        <img className="img3" src={require('./img/SR.png')} alt="" />
                                        <div className="my-number">Number:{obj.lv4.toString()}</div>
                                    </div>
                                </div>
                            ) : null}
                            {obj.lv5 && obj.lv5.toString() !== '0' ? (
                                <div className="listitem lv5" onClick={() => history.push(`/activity/mynft/detail/5`)}>
                                    <div className="img">
                                        <img className="img2" src={require('./img/SSR.png')} alt="" />
                                        <div className="my-number">Number:{obj.lv5.toString()}</div>
                                    </div>
                                </div>
                            ) : null}
                            {obj.lv6 && obj.lv6.toString() !== '0' ? (
                                <div className="listitem lv6" onClick={() => history.push(`/activity/mynft/detail/6`)}>
                                    <div className="img">
                                        <img className="img1" src={require('./img/SSSR.png')} alt="" />
                                        <div className="my-number">Number:{obj.lv6.toString()}</div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
