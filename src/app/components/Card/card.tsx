import './card.stylus'

// import './remCard.stylus'
import classnames from 'classnames'
import React, { useState } from 'react'

import { getShortenAddress } from '@/app/utils/tool'

import Image from '../Image'

interface IProps {
    className?: string
    src: string
    username: string
    userAvatar?: string
    userAddress: string
    price: string
    likeNumber: number
    isLike: boolean
    time?: number
    type: string
    typeList: Array<number>
    isHideHeader?: boolean
}

export default (props: IProps): React.ReactElement | null => {
    return (
        <div className={classnames('cardBlock', props.className)}>
            <div className="cardHeader">
                {!props.isHideHeader ? (
                    <>
                        <div className="typeList">
                            {props.typeList.map(item => {
                                return <div className={classnames('typeItem', `typeItem${item}`)} key={item} />
                            })}
                        </div>
                        <div className={classnames('typeItem', `${props.type}`)} />
                    </>
                ) : null}
            </div>
            <Image className="cardImage" src={props.src} height={279} width={279} />
            <div className="cardContent">
                <div className="name">{props.username}</div>
                {props.userAvatar ? (
                    <div className="address">
                        <div className="userAvatar">
                            <img src={props.userAvatar} alt="" />
                        </div>
                        <div className="userAddress">{getShortenAddress(props.userAddress)}</div>
                    </div>
                ) : null}
                <div className="cardContentBottom">
                    <div className="price">
                        <span>{props.price}</span>
                    </div>
                    {props.time ? <div className="time">{props.time}</div> : null}
                </div>
                <div className={classnames('cordLike', { isLike: props.isLike })}>{props.likeNumber}</div>
            </div>
        </div>
    )
}
