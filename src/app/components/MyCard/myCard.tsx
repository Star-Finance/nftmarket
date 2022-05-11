import './myCard.stylus'

import { useWeb3React } from '@web3-react/core'
// import './remMyCard.stylus'
import { message, Popover } from 'antd'
import classnames from 'classnames'
import copy from 'copy-to-clipboard'
import { getQueryStringByName } from 'mobile-browser'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import Image from '@/app/components/Image'
import Icon from '@/assets/icons'

interface IProps {
    className?: string
    src: string
    assetAddress?: string
    tokenId?: number
    type?: 'auction' | 'change'
    price?: number
    unit?: string
    total: number
    number: number
    owned?: string
    name: string
    jump?: string
    assetType: string
    isHideHeader?: boolean
}

export default (props: IProps): React.ReactElement | null => {
    const history = useHistory()
    const address = getQueryStringByName('address') || null
    const { account } = useWeb3React()

    const copyText = (text: string): void => {
        message.destroy()
        if (copy(text)) {
            message.success(`Copy Success`)
        } else {
            message.error(`Copy Error`)
        }
    }

    const cardDownDom = (
        <div className="cardDownDomMain">
            {props.assetAddress && props.tokenId && (
                <div
                    className="item"
                    onClick={e => {
                        e.stopPropagation()
                        history.push(`/MyNFTShell/${props.assetAddress}/${props.tokenId}/${props.assetType}`)
                    }}
                >
                    <Icon name="sale" />
                    <span>Sell</span>
                </div>
            )}
            <div className="item" onClick={() => copyText(`${window.location.host}/#${props.jump}`)}>
                <Icon name="link" />
                <span>Copy link</span>
            </div>
        </div>
    )

    return (
        <div className={classnames('myCardBlock', props.className)}>
            <div className="cardHeader">
                {!props.isHideHeader ? (
                    <>
                        {props.type ? <Icon name={props.type} /> : <span />}
                        <div className="right">
                            {props.total !== 1 ? <div className="owned">X{props.number}</div> : null}
                            {!address || address === account ? (
                                <Popover content={cardDownDom} placement="bottomRight" overlayClassName="cardDownDom" trigger="click">
                                    <div className="more">
                                        <Icon name="more" />
                                    </div>
                                </Popover>
                            ) : null}
                        </div>
                    </>
                ) : null}
            </div>
            {/mp4/gi.test(props.src) ? (
                <video className="cardImage" playsInline muted loop preload="auto" src={props.src} style={{ width: 279, height: 279 }} />
            ) : (
                <Image className="cardImage" src={props.src} height={272} width={272} onClick={() => props.jump && history.push(props.jump)} />
            )}

            <div className="cardContent">
                <div className="left">
                    <div className="userLtd">NFTBomb Kirare</div>
                    <div className="username">{props.name}</div>
                    <div className="num">
                        [ {props.number} of {props.total} ]
                    </div>
                </div>
                {/* <div className="right">
                    <div className="priceTitle">Current Bid</div>
                    <div className="priceNumber">
                        <span>{props.price}</span>
                        <i>{props.unit}</i>
                    </div>
                </div> */}
            </div>
        </div>
    )
}
