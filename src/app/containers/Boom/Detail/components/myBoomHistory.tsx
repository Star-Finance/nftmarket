import './boom.stylus'
import './myBoomHistory.stylus'

import classnames from 'classnames'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import { GetUserBoomHistory } from '@/app/service/boomDetailServer'

import { grandItem } from '../index'
import { winItem } from './boom'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps {
    account: string
    progress: number
    grandBoom: grandItem
    onOpenWinModal(type: number, wItem?: winItem): void
}

interface boomItem {
    first_img: any
    first_token_id: number
    second_img: any
    second_token_id: number
    prize: number
    state: string
}

const status = ['Open', 'Pending', 'End']
const grades = ['', '1st Prize', '2nd Prize', '3rd Prize', '4th Prize', 'Grand']
// let boomLen=0
let _account
export default forwardRef((props: IProps, ref) => {
    const { account, onOpenWinModal, progress, grandBoom } = props
    const [booms, setBooms] = useState<boomItem[]>([])

    const fetchBoomsTimer: any = 0
    // boomLen=booms.length
    // console.log('boomLen000000000',boomLen)
    _account = account
    const fetchBooms = async (boomLen: number): Promise<void> => {
        if (fetchBoomsTimer != 0) clearTimeout(fetchBoomsTimer)
        const res = await GetUserBoomHistory({
            offset: 0,
            limit: 1000,
            address: _account
        })
        if (res.data.code == 0) {
            const { list } = res.data.data
            // console.log('list.length',list.length,boomLen)
            if (list.length != boomLen) {
                list.sort(function (a, b) {
                    const value1 = Number(a.prize),
                        value2 = Number(b.prize)
                    //奖等级相同
                    if (value1 === value2) {
                        // 按时间降序排序
                        return new Date(b.create_time) - new Date(a.create_time)
                    }
                    // 奖等级不同，降序排序
                    return value2 - value1
                })
                const _booms: Array<boomItem> = list.map(item => {
                    const token_ids = item.box_id.split(',')
                    return {
                        first_img: item.first_img,
                        first_token_id: token_ids[0],
                        second_img: item.second_img,
                        second_token_id: token_ids[1],
                        prize: Number(item.prize),
                        state: status[item.status]
                    }
                })
                setBooms(_booms)
            }
            setTimeout(() => {
                fetchBooms(list.length)
            }, 6000)
        }

        // console.log('GetUserBoomHistory res', res)
    }

    // console.log(111111111111)

    useEffect(() => {
        if (account && booms.length == 0) {
            fetchBooms(0)
        }
        // const _booms: Array<boomItem> = []
        // for (let i = 0; i < 15; i++) {
        //     _booms.push({
        //         fromImg: require(`../img/boom_1.png`),
        //         fromId:8372,
        //         toImg: require(`../img/boom_2.png`),
        //         toId: 9865,
        //         grade:i,
        //         state:'Pending'
        //     })
        // }
        // _booms[8].state='End'
        // _booms[13].state='End'
        // setBooms(_booms)

        return () => {
            if (fetchBoomsTimer != 0) clearTimeout(fetchBoomsTimer)
        }
    }, [account])

    useImperativeHandle(ref, () => ({
        fetchBooms: () => {
            if (account) fetchBooms(0)
        }
    }))

    return (
        <div className="boom-box" id="myBoomHistory">
            <div className="title">My BOOM History</div>
            <div className="combination-box">
                {grandBoom.address && grandBoom.address == account && (
                    <div
                        className="item-box"
                        onClick={() => {
                            onOpenWinModal(2)
                        }}
                    >
                        <div className="item prize6">
                            <div className="i-left">
                                <div className="nft">
                                    <div className="nft-img bg-cover" style={{ backgroundImage: `url(${grandBoom.first_img})` }} />
                                    <span>#{grandBoom.first_token_id}</span>
                                </div>
                                <div className="nft">
                                    <div className="nft-img bg-cover" style={{ backgroundImage: `url(${grandBoom.second_img})` }} />
                                    <span>#{grandBoom.second_token_id}</span>
                                </div>
                            </div>
                            <div className="i-right">Grand</div>
                        </div>
                    </div>
                )}
                {booms.map((item, index) => {
                    return (
                        <div
                            className="item-box"
                            key={index}
                            onClick={() => {
                                if (item.prize != 0) {
                                    onOpenWinModal(1, item)
                                }
                            }}
                        >
                            <div className={classnames('item', 'prize' + item.prize, { End: progress >= 3 && item.prize == 0 })}>
                                <div className="i-left">
                                    <div className="nft">
                                        <div className="nft-img bg-cover" style={{ backgroundImage: `url(${item.first_img})` }} />
                                        <span>#{item.first_token_id}</span>
                                    </div>
                                    <div className="nft">
                                        <div className="nft-img bg-cover" style={{ backgroundImage: `url(${item.second_img})` }} />
                                        <span>#{item.second_token_id}</span>
                                    </div>
                                </div>
                                <div className="i-right">{item.prize > 0 ? grades[item.prize] : progress != 3 ? item.state : 'End'}</div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
})
