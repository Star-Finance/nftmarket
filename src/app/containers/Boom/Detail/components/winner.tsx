import './winner.stylus'

import classnames from 'classnames'
import React, { useEffect, useState } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import ShortAddress from '@/app/components/ShortAddress'
import { GetWinnerList } from '@/app/service/boomDetailServer'

import { grades } from '../index'
import { grandItem } from '../index'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps {
    progress: number
    grandBoom: grandItem
}

export const format_number = (number: number): string => {
    const splitNum = Number(number).toLocaleString()
    return splitNum
}

interface winnerItem {
    fromImg: any
    fromId: number
    toImg: any
    toId: number
    grade: number
    address: string
    boom_id: number
    create_time: string
}

let renderWinnersTimer = 0
const addWinnerItemTimer = 0
const _tokenIdToImgMap = {}

export default (props: IProps): React.ReactElement => {
    const { progress, grandBoom } = props
    const [reqWinners, setReqWinners] = useState<winnerItem[]>([])
    const [realReqWinners, setRealReqWinners] = useState<winnerItem[]>([])

    const [renderWinners, setRenderWinners] = useState<winnerItem[]>([])

    const [winnderIndex, setWinnderIndex] = useState(8)
    const [leftWinnerItem, setleftWinnerItem] = useState(null)
    const [loading, setLoading] = useState(null)

    const fetchWinners = async (): Promise<void> => {
        // setLoading(true)
        GetWinnerList({
            offset: 0,
            limit: 1000
        }).then(res => {
            if (res.data.code == 0) {
                let list = res.data.data.list.map(item => {
                    const [fromId, toId] = item.box_id.split(',')
                    if (!_tokenIdToImgMap[fromId]) {
                        _tokenIdToImgMap[fromId] = item.first_img.match(/\d+/)
                    }
                    if (!_tokenIdToImgMap[toId]) {
                        _tokenIdToImgMap[toId] = item.second_img.match(/\d+/)
                    }
                    return {
                        boom_id: Number(item.boom_id),
                        fromImg: item.first_img,
                        fromId,
                        toImg: item.second_img,
                        toId,
                        grade: item.prize,
                        address: item.address,
                        create_time: item.create_time
                    }
                })
                list.forEach(item => {
                    item.create_time = new Date(item.create_time).getTime()
                })

                // if(reqWinners.length==0){
                //     // list.length=10
                //     list=list.slice(1)
                // }

                //  if(new Date()>new Date('2021/12/5 00:52:30')&&new Date()<new Date('2021/12/5 00:52:36')&&reqWinners.length<12){
                //      console.log('111111111111')

                //     list=(JSON.parse(JSON.stringify(list.slice(0,1))).map((item,index)=>{
                //         item.create_time=new Date().getTime()+(index+1)*1000
                //         item.boom_id=item.boom_id+100
                //         item.fromId=1111
                //         return item;
                //     })).concat(reqWinners)
                //  }

                // console.log('winnderIndex22222222222222',winnderIndex,'reqWinners',reqWinners)
                //  console.log('list.concat1111111111',JSON.parse(JSON.stringify(list)),'realReqWinners.length',realReqWinners.length,'reqWinners.length',reqWinners.length)

                if (list.length) {
                    const maxPrize = list.sort(function (a, b) {
                        const value1 = Number(a.grade),
                            value2 = Number(b.grade)
                        // //奖等级相同
                        // if (value1 === value2) {
                        //     // 按降序排序
                        //     return new Date(b.create_time) - new Date(a.create_time)
                        // }
                        // 奖等级不同，降序排序
                        return value2 - value1
                    })[0]
                    // console.log('maxPrize', maxPrize, 'winnderIndex', winnderIndex)
                    // console.log('realReqWinners.length11111111',realReqWinners.length,' list.length', list.length)

                    if (reqWinners.length < 11) {
                        setRealReqWinners(list)

                        setleftWinnerItem(maxPrize)

                        if (list.length > 7 && list.length < 11) {
                            // list=list.sort(function (a, b) {
                            //     return b.create_time - a.create_time
                            // })
                            //这里之所以这么多注释，是因为都是模拟数据不同范围内数据追加导致的
                            list = list.concat(
                                JSON.parse(JSON.stringify(list.slice(0, 11 - list.length))).map((item, index) => {
                                    item.create_time = new Date().getTime() + index * 2000
                                    item.boom_id = item.boom_id + 10000
                                    return item
                                })
                            )

                            setRenderWinners(list.length > 7 ? JSON.parse(JSON.stringify(list)).slice(0, 8) : list)
                            // console.log('list3333333333333',JSON.parse(JSON.stringify(list)));

                            list = list
                                .slice(0, 8)
                                .sort(function (a, b) {
                                    return a.create_time - b.create_time
                                })
                                .concat(list.slice(8, list.length))
                        } else {
                            setRenderWinners(list.length > 7 ? JSON.parse(JSON.stringify(list)).slice(0, 8) : list)
                        }

                        setReqWinners(list)
                    } else if (list.length > 10 && list.length != realReqWinners.length) {
                        console.log(
                            'realReqWinners.length22222222',
                            realReqWinners.length,
                            ' list.length',
                            list.length,
                            list.length - realReqWinners.length
                        )

                        //winnderIndex % 15 == 0&&winnderIndex!=0
                        //reqWinners.length != list.length ||
                        // console.log('winnderIndex % 10', winnderIndex, winnderIndex % 9, 'reqWinners.length', reqWinners.length)
                        // console.log('list.length',list.length,reqWinners.length,(list.length+2)!=reqWinners.length,(list.length>8&&list.length<11))

                        setleftWinnerItem(maxPrize)
                        // clearTimeout(addWinnerItemTimer)
                        // addWinnerItemTimer = setTimeout(() => {
                        // list = list.sort(function (a, b) {
                        //     return new Date(a.create_time) - new Date(b.create_time)
                        // })s
                        // reqWinners.unshift(...list.slice(reqWinners.length))
                        if (list.length == 11) {
                            const _reqWinners = reqWinners.filter(item => {
                                return item.boom_id < 10000
                            })
                            list = list.slice(0, list.length - _reqWinners.length).concat(_reqWinners)
                            console.log('list666666666666', list.length)
                        } else {
                            list = JSON.parse(JSON.stringify(list.slice(0, list.length - realReqWinners.length))).concat(reqWinners)
                        }

                        setRealReqWinners(list)

                        setReqWinners(list)
                        // reqWinners.unshift(...list.slice(0,list.length-reqWinners.length))
                        setWinnderIndex(0)
                        // }, 900)

                        // console.log('winnderIndex222222222splice',winnderIndex)
                        // reqWinners.splice(winnderIndex+1, 0, {
                        //     boom_id: Math.random(),
                        //     fromImg: require('../img/right_item_2.png'),
                        //     fromId: 8372,
                        //     toImg: require('../img/right_item_4.png'),
                        //     toId: 0,
                        //     grade: 1,
                        //     address: '0erd...asdw'
                        // })
                        //  setReqWinners(list)
                    }
                }
            }
            // setLoading(false)

            // console.log('res', res)
        })
    }

    useEffect(() => {
        if (!reqWinners.length) {
            fetchWinners()
        } else if (!loading) {
            fetchWinners()
        }

        // const winners: Array<winnerItem> = []
        // for (let i = 0; i < 8; i++) {
        //     winners.push({
        //         fromImg: require('../img/right_item_2.png'),
        //         fromId: 8372 + i,
        //         toImg: require('../img/right_item_4.png'),
        //         toId: 0,
        //         grade: i % 5,
        //         address: '0erd...asdw'
        //     })
        // }

        // setRenderWinners(winners.length > 7 ? winners.slice(0, 6) : winners)
        // setReqWinners(winners)
    }, [])

    useEffect(() => {
        clearTimeout(renderWinnersTimer)
        // console.log('reqWinners.length', reqWinners.length)
        renderWinnersTimer = setTimeout(() => {
            if (reqWinners.length > 7) {
                const winnderItem = reqWinners[winnderIndex % reqWinners.length]
                // console.log('winnderItemIndex', winnderIndex % reqWinners.length,'winnderIndex',winnderIndex)
                // winnderItem.fromId = 8372 + winnderIndex

                // console.log('renderWinners',JSON.parse(JSON.stringify(renderWinners)),winnderItem.boom_id,winnderIndex,winnderIndex % reqWinners.length)

                if (!winnderItem) {
                    return
                }

                // if (renderWinners.length < 7) {
                //     renderWinners.unshift(winnderItem)
                // } else {
                renderWinners.pop()
                renderWinners.unshift(winnderItem)
                // if (renderWinners.length > 7) renderWinners.length = 7
                //}
                //  console.log('winnderIndex', winnderIndex)
                // setRenderWinners(renderWinners)
                // renderWinners.push(reqWinners[winnderIndex])
            }
            if (winnderIndex % 6 == 0 && progress == 1) {
                fetchWinners()
            }
            setWinnderIndex(winnderIndex + 1)
        }, 1000)

        return () => {
            clearTimeout(addWinnerItemTimer)
            clearTimeout(renderWinnersTimer)
        }
    }, [winnderIndex, reqWinners.length])

    const getRow = item => {
        return (
            <div className="row" key={item.boom_id}>
                <div className="td combin">
                    <div className="nft">
                        <div className={classnames('nft-img', 'bg-cover', `nft-img-${_tokenIdToImgMap[item.fromId]}`)} />
                        <span>#{item.fromId}</span>
                    </div>
                    <div className="nft">
                        <div className={classnames('nft-img', 'bg-cover', `nft-img-${_tokenIdToImgMap[item.toId]}`)} />
                        <span>#{item.toId}</span>
                    </div>
                </div>
                <div className={classnames('td', 'grade', 'prize' + item.grade)}>{grades[item.grade]}</div>
                <div className="td address">
                    <ShortAddress address={item.address} />
                </div>
            </div>
        )
    }

    // console.log('reqWinners', reqWinners)
    // const child1 = useMemo(() => {
    //     console.log('reqWinners11111111', reqWinners)
    //     return reqWinners.length > 7 ? (
    //         <div className="table-body">
    //             <TransitionGroup className="TransitionGroup">
    //                 {renderWinners.map((item, index) => {
    //                     return (
    //                         <CSSTransition
    //                             timeout={1000}
    //                             classNames="slide"
    //                             unmountOnExit
    //                             appear={true}
    //                             key={item?.fromId + Math.random()}
    //                             onEntered={e => {}}
    //                         >
    //                             {/* <div className={classnames('row','animated',{'fadeInDownOp':index==0,'fadeInDown':index!=0})} key={item.fromId}> */}
    //                             {getRow(item)}
    //                         </CSSTransition>
    //                     )
    //                 })}
    //             </TransitionGroup>
    //             <div className="top-shadow shadow" />
    //             <div className="bottom-shadow shadow" />
    //         </div>
    //     ) : (
    //         <div className="table-body">
    //             {renderWinners.map((item, index) => {
    //                 return getRow(item)
    //             })}
    //         </div>
    //     )
    // }, [winnderIndex])
    if (!reqWinners.length) {
        return null
    }

    return (
        <div className="winner">
            <div className="left">
                {grandBoom.address ? (
                    <div className="info">
                        <div className="title">Grand</div>
                        <div className="combination">
                            <div className="item one">
                                <div className="div-img bg-cover" style={{ backgroundImage: `url(${grandBoom?.first_img})` }} />
                                <div className="num">#{grandBoom?.first_token_id}</div>
                            </div>
                            <div className="item two">
                                <div className="div-img bg-cover" style={{ backgroundImage: `url(${grandBoom?.second_img})` }} />
                                <div className="num">#{grandBoom?.second_token_id}</div>
                            </div>
                        </div>
                        <div className="lucky-user">
                            <div className="title">Lucky user:</div>
                            <div className="address">
                                <ShortAddress name={grandBoom.address} address={grandBoom.address} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="info">
                        <div className="title">{grades[leftWinnerItem.grade]}</div>
                        <div className="combination">
                            <div className="item one">
                                <div className="div-img bg-cover" style={{ backgroundImage: `url(${leftWinnerItem?.fromImg})` }} />
                                <div className="num">#{leftWinnerItem?.fromId}</div>
                            </div>
                            <div className="item two">
                                <div className="div-img bg-cover" style={{ backgroundImage: `url(${leftWinnerItem?.toImg})` }} />
                                <div className="num">#{leftWinnerItem?.toId}</div>
                            </div>
                        </div>
                        <div className="lucky-user">
                            <div className="title">Lucky user:</div>
                            <div className="address">
                                {' '}
                                {leftWinnerItem?.address && <ShortAddress name={leftWinnerItem?.address} address={leftWinnerItem?.address} />}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="right">
                <div className="title">Winner list</div>
                <div className="table">
                    <div className="table-head">
                        <div className="td combin">Combination</div>
                        <div className="td grade">Grade</div>
                        <div className="td address">Address</div>
                    </div>
                    {reqWinners.length > 7 ? (
                        <div className="table-body">
                            <TransitionGroup className="TransitionGroup">
                                {renderWinners.map((item, index) => {
                                    return (
                                        <CSSTransition
                                            timeout={1000}
                                            classNames="slide"
                                            unmountOnExit
                                            appear={true}
                                            // key={item?.fromId + Math.random()}
                                            key={item?.boom_id}
                                            onEntered={e => {}}
                                        >
                                            {/* <div className={classnames('row','animated',{'fadeInDownOp':index==0,'fadeInDown':index!=0})} key={item.fromId}> */}
                                            {getRow(item)}
                                        </CSSTransition>
                                    )
                                })}
                            </TransitionGroup>
                            <div className="top-shadow shadow" />
                            <div className="bottom-shadow shadow" />
                        </div>
                    ) : (
                        <div className="table-body">
                            {renderWinners.map((item, index) => {
                                return getRow(item)
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
