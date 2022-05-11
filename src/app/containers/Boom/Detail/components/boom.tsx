import './boom.stylus'

import { Button, message } from 'antd'
import classnames from 'classnames'
import * as ethers from 'ethers'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import Modal from '@/app/components/Modal'
import useBoomContract from '@/app/hooks/useBoomContract'
import useDebounceFn from '@/app/hooks/useDebounceFn'
import useIERC20 from '@/app/hooks/useIERC20'
import useNft721BallGameStar from '@/app/hooks/useNft721BallGameStar'
import { useDodoContract, useGateContract } from '@/app/hooks/useNft721RoleDodoContract'
import useNft1155Contract from '@/app/hooks/useNft1155Contract'
import { GetBoomsByCreate, GetBoomsListStatus, GetNFTInfos, GetRecommend } from '@/app/service/boomDetailServer'
import * as config from '@/app/utils/config'
// import { Spin } from 'antd'
// const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
// import { LoadingOutlined } from '@ant-design/icons';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps {
    onPlayComplete(): void
    onOpenWinModal(type: number, wItem?: winItem): void
    account: string
    progress: number
}

export interface winItem {
    prize: number
    first_token_id: number
    second_token_id: number
    first_img: string
    second_img: string
}

interface boomItem {
    first_img: string
    first_token_id: number
    second_img: string
    second_token_id: number
    state: string
}

interface possibleBoom {
    box_id: string
    status: number
}

interface nftItem {
    asset_id?: number
    attachment: string | any
    author_address?: string
    category_id?: string
    content?: string
    contract?: string
    create_time?: string
    current_price?: string
    name?: string
    owner?: string
    supply_num?: number
    token_id: number
    unit?: string
    isBoom?: boolean
}

const status = ['Done', 'Boom', 'Available']

const _allNFTS: Array<nftItem> = []
for (let i = 1; i <= 5; i++) {
    _allNFTS.push({
        attachment: require(`@/app/containers/MyNFT/List/img/blindBox/${i}.png`),
        token_id: 8000 + i
    })
}
const _tokenIdToImgMap = {}
export default forwardRef((props: IProps, ref) => {
    const { account, onPlayComplete, onOpenWinModal, progress } = props
    const history = useHistory()
    const nft1155Contract = useNft1155Contract()

    const [showRecommend, setShowRecommend] = useState(false)
    const [booms, setBooms] = useState<boomItem[]>([])
    const [possibleBooms, setPossibleBooms] = useState<possibleBoom[]>([])

    const [recommendNFTS, setRecommendNFTS] = useState<nftItem[]>([])
    const [allNFTS, setAllNFTS] = useState<nftItem[]>([])
    const [wins, setWins] = useState<winItem[]>([])
    const [curWin, setCurWin] = useState(null)

    const [showCheckAllNFTS, setShowCheckAllNFTS] = useState(false)
    const [showTrxFail, setShowTrxFail] = useState(false)

    const [recommendLoading, setRecommendLoading] = useState(false)
    const [isAddRecommendNFTS, setIsAddRecommendNFTS] = useState(false)
    const [isApprove, setApprove] = useState(false)

    const [approveLoading, setApproveLoading] = useState(false)
    const [playLoading, setPlayLoading] = useState(false)
    const [showOpenLoading, setShowOpenLoading] = useState(false)

    const [boomCost, setBoomCost] = useState(0)
    const [whiteCardTokenId, setWhiteCardTokenId] = useState('')
    const [recommendTip, setRecommendTip] = useState('')

    const resetRecommend = () => {
        setShowRecommend(false)
        setBooms([])
        setPossibleBooms([])
        setRecommendNFTS([])
        setAllNFTS([])
        setShowCheckAllNFTS(false)
        setBoomCost(0)
    }

    const nbpErc20 = useIERC20(config.nbp)

    const fetchIsApprove = async (): Promise<void> => {
        if (nbpErc20) {
            let is_allowance = await nbpErc20.allowance(account, config.boomContract)
            is_allowance = Number(is_allowance.toString())
            setApprove(!!is_allowance)
        }
    }
    const submitApprove = async (): Promise<void> => {
        setApproveLoading(true)
        try {
            const approve_res = await nbpErc20.approve(config.boomContract, ethers.constants.MaxUint256)
            await approve_res.wait()
            setApprove(true)
        } catch (error) {
            message.error(error.data?.message || error.message)
        }
        setApproveLoading(false)
    }
    useEffect(() => {
        setWhiteCardTokenId('')
        onOpenWinModal(-1)
        resetRecommend()
        // setShowWinType(-1)
        if (nbpErc20) {
            fetchIsApprove()
        }
    }, [account, nbpErc20])

    const dodoContract = useDodoContract()
    const gateContract = useGateContract()

    const getCards = async (): Promise<number | string> => {
        if (!(account && nft1155Contract && dodoContract && gateContract)) {
            return ''
        }
        for (let i = 1; i < 8; i++) {
            let res_nft1155: number = await nft1155Contract.balanceOf(account, i)
            res_nft1155 = +res_nft1155
            // console.log('res_nft1155', res_nft1155)
            if (res_nft1155 > 0 && i != 2) {
                // console.log('WhiteCardTokenId', i, res_nft1155)
                setWhiteCardTokenId(i + '')
                return i
            }
        }
        const dodo_balance = await dodoContract.balanceOf(account)
        console.log('dodo_balance', +dodo_balance)
        if (dodo_balance > 0) {
            const dodo_token_id = await dodoContract.tokenOfOwnerByIndex(account, 0)
            setWhiteCardTokenId(+dodo_token_id)
            return dodo_token_id
        }
        const gate_balance = await gateContract.balanceOf(account)
        if (gate_balance > 0) {
            const gate_token_id = await gateContract.tokenOfOwnerByIndex(account, 0)
            console.log('gate_token_id', +gate_token_id)
            setWhiteCardTokenId(+gate_token_id)
            return gate_token_id
        }
        return ''
        // console.log('dodo_balance', +dodo_balance, +datebalance)
    }

    const fetchBooms = async (isChangeBoomsStatus: boolean): Promise<void> => {
        if (isChangeBoomsStatus) {
            booms.forEach(item => {
                item.state = status[1]
            })
            // console.log('booms', booms)
            return
        }
        // if (!allNFTS.length) return
        const token_ids = recommendNFTS.map(item => item.token_id).sort((a, b) => a - b)

        setRecommendLoading(true)
        if (token_ids.length > 1) {
            const booms_res = await GetBoomsByCreate({ boomids: token_ids.join(',') })
            // console.log('booms_res', booms_res)
            if (booms_res.data.code == 0) {
                const { boxList } = booms_res.data.data
                boxList.forEach(item => {
                    item.state = status[item.status]
                    item.first_token_id = Number(item.first_token_id)
                    item.second_token_id = Number(item.second_token_id)
                })
                setBooms(boxList)
                // console.log('booms', booms, 'boxList', boxList, 'recommendNFTS', recommendNFTS)
            }
        } else {
            setBooms([])
        }

        // setRecommendLoading(false)
        setShowRecommend(true)

        getRecommendAndSelNFTSPossibleBooms()
    }

    const setBoomsUseDebounce = useDebounceFn(
        () => {
            fetchBooms(false)
        },
        500,
        false
    )

    useEffect(() => {
        if (showRecommend) {
            let _cost = 0
            booms.forEach(item => {
                if (item.state == 'Available') _cost += 10
            })
            setBoomCost(_cost)
        }
        if (booms.length) {
            recommendNFTS.forEach(item => {
                item.isBoom = getIsBoom(item.token_id, true)
            })
            if (!isAddRecommendNFTS && recommendNFTS.every(item => item.isBoom)) {
                setPlayLoading(true)
                setTimeout(() => {
                    setAllNFTS(allNFTS.concat(recommendNFTS))
                    setRecommendNFTS([])
                    setPlayLoading(false)
                }, 1000)
            }
        }
    }, [booms, showRecommend])

    const nft721BallGameStar = useNft721BallGameStar()

    useEffect(() => {
        if (recommendNFTS.length) setBoomsUseDebounce()
    }, [recommendNFTS])

    const openRecommendTip = (text: string): void => {
        setRecommendTip(text)
        setTimeout(() => {
            setRecommendTip('')
        }, 1000)
        setRecommendLoading(false)
    }
    const fetchNFTS = async (): Promise<void> => {
        if (!nft721BallGameStar || !account) return

        setRecommendLoading(true)

        if (!(await getCards())) {
            openRecommendTip('Platform equity card required.')
            return
        }

        setRecommendLoading(true)

        const arr: IList[] = []
        const balance = await nft721BallGameStar.balanceOf(account)
        // console.log('balance', balance)
        let token_ids: number[] = []
        for (let i = 0; i < balance; i++) {
            const token_id = await nft721BallGameStar.tokenOfOwnerByIndex(account, i)
            // console.log('token_id', +token_id)
            if (token_id > 1) {
                token_ids.push(+token_id)

                // arr.push({
                //     tokenID: +res,
                //     info: nftInfo.data.data.assetInfo,
                //     ownerCount: 1,
                //     count: 1
                // })
            }
        }
        if (!token_ids.length) {
            openRecommendTip('Requires Modric Series NFT')
            return
        }
        if (token_ids.length < 2) {
            openRecommendTip('No suitable NFT to participate in BOOM')
            return
        }
        token_ids = token_ids.sort((a, b) => a - b)
        const token_ids_str = token_ids.join(',')
        const recommend_res = await GetRecommend({ boomids: token_ids_str })
        let _token_ids = []
        if (recommend_res.data.code == 0) {
            _token_ids = recommend_res.data.data.token_ids.map(item => Number(item)).sort((a, b) => a - b)
            if (!_token_ids.length) {
                openRecommendTip('No suitable NFT to participate in BOOM')
                return
            }
            if (_token_ids.length > 10) {
                _token_ids = _token_ids.slice(0, 10)
            }
        }
        console.log('token_ids_str', token_ids_str, token_ids)
        //console.log('recommend_res', recommend_res)
        const nftInfos_res: any = await GetNFTInfos({ token_ids: token_ids_str, contract: config.nft721BallGameStar })
        console.log('nftInfos_res', nftInfos_res)
        if (nftInfos_res.data.code == 0) {
            const { assetInfos } = nftInfos_res.data.data
            console.log('assetInfos', assetInfos)
            if (!assetInfos.length) {
                message.error('AssetInfos not found')
                setRecommendLoading(false)
                return
            }
            assetInfos.forEach(item => {
                item.token_id = Number(item.token_id)
                _tokenIdToImgMap[item.token_id] = item.attachment
            })
            // const assetInfos = token_ids.map(item => {
            //     return {
            //         token_id: item,
            //         attachment: require(`../img/boom_1.png`)
            //     }
            // })
            // console.log('assetInfos', assetInfos, '_token_ids', _token_ids)
            setRecommendNFTS(assetInfos.filter(item => _token_ids.find(tid => tid == item.token_id)))

            setAllNFTS(assetInfos.filter(item => _token_ids.every(tid => tid != item.token_id)))

            // setAllNFTS(assetInfos)
        }

        // console.log('nftInfos', nftInfos)
    }

    useImperativeHandle(ref, () => ({
        hideCheckNFTS: () => {
            setShowCheckAllNFTS(false)
        },
        getCards: () => {
            return getCards()
        },
        openWin
    }))

    const getIsBoom = (id: number, isRecommend: boolean): boolean => {
        if (!recommendNFTS.length) {
            return false
        }
        if (!isRecommend && recommendNFTS.find(item => item.token_id == id)) {
            return true
        }
        return recommendNFTS.every(item => {
            if (id == item.token_id) return true
            return !!(isRecommend
                ? booms.find(boom => {
                      return (
                          ((boom.first_token_id == id && boom.second_token_id == item.token_id) ||
                              (boom.first_token_id == item.token_id && boom.second_token_id == id)) &&
                          boom.state != 'Available'
                      )
                  })
                : possibleBooms.find(
                      boom => (boom.box_id == `${id},${item.token_id}` || boom.box_id == `${item.token_id},${id}`) && boom.status != 2
                  ))
            // console.log('isBoom', isBoom, id)
        })
    }

    const BoomContract = useBoomContract()

    const play = async (): Promise<void> => {
        // openPrize(['', [15, 16], [4, 4]])
        setShowCheckAllNFTS(false)
        const _fir: number[] = []
        const __sec: number[] = []
        console.log('booms', booms)
        booms.forEach(item => {
            if (item.state == 'Available') {
                if (item.first_token_id > item.second_token_id) {
                    _fir.push(item.second_token_id)
                    __sec.push(item.first_token_id)
                } else {
                    _fir.push(item.first_token_id)
                    __sec.push(item.second_token_id)
                }
            }
        })
        if (!_fir.length) {
            return
        }
        try {
            setPlayLoading(true)
            // setShowOpenLoading(true)

            // let is_allowance = await nbpErc20.allowance(account, config.boomContract)
            // console.log('is_allowance', is_allowance, is_allowance.toString(), !!is_allowance.toString(), !Number(is_allowance.toString()))
            // is_allowance = Number(is_allowance.toString())
            // if (!is_allowance) {
            //     const approve_res = await nbpErc20.approve(config.boomContract, ethers.constants.MaxUint256)
            //     await approve_res.wait()
            // }
            const BoomContractRes = await BoomContract.attach(config.boomContract)
            console.log('whiteCardTokenId', whiteCardTokenId, _fir, __sec)
            // console.log(`library.utils.toWei(fromAmount, 'ether')`, library.utils.toWei(fromAmount, 'ether'))
            const boomPlayRes = await BoomContractRes.play(whiteCardTokenId, _fir, __sec)
            setShowOpenLoading(true)

            const res = await boomPlayRes.wait()
            console.log('boomPlayRes res', res)
            if (res.status == 1) {
                res.events.forEach(e => {
                    if (e.event === 'BoomEvent') {
                        openPrize(e.args)
                        // setShowWinType(e.args[2])
                        // if(e.args[2]==0){
                        // }else{
                        // }
                    }
                })
                // fetchBooms(true)
                setTimeout(() => {
                    onPlayComplete && onPlayComplete()
                }, 1000)
            } else {
                setShowTrxFail(true)
            }

            setPlayLoading(false)
            setShowOpenLoading(false)
        } catch (error) {
            setPlayLoading(false)
            message.error(error.data?.message || error.message)
            console.log(error)

            setShowOpenLoading(false)
            // setTimeout(() => {
            //     setShowOpenLoading(false)
            //     setPlayLoading(false)
            //     openPrize(['', [15, 16], [4, 4]])
            // }, 6000)
        }
    }

    //处理play返回的是否中奖数据
    const openPrize = async (args: any): Promise<void> => {
        // onOpenWinModal(-1)

        // args[1].forEach(item => {
        //     console.log('boom_id', +item)
        // })
        const wins: winItem[] = []

        let prize = 0
        let boom_id = 0
        for (let i = 0; i < args[2].length; i++) {
            prize = args[2][i]
            if (prize != 0) {
                //本来这里play如果返回提交的booms中奖索引就不用那么麻烦，但鉴于之前给合约后端提需求，合约后端有抵触情绪，不敢再提，就这样做呗。
                boom_id = args[1][i]
                const _start = new Date()
                const boomInfo = await BoomContract.boomInfo(boom_id)
                console.log('cost time', new Date() - _start)
                let [first_token_id, second_token_id] = boomInfo.boxId.split(',')
                first_token_id = first_token_id.replace(/\u0000/g, '')
                second_token_id = second_token_id.replace(/\u0000/g, '')

                wins.push({
                    prize,
                    first_token_id,
                    second_token_id, // booms.find(item=>) +args[1][index]
                    first_img: _tokenIdToImgMap[first_token_id],
                    second_img: _tokenIdToImgMap[second_token_id]
                })
            }
        }

        console.log('wins', wins)

        if (wins.length) {
            // setWins(wins)
            openWin(wins)
        } else {
            onOpenWinModal(0)
            resetRecommend()
            // setShowWinType(0)
        }
    }

    //中奖的后的弹窗
    const openWin = ($wins?: winItem[]): void => {
        // console.log('$wins', $wins,'wins',wins)
        onOpenWinModal(-1)
        const _wins = JSON.parse(JSON.stringify($wins || wins))

        if (_wins.length) {
            setTimeout(() => {
                onOpenWinModal(1, _wins.shift())
                if (_wins.length) {
                    // setTimeout(() => {
                    //     onOpenWinModal(-1)
                    //     setTimeout(() => {
                    //         setWins(_wins)
                    //     }, 300)
                    // }, 1000)
                } else {
                    // setWins(_wins)
                    resetRecommend()
                }
                setWins(_wins)
            }, 300)
        }
    }
    // useEffect(() => {
    //     let _wins = JSON.parse(JSON.stringify(wins))
    //     if (_wins.length) {
    //         console.log('_wins', _wins)
    //         onOpenWinModal(1, _wins.shift())
    //         if (_wins.length) {
    //             setTimeout(() => {
    //                 onOpenWinModal(-1)
    //                 setTimeout(() => {
    //                     setWins(_wins)
    //                 }, 300)
    //             }, 1000)
    //         } else {
    //             setWins(_wins)
    //             resetRecommend()
    //         }
    //     }
    //     return () => {
    //         _wins = null
    //     }
    // }, [wins.length])

    const openAllNFTS = (): void => {
        if (playLoading) return
        setShowCheckAllNFTS(!showCheckAllNFTS)
    }

    const getRecommendAndSelNFTSPossibleBooms = async (): Promise<void> => {
        const recommend_token_ids = recommendNFTS.map(item => item.token_id)
        const other_token_ids = allNFTS
            .filter(item => !recommend_token_ids.find(r_t_id => item.token_id == r_t_id))
            .map(item => item.token_id)
            .sort((a, b) => {
                return a - b
            })
        if (other_token_ids.length) {
            const res = await GetBoomsListStatus({ boomids: recommend_token_ids.join(','), mainids: other_token_ids.join(',') })
            // console.log('res', res)
            if (res.data.code == 0) {
                const { boxList } = res.data.data
                setPossibleBooms(boxList)
            }
        }
        setRecommendLoading(false)
    }

    const getRecommendNFTS = () => {
        if (showRecommend) {
            return (
                <TransitionGroup className="nfts">
                    {recommendNFTS.map((item, index) => {
                        return (
                            <CSSTransition timeout={500} classNames="fade-scale" unmountOnExit appear={true} key={item.token_id} onEntered={e => {}}>
                                <div
                                    className={classnames('nft', 'bg-cover', { isBoom: item.isBoom })}
                                    onClick={e => {
                                        e.stopPropagation()
                                        if (playLoading) return
                                        if (showCheckAllNFTS) {
                                            // e.stopPropagation()
                                            //if (recommendNFTS.length > 1)
                                            setIsAddRecommendNFTS(false)
                                            setRecommendNFTS(
                                                recommendNFTS.filter(ritem => {
                                                    if (ritem.token_id != item.token_id) {
                                                        return true
                                                    } else {
                                                        setAllNFTS(allNFTS.concat([item]))
                                                    }
                                                })
                                            )
                                        } else {
                                            setShowCheckAllNFTS(true)
                                        }
                                    }}
                                    style={{ backgroundImage: `url(${item.attachment})` }}
                                >
                                    {/* {item.token_id} */}
                                </div>
                            </CSSTransition>
                        )
                    })}
                </TransitionGroup>
            )
        } else {
            return (
                <div className="nfts">
                    {_allNFTS.map((item, index) => {
                        return <div className="nft bg-cover" key={item.token_id} style={{ backgroundImage: `url(${item.attachment})` }} />
                    })}
                </div>
            )
        }
    }
    if (!isApprove && progress == 1) {
        return (
            <div className="boom-box">
                <div className="approve  bg-cover">
                    <div className="title">Participate in BOOM</div>
                    <div className="desc">Each combination will cost 10NBP to participate in BOOM</div>
                    <Button className="btn" type="primary" size="large" loading={approveLoading} onClick={submitApprove}>
                        Approve
                    </Button>
                </div>
            </div>
        )
    }
    return (
        // <Spin tip="Loading..." indicator={antIcon} spinning={recommendLoading && showRecommend}>
        <div className="boom-box">
            <div className="boom">
                <div
                    className={classnames('left', { showCheckAllNFTS: showCheckAllNFTS })}
                    style={{ overflow: showRecommend ? 'visible' : 'hidden' }}
                    onClick={openAllNFTS}
                >
                    {getRecommendNFTS()}
                    <CSSTransition in={showCheckAllNFTS} timeout={500} classNames="fade" unmountOnExit>
                        <TransitionGroup
                            className="my-all-nfts"
                            onClick={e => {
                                e.stopPropagation()
                            }}
                        >
                            {allNFTS.map(item => {
                                return (
                                    <CSSTransition
                                        timeout={500}
                                        classNames="fade-scale"
                                        unmountOnExit
                                        appear={true}
                                        key={item.token_id}
                                        onEntered={e => {}}
                                    >
                                        <div
                                            className={classnames('nft', 'bg-cover', { isBoom: getIsBoom(item.token_id, false) })}
                                            style={{ backgroundImage: `url(${item.attachment})` }}
                                            onClick={e => {
                                                e.stopPropagation()
                                                //&& !getIsBoom(item.token_id, false)
                                                if (playLoading) return
                                                if (!recommendNFTS.length || !recommendNFTS.find(rItem => rItem.token_id == item.token_id)) {
                                                    setIsAddRecommendNFTS(true)
                                                    setRecommendNFTS(recommendNFTS.concat([item]))
                                                    setAllNFTS(allNFTS.filter(aitem => aitem.token_id != item.token_id))
                                                }
                                            }}
                                        >
                                            {/* {item.token_id} */}
                                        </div>
                                    </CSSTransition>
                                )
                            })}
                        </TransitionGroup>
                    </CSSTransition>
                    <CSSTransition in={!showRecommend} timeout={500} classNames="fade-scale" unmountOnExit>
                        <div
                            className="mask"
                            onClick={e => {
                                e.stopPropagation()
                            }}
                        >
                            <Button
                                className="btn"
                                type="primary"
                                size="large"
                                disabled={progress != 1}
                                loading={recommendLoading}
                                onClick={e => {
                                    e.stopPropagation()
                                    fetchNFTS()
                                }}
                            >
                                Recommended combination
                            </Button>
                            {/* <div className="btn">Recommended combination</div> */}
                        </div>
                    </CSSTransition>
                </div>
                <div className={classnames('right', { twoRow: recommendNFTS.length > 5 })}>
                    <div className="top">
                        <div className="title">Participate in BOOM</div>
                        <div className="intro1">Each combination will cost 10NBP to participate in BOOM</div>
                    </div>
                    <div className="bottom">
                        {boomCost ? (
                            <div className="intro2">
                                {recommendNFTS.length}NFT can participate in {Math.round(boomCost / 10)} combinations
                            </div>
                        ) : null}

                        {/* <CSSTransition timeout={500} classNames="fade-scale" unmountOnExit appear={true} key={item.token_id} onEntered={e => {}}> */}

                        <CSSTransition in={!!recommendTip} timeout={300} classNames="fade" appear={true} unmountOnExit>
                            <div className="intro2">{recommendTip}</div>
                        </CSSTransition>

                        <div className="div-btns">
                            <Button
                                className="btn"
                                type="primary"
                                size="large"
                                disabled={boomCost < 1}
                                loading={playLoading || recommendLoading}
                                onClick={e => {
                                    e.stopPropagation()
                                    play()
                                }}
                            >
                                {boomCost} NBP BOOM
                            </Button>
                            <div
                                className="btn"
                                onClick={() => {
                                    history.push(`/market?contract=${config.nft721BallGameStar}&address=${account}`)
                                }}
                            >
                                <span>Market</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CSSTransition in={showRecommend} timeout={500} classNames="fade-scale" unmountOnExit>
                <div className="combination-box">
                    {booms.map((item, index) => {
                        return (
                            <div className={classnames('item-box', item.state)} key={index}>
                                <div className="item">
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
                                    <div className="i-right">{item.state}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CSSTransition>
            <Modal
                transitionName=""
                visible={showTrxFail}
                closeModal={() => setShowTrxFail(false)}
                closable={false}
                width="2.44rem"
                getContainer={document.querySelector('.BoomDetail')}
            >
                <div className="modal-content-box TrxFail">
                    <div className="modal-content">
                        <div
                            className="modalTitle"
                            onClick={() => {
                                setShowTrxFail(false)
                            }}
                        >
                            <img src={require('../img/caozuoshibai.png')} />
                        </div>
                        <div className="modalMain">Transaction failed</div>
                    </div>
                </div>
            </Modal>
            <Modal
                transitionName=""
                visible={showOpenLoading}
                closeModal={() => setShowOpenLoading(false)}
                closable={false}
                width="12rem"
                maskClosable={false}
                getContainer={document.querySelector('.BoomDetail')}
            >
                <div className="modal-content-box OpenLoading">
                    <div className="modal-content">
                        <img src="https://qc-shop-1258490024.file.myqcloud.com/images/open_loading1.gif" />
                    </div>
                </div>
            </Modal>
            <img className="img-open-loading" src="https://qc-shop-1258490024.file.myqcloud.com/images/open_loading1.gif" />
        </div>
        // </Spin>
    )
})
