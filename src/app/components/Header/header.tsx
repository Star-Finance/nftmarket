import './header.stylus'
import './remHeader.stylus'

import { useWeb3React } from '@web3-react/core'
import { Drawer, Dropdown, Input, Menu, message, Popover } from 'antd'
import classnames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'

import { setComingSoonVisible } from '@/app/actions/baseAction'
import useIERC20 from '@/app/hooks/useIERC20'
import { userCreate, userInfo } from '@/app/service/nftServer'
import { env } from '@/app/utils/config'
import * as config from '@/app/utils/config'
import copy from '@/app/utils/copy'
import { getRandomNumber } from '@/app/utils/tool'
import Icon from '@/assets/icons'
import { useThemeContext } from '@/theme'

import { injected } from '../../connectors'
import { useEagerConnect, useInactiveListener } from '../../hooks/web3'
import storage from '../../utils/storage'
import { formatDecimal, getShortenAddress, pow10 } from '../../utils/tool'
import ErrorDialog, { IErrorDialog } from '../ErrorDialog'

interface IProps {
    isHide?: boolean
    nbp_balance?: string
}

export default (props: IProps): React.ReactElement | null => {
    const dispatch = useDispatch()
    const history = useHistory()
    const { pathname } = history.location
    const { changeTheme, currentThemeName } = useThemeContext()
    const [t, i18n] = useTranslation()
    const changLng = (l: string): void => {
        i18n.changeLanguage(l)
        history.replace(`?lng=${l}`)
    }
    const ErrorDialogRef = useRef<IErrorDialog>()
    const { account, activate, active, error, chainId, deactivate } = useWeb3React()
    const triedEager = useEagerConnect()
    const onConnectClick = async (): Promise<void> => {
        await activate(injected)
        storage.set('isLogout', '')
    }
    const [balance, setBalance] = useState<string>()
    const erc20 = useIERC20(config.nbp)
    const [visibleDrawer, setVisibleDrawer] = useState(false)

    useInactiveListener(!triedEager)

    useEffect(() => {
        if (!chainId || env === 'development') return
        if (chainId !== 56) {
            ErrorDialogRef.current?.show()
        }
        if (chainId === 56) {
            ErrorDialogRef.current?.hide()
        }
        return () => { }
    }, [chainId])

    useEffect(() => {
        if (!storage.get('isLogout')) {
            activate(injected)
        }
        return () => { }
    }, [])

    useEffect(() => {
        if (error) {
            console.log(error)
            // ErrorDialogRef.current?.show()
        }
        return () => { }
    }, [error])

    useEffect(() => {
        if (erc20 && !props.isHide && account) {
            const fetch = async (): Promise<void> => {
                try {
                    const balance = await erc20.balanceOf(account)
                    setBalance(pow10(balance.toString(), 18))
                } catch (err) {
                    console.log(err)
                }
            }
            fetch()
        }
        return () => { }
    }, [erc20, props.nbp_balance])

    useEffect(() => {
        const fetch = async (): Promise<void> => {
            if (!account) return
            const info = await userInfo({ address: account })
            if (info.data.data && !info.data.data.userInfo) {
                await userCreate({
                    address: account,
                    nick_name: `BoomUser${account.substring(account.length - 4, account.length)}`,
                    avatar: `https://nftbomb.org/metadata/nftbomb-market/avatars/${getRandomNumber()}.jpg`
                })
            }
        }
        fetch()
    }, [account])

    const userPopover = (
        <div className="userPopover">
            <div className="item" onClick={() => account && copy(account)}>
                <div className="txt">
                    <div>
                        <div className="mainTxt">{getShortenAddress(account)}</div>
                    </div>
                    <Icon name="copy" />
                </div>
            </div>
            <div className="item" onClick={() => history.push('/Profile')}>
                <div className="ico">
                    <Icon name="setting" />
                </div>
                <div className="txt">
                    <div>
                        <div className="mainTxt">Edit profile</div>
                    </div>
                </div>
            </div>
            <div
                className="item"
                onClick={() => {
                    deactivate()
                    storage.set('isLogout', true)
                }}
            >
                <div className="ico">
                    <Icon name="out" />
                </div>
                <div className="txt">
                    <div>
                        <div className="mainTxt">Sign out</div>
                    </div>
                </div>
            </div>
        </div>
    )

    const userDom = active ? (
        <Popover placement="bottomLeft" content={userPopover} overlayClassName={classnames('headerMenu userMenu')}>
            <div className="connect user">
                <span>{getShortenAddress(account)}</span>
            </div>
        </Popover>
    ) : (
        <div className="connect" onClick={onConnectClick}>
            <span>Connect wallet</span>
        </div>
    )

    const imDom = (
        <div className="im">
            <a href="https://twitter.com/NFTBomb" target="__blank">
                <Icon name="twitter" className="item" />
            </a>
            {/* <Icon name="reddit" className="item" /> */}
            <a href="https://nftbomb-97786.medium.com" target="__blank">
                <Icon name="medium" className="item" />
            </a>
            {/* <Icon name="discord" className="item" /> */}
            <a href="https://t.me/NFTBombEn" target="__blank">
                <Icon name="telegram" className="item" />
            </a>
        </div>
    )

    const menuPopover = (
        <div className="menuPopover">
            <div className="item" onClick={() => dispatch(setComingSoonVisible(true))}>
                <div className="ico">
                    <Icon name="navAuction" />
                </div>
                <div className="txt">
                    <div>
                        <div className="mainTxt">Auction Protocol</div>
                        <div className="subTxt">Auction of NFT assets</div>
                    </div>
                    <Icon name="arrowRight" />
                </div>
            </div>
            {/* <div className="item" onClick={() => history.push('/BoomList')}> */}
            <div className="item" onClick={() => dispatch(setComingSoonVisible(true))}>
                <div className="ico">
                    <Icon name="navBoom" />
                </div>
                <div className="txt">
                    <div>
                        <div className="mainTxt">BOOM Protocol</div>
                        <div className="subTxt">NFT Scratchers</div>
                    </div>
                    <Icon name="arrowRight" />
                </div>
            </div>
            <div className="item" onClick={() => dispatch(setComingSoonVisible(true))}>
                <div className="ico">
                    <Icon name="navOrigin" />
                </div>
                <div className="txt">
                    <div>
                        <div className="mainTxt">Origin Protocol</div>
                        <div className="subTxt">Funding Grants</div>
                    </div>
                    <Icon name="arrowRight" />
                </div>
            </div>
            <div className="item" onClick={() => dispatch(setComingSoonVisible(true))}>
                <div className="ico">
                    <Icon name="issue" />
                </div>
                <div className="txt">
                    <div>
                        <div className="mainTxt">Issue blind boxes</div>
                        <div className="subTxt">with issuance channels</div>
                    </div>
                    <Icon name="arrowRight" />
                </div>
            </div>
            <div className="item" onClick={() => dispatch(setComingSoonVisible(true))}>
                <div className="ico">
                    <Icon name="initiate" />
                </div>
                <div className="txt">
                    <div>
                        <div className="mainTxt">Initiate mining</div>
                        <div className="subTxt">Initiate mining pool</div>
                    </div>
                    <Icon name="arrowRight" />
                </div>
            </div>
        </div>
    )

    const menuDom = (
        <div className="menu">
            <Link className={classnames('item', { cur: /market/.test(pathname) })} to="/market">
                <span>Market</span>
            </Link>
            <div className={classnames('item defi', { cur: /defi/.test(pathname) })}>
                <Popover placement="bottomLeft" content={menuPopover} overlayClassName={classnames('headerMenu navMenu')}>
                    <span className="down" id="Popover">
                        DeFi <Icon name="navDown" />
                    </span>
                </Popover>
            </div>
            <div className="create" onClick={() => dispatch(setComingSoonVisible(true))}>
                <span>Create</span>
            </div>
        </div>
    )

    const langAndThemeDom = (
        <>
            <div className="language" />
            <div className="theme default" />
        </>
    )

    return !props.isHide ? (
        <>
            <header className={classnames('lt-top')}>
                <div className="main">
                    <div className="left">
                        {balance ? (
                            <>
                                <img src={require('./img/bnb.png')} alt="" />
                                <div className="balance">{formatDecimal(Number(balance), 2)} NBP</div>
                            </>
                        ) : null}
                        <div className="collection" onClick={() => history.push('/MyNFTList')}>
                            My Collection
                        </div>
                    </div>
                    <div className="right">
                        <a className="link" href="https://www.gate.ac/trade/NBP_USDT">
                            <img src={require('./img/gate.png')} alt="" />
                        </a>
                        {/* <a className="link" href="https://pancakeswap.finance/swap?outputCurrency=0x74c22834744e8d5e36c79420ff7b057964aba8a7">
                            <img src={require('./img/pancake.png')} alt="" />
                        </a> */}
                        <a className="link" href="https://app.dodoex.io/exchange/NBP-USDT?network=bsc-mainnet">
                            <img src={require('./img/dodo.png')} alt="" />
                        </a>
                        <div className="UserSwapToken" onClick={() => history.push('/UserSwapToken')}>
                            Token swaper
                        </div>
                        {userDom}
                        {imDom}
                    </div>
                </div>
            </header>
            <header className={classnames('lt-header', currentThemeName)}>
                <div className="main">
                    <div className="left">
                        <Link className="logo" to="/" />
                        <div className="search">
                            <Input placeholder="Search" />
                        </div>
                    </div>
                    <div className="right">
                        {menuDom}
                        {langAndThemeDom}
                    </div>
                    <div className="mobileMenu" onClick={() => setVisibleDrawer(true)}>
                        <Icon name="menu" />
                    </div>
                </div>
            </header>
            <Drawer placement="right" onClose={() => setVisibleDrawer(false)} visible={visibleDrawer} closable={false} width={200}>
                <div className="drawerMenu">
                    {balance ? (
                        <>
                            <div className="balanceBox">
                                <img src={require('./img/bnb.png')} alt="" />
                                <div className="balance">{balance}NBP</div>
                            </div>
                        </>
                    ) : null}
                    {menuDom}
                    {langAndThemeDom}
                    {imDom}
                    <div className="userBox">
                        {userDom}
                        <div className="collection" onClick={() => history.push('/MyNFTList')}>
                            MY Collection
                        </div>
                    </div>
                </div>
            </Drawer>
            <ErrorDialog ref={ErrorDialogRef} chainId={chainId} />
        </>
    ) : null
}
