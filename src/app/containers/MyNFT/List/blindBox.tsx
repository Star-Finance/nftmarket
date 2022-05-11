import './blindBox.stylus'

import { BigNumber } from '@ethersproject/bignumber'
import { useWeb3React } from '@web3-react/core'
import { Button, message } from 'antd'
import classNames from 'classnames'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { setComingSoonVisible } from '@/app/actions/baseAction'
import Modal from '@/app/components/Modal'
import useBlindBoxContract from '@/app/hooks/useBlindBoxContract'
import useCountDown from '@/app/hooks/useCountDown'
import useNft721RoleContract from '@/app/hooks/useNft721RoleContract'
import { useDodoContract } from '@/app/hooks/useNft721RoleDodoContract'
import useNft1155Contract from '@/app/hooks/useNft1155Contract'
import { toSmall } from '@/app/utils'
import * as config from '@/app/utils/config'
import nft1155ContractFn from '@/app/utils/nft1155Contract'
import Icon from '@/assets/icons'

import useActivityBoxInfo from './hooks/useActivityBoxInfo'

const nftData = [
    {
        name: 'TOP10',
        piece: 490,
        level: 'N',
        img: require('./img/blindBox/1.png')
    },
    {
        name: 'TOP9',
        piece: 470,
        level: 'N',
        img: require('./img/blindBox/2.png')
    },
    {
        name: 'TOP8',
        piece: 470,
        level: 'N',
        img: require('./img/blindBox/3.png')
    },
    {
        name: 'TOP7',
        piece: 150,
        level: 'R',
        img: require('./img/blindBox/4.png')
    },
    {
        name: 'TOP6',
        piece: 150,
        level: 'R',
        img: require('./img/blindBox/5.png')
    },
    {
        name: 'TOP5',
        piece: 150,
        level: 'R',
        img: require('./img/blindBox/6.png')
    },
    {
        name: 'TOP4',
        piece: 50,
        level: 'SR',
        img: require('./img/blindBox/7.png')
    },
    {
        name: 'TOP3',
        piece: 50,
        level: 'SR',
        img: require('./img/blindBox/8.png')
    },
    {
        name: 'TOP2',
        piece: 15,
        level: 'SSR',
        img: require('./img/blindBox/9.png')
    },
    {
        name: 'TOP1',
        piece: 5,
        level: 'SSSR',
        img: require('./img/blindBox/10.png')
    }
]

const getLevel = (n: number): number => {
    let level = 0
    for (let i = 0; i < nftData.length; i++) {
        level += nftData[i].piece
        if (level >= n) {
            return i
        }
    }
    return 0
}

export default (): React.ReactElement | null => {
    const dispatch = useDispatch()
    const { library, account } = useWeb3React()
    const [, info] = useActivityBoxInfo()
    const time = useCountDown(+dayjs(info?.end_time))
    const [open, setOpen] = useState(false)
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [obj, setObj] = useState<{ [key: string]: string }>({})
    const [list721, setList721] = useState<number[]>([])
    const [dodoAsset, setDodoAsset] = useState(0)
    const nft721RoleDodoContract = useDodoContract()
    const blindBoxContract = useBlindBoxContract()
    const nft1155Contract = useNft1155Contract()
    const [level, setLevel] = useState(0)
    const nft721RoleContract = useNft721RoleContract()
    const [left, setLeft] = useState(0)

    useEffect(() => {
        const fetch = async (): Promise<void> => {
            if (!nft1155Contract || !account) return
            const obj = {}
            let totalNum = 0
            for (let i = 1; i < 7; i++) {
                const res = await nft1155Contract.balanceOf(config.blindBoxContract, i)
                obj[`lv${i}`] = res
                totalNum += Number(res)
            }
            obj['totalNum'] = totalNum
            setObj(obj)
        }
        fetch()
    }, [nft1155Contract, account])

    useEffect(() => {
        const fetch = async (): Promise<void> => {
            if (!nft721RoleDodoContract || !account) return
            const res = await nft721RoleDodoContract.balanceOf(account)
            setDodoAsset(+res)
        }
        fetch()
    }, [nft721RoleDodoContract, account])

    useEffect(() => {
        const fetch = async (): Promise<void> => {
            if (!nft721RoleContract || !account) return

            const arr: number[] = []
            const balance: number = await nft721RoleContract.balanceOf(account)

            for (let i = 0; i < balance; i++) {
                const res = await nft721RoleContract.tokenOfOwnerByIndex(account, i)
                if (res > 1) {
                    arr.push(+res)
                }
            }
            setList721(arr)
        }
        fetch()
    }, [nft721RoleContract, account])

    const handleOpen = async (): Promise<void> => {
        if (!blindBoxContract || !account || !info) return
        if (
            Number(obj.lv1) !== 0 ||
            Number(obj.lv3) !== 0 ||
            Number(obj.lv4) !== 0 ||
            Number(obj.lv5) !== 0 ||
            Number(obj.lv6) !== 0 ||
            Number(obj.lv7) !== 0 ||
            list721.length ||
            dodoAsset
        ) {
            try {
                setLoading(true)
                const estimatedGasLimit = await blindBoxContract.estimateGas.buyBlindBoxNft721(28, config.nft721BallGameStar, {
                    value: library?.utils.toWei(toSmall(info.cost || 0), 'ether')
                })
                const buyBlineBox = await blindBoxContract.buyBlindBoxNft721(28, config.nft721BallGameStar, {
                    value: library?.utils.toWei(toSmall(info.cost || 0), 'ether'),
                    gasLimit: estimatedGasLimit.mul(BigNumber.from(15000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
                })
                try {
                    const res = await buyBlineBox.wait()
                    setLoading(false)
                    if (res.status === 1) {
                        res.events.forEach(e => {
                            if (e.event === 'BuyBlindBoxNft721') {
                                const tokenId721 = e.args.tokenId721.toString()
                                setLevel(getLevel(Number(tokenId721)))
                            }
                        })
                        setSuccess(true)
                        setOpen(false)
                    }
                } catch (error) {
                    setLoading(false)
                    message.success(`Error`)
                }
            } catch (error: any) {
                if (error?.data) {
                    message.error(error.data.message)
                }
                console.log(error)
                setLoading(false)
            }
        }
    }

    useEffect(() => {
        const fetch = async (): Promise<void> => {
            if (!account) return
            let totalNum = 0
            const c = await nft1155ContractFn(config.Messi1155, account)
            for (let i = 1; i < 11; i++) {
                const res = await c.balanceOf(config.blindBoxContract, i)
                totalNum += Number(res)
            }
            setLeft(totalNum)
        }
        fetch()
    }, [account])

    return (
        <div className="blindBox">
            {/* {success ? (
                <div className="blindBoxSuccess">
                    <div className="img">
                        <img src={require('./img/blindBox/1.png')} alt="" />
                    </div>
                    <div className="info">
                        <div className="title">Congratulations!</div>
                        <div className="text">Who get magic Modric, who get the whole world.</div>
                        <div className="cardName">Modrić_01</div>
                        <Button loading={loading} className="btn reOpen" onClick={() => handleOpen()}>
                            Re-open
                        </Button>
                        <div className="btn share" onClick={() => dispatch(setComingSoonVisible(true))}>
                            Share my NFT
                        </div>
                    </div>
                </div>
            ) : open ? (
                <div className="blindBoxOpen">
                    <img src={require('./img/gif.gif')} alt="" />
                    <Button loading={loading} className="btn" onClick={() => handleOpen()}>
                        Open
                    </Button>
                </div>
            ) : ( */}
            <div className="blindBoxWrap">
                <div className="header">
                    <div className="img">
                        <img src={require('./img/blindBox/blind.png')} alt="" />
                        <div className="count">{left} LEFT</div>
                    </div>
                    <div className="info">
                        <div className="title">Blind Box Draw</div>
                        <div className="time">
                            <div className="timeTitle">End Time</div>
                            <div className="timeInfo">
                                <div className="item">
                                    <div className="num">{time.days}</div>
                                    <div className="txt">Days</div>
                                </div>
                                <div className="item">
                                    <div className="num">{time.hours}</div>
                                    <div className="txt">Hours</div>
                                </div>
                                <div className="item">
                                    <div className="num">{time.minutes}</div>
                                    <div className="txt">Minutes</div>
                                </div>
                                <div className="item">
                                    <div className="num">{time.seconds}</div>
                                    <div className="txt">Seconds</div>
                                </div>
                            </div>
                        </div>
                        <div className="price">
                            <span className="num">{toSmall(info?.cost || 0)}</span>
                            <span className="unit">{info?.cost_unit}</span>
                        </div>
                        <div className="btn" onClick={() => setOpen(true)}>
                            OPEN
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="title">Modric Exclusive</div>
                    <div className="list">
                        {nftData.map((item, index) => (
                            <div className="item" key={index}>
                                <img src={item.img} alt="" />
                                <div className="info">
                                    <div className="name">{item.name}</div>
                                    <div className={classNames('number', item.level)}>
                                        {item.level} {item.piece} Piece
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* )} */}
            <Modal
                transitionName=""
                visible={open}
                closeModal={() => setOpen(false)}
                closable={false}
                width="100%"
                height="100%"
                getContainer={document.querySelector('.page-MyNFTList')}
            >
                <div className="modal-content-box open">
                    <div className="modal-content modal-content-lose">
                        <div className="blindBoxOpen">
                            <span className="close" onClick={() => setOpen(false)}>
                                <Icon name="close" />
                            </span>
                            <img src={require('./img/gif.gif')} alt="" />
                            <Button loading={loading} className="btn" onClick={() => handleOpen()}>
                                OPEN
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal
                transitionName=""
                visible={success}
                closeModal={() => setSuccess(false)}
                closable={false}
                width="100%"
                height="100%"
                getContainer={document.querySelector('.page-MyNFTList')}
            >
                <div className="modal-content-box success">
                    <div className="modal-content modal-content-lose">
                        <div className="blindBoxSuccess">
                            <span className="close" onClick={() => setSuccess(false)}>
                                <Icon name="close" />
                            </span>
                            <div className="img">
                                <video
                                    className="video"
                                    autoPlay
                                    playsInline
                                    muted
                                    loop
                                    preload="auto"
                                    src={`https://nftbomb.org/metadata/luka-bsc-testnet-video/${level + 1}.mp4`}
                                    style={{ width: '100%', height: '100%' }}
                                />
                            </div>
                            <div className="info">
                                <div className="title">Congratulations!</div>
                                <div className="text">Who get magic Modric, who get the whole world.</div>
                                <div className="cardName">{nftData[level].name}</div>
                                <Button
                                    loading={loading}
                                    className="btn reOpen"
                                    onClick={() => {
                                        setSuccess(false)
                                        setOpen(true)
                                        handleOpen()
                                    }}
                                >
                                    Re-open
                                </Button>
                                <div className="btn share" onClick={() => dispatch(setComingSoonVisible(true))}>
                                    Share my NFT
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
