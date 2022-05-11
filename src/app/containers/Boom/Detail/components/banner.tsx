import './banner.stylus'

import { DoubleRightOutlined } from '@ant-design/icons'
import React, { useState } from 'react'

import Modal from '@/app/components/Modal'

//  import { Modal } from 'antd'
// import { CSSTransition } from 'react-transition-group'
import Countdown from './Countdown'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps {}

export const format_number = (number: number): string => {
    const splitNum = Number(number).toLocaleString()
    return splitNum
}

export default (props: IProps): React.ReactElement => {
    const [showRule, setShowRule] = useState(false)
    return (
        <div className="banner">
            <div className="left">
                <div className="info">
                    <div className="title">第一期BOOM池奖励</div>
                    <div className="total">{format_number(10000000)}</div>
                    <div className="reward-level">
                        <div className="item">Grand prize：{format_number(5000000)} NBP</div>
                        <div className="item">Third prize：{format_number(1000)} NBP</div>
                        <div className="item">First prize：{format_number(100000)} NBP</div>
                        <div className="item">Fourth prize：{format_number(10)} NBP</div>
                        <div className="item">Second prize：{format_number(10000)} NBP</div>
                        <div className="item"> Prize：{format_number(100)} NBP</div>
                    </div>
                    <Countdown pTime={'2021/12/18 16:00:00'} endCallback={() => {}} />
                    <div
                        className="btn"
                        onClick={() => {
                            window.scrollTo(0, document.getElementById('myBoomHistory').offsetTop - document.documentElement.scrollTop - 150)
                            // document.getElementById('myBoomHistory')?.scrollIntoView()
                        }}
                    >
                        My boom History
                    </div>
                    <div
                        className="look-rule"
                        onClick={() => {
                            setShowRule(true)
                        }}
                    >
                        View rules of BOOM
                        <img src={require('../img/Arrow.png')} />
                        {/* <DoubleRightOutlined /> */}
                    </div>
                </div>
            </div>
            <div className="right">
                <div id="slides">
                    <div id="slide1" className="slide">
                        {/* <img className="img-fluid" src={require('@/app/containers/MyNFT/List/img/blindBox/10.png')} />
                        <img className="img-fluid" src={require('@/app/containers/MyNFT/List/img/blindBox/9.png')} />
                        <img className="img-fluid" src={require('@/app/containers/MyNFT/List/img/blindBox/8.png')} />
                        <img className="img-fluid" src={require('@/app/containers/MyNFT/List/img/blindBox/7.png')} />
                        <img className="img-fluid" src={require('@/app/containers/MyNFT/List/img/blindBox/6.png')} />

                        <img className="img-fluid" src={require('@/app/containers/MyNFT/List/img/blindBox/10.png')} />
                        <img className="img-fluid" src={require('@/app/containers/MyNFT/List/img/blindBox/9.png')} />
                        <img className="img-fluid" src={require('@/app/containers/MyNFT/List/img/blindBox/8.png')} />
                        <img className="img-fluid" src={require('@/app/containers/MyNFT/List/img/blindBox/7.png')} />
                        <img className="img-fluid" src={require('@/app/containers/MyNFT/List/img/blindBox/6.png')} /> */}
                        <div
                            className="img-fluid"
                            style={{ backgroundImage: `url(${require('@/app/containers/MyNFT/List/img/blindBox/10.png')})` }}
                        />
                        <div className="img-fluid" style={{ backgroundImage: `url(${require('@/app/containers/MyNFT/List/img/blindBox/9.png')})` }} />
                        <div className="img-fluid" style={{ backgroundImage: `url(${require('@/app/containers/MyNFT/List/img/blindBox/8.png')})` }} />
                        <div className="img-fluid" style={{ backgroundImage: `url(${require('@/app/containers/MyNFT/List/img/blindBox/7.png')})` }} />
                        <div className="img-fluid" style={{ backgroundImage: `url(${require('@/app/containers/MyNFT/List/img/blindBox/6.png')})` }} />

                        <div
                            className="img-fluid"
                            style={{ backgroundImage: `url(${require('@/app/containers/MyNFT/List/img/blindBox/10.png')})` }}
                        />
                        <div className="img-fluid" style={{ backgroundImage: `url(${require('@/app/containers/MyNFT/List/img/blindBox/9.png')})` }} />
                        <div className="img-fluid" style={{ backgroundImage: `url(${require('@/app/containers/MyNFT/List/img/blindBox/8.png')})` }} />
                        <div className="img-fluid" style={{ backgroundImage: `url(${require('@/app/containers/MyNFT/List/img/blindBox/7.png')})` }} />
                        <div className="img-fluid" style={{ backgroundImage: `url(${require('@/app/containers/MyNFT/List/img/blindBox/6.png')})` }} />
                    </div>
                    <div id="slide2" className="slide">
                        {/* <img className="img-fluid" src={require('@/app/containers/MyNFT/List/img/blindBox/5.png')} />
                        <img className="img-fluid" src={require('@/app/containers/MyNFT/List/img/blindBox/4.png')} />
                        <img className="img-fluid" src={require('@/app/containers/MyNFT/List/img/blindBox/3.png')} />
                        <img className="img-fluid" src={require('@/app/containers/MyNFT/List/img/blindBox/2.png')} />
                        <img className="img-fluid" src={require('@/app/containers/MyNFT/List/img/blindBox/1.png')} />

                        <img className="img-fluid" src={require('@/app/containers/MyNFT/List/img/blindBox/5.png')} />
                        <img className="img-fluid" src={require('@/app/containers/MyNFT/List/img/blindBox/4.png')} />
                        <img className="img-fluid" src={require('@/app/containers/MyNFT/List/img/blindBox/3.png')} />
                        <img className="img-fluid" src={require('@/app/containers/MyNFT/List/img/blindBox/2.png')} />
                        <img className="img-fluid" src={require('@/app/containers/MyNFT/List/img/blindBox/1.png')} /> */}
                        <div className="img-fluid" style={{ backgroundImage: `url(${require('@/app/containers/MyNFT/List/img/blindBox/5.png')})` }} />
                        <div className="img-fluid" style={{ backgroundImage: `url(${require('@/app/containers/MyNFT/List/img/blindBox/4.png')})` }} />
                        <div className="img-fluid" style={{ backgroundImage: `url(${require('@/app/containers/MyNFT/List/img/blindBox/3.png')})` }} />
                        <div className="img-fluid" style={{ backgroundImage: `url(${require('@/app/containers/MyNFT/List/img/blindBox/2.png')})` }} />
                        <div className="img-fluid" style={{ backgroundImage: `url(${require('@/app/containers/MyNFT/List/img/blindBox/1.png')})` }} />
                        <div className="img-fluid" style={{ backgroundImage: `url(${require('@/app/containers/MyNFT/List/img/blindBox/5.png')})` }} />
                        <div className="img-fluid" style={{ backgroundImage: `url(${require('@/app/containers/MyNFT/List/img/blindBox/4.png')})` }} />
                        <div className="img-fluid" style={{ backgroundImage: `url(${require('@/app/containers/MyNFT/List/img/blindBox/3.png')})` }} />
                        <div className="img-fluid" style={{ backgroundImage: `url(${require('@/app/containers/MyNFT/List/img/blindBox/2.png')})` }} />
                        <div className="img-fluid" style={{ backgroundImage: `url(${require('@/app/containers/MyNFT/List/img/blindBox/1.png')})` }} />
                    </div>
                    <div id="cover-anim-gradient-left" />
                    <div id="cover-anim-gradient-right" />
                </div>
            </div>

            <Modal
                transitionName=""
                visible={showRule}
                closeModal={() => setShowRule(false)}
                closable={false}
                width="10.6rem"
                getContainer={document.querySelector('.BoomDetail')}
            >
                <div className="modal-content-box modalRule">
                    <div className="modal-content">
                        <div className="modalTitle">BOOM rules</div>
                        <div className="modalMain">
                            <img src={require('../img/modal_rule.png')} />
                            {/* <div className="top">
                                The BOOM protocol is an open lottery protocol on chain. The BOOM prize pool is 10,000,000 NBP. All the users need to
                                hold platform equity NFT (Rare_Ki/Unusual_Ki) to participate. The way to participate is to use any two Modric series
                                NFTs to collide on the chain and win the award. The collision rule chain publicly guarantees fairness and justice.
                                Each collision will cost 10 NBP, and you will receive instant winning feedback. Among them, the special prize is
                                5,000,000 NBP, which will be randomly selected from all collided NFT combinations after the event ends! Each two NFT
                                combinations can only be collided for once. To collide again, you need to purchase additional NFTs in the market to
                                form a new combination. As the number of community collisions increases, the remaining collision opportunities
                                decrease, and the possibility of winning will increase exponentially. In the end, all users participating in the
                                collision will receive airdrop from the protocol fee prize pool. Also, the airdrop pool will be divided, according to
                                the weight of the number of collisions × the number of Modric NFTs. The more Modric NFTs on hold, the more collisions
                                and the more airdrop shares will be.
                            </div>
                            <div className="center">
                                <div className="name">Airdrop obtaining formula:</div>
                                <div className="value">
                                    NBP number = <img src={require('../img/formula.png')} />
                                </div>
                            </div>
                            <div className="bottom">
                                (Among them, is the number of NFTs you hold, is the total number of collisions you have; N is the total number of
                                addresses holding NFTs, and Q is the total number of NBP in the protocol fee prize pool)
                            </div> */}
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
