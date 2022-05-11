import './header.stylus'

import { useWeb3React } from '@web3-react/core'
import { Popover } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import EN from '@/app/components/Header/img/language.png'
import ZH from '@/app/components/Header/img/ZH.png'
import LogoutDialog, { ILogoutDialog } from '@/app/components/LogoutDialog'
import { injected } from '@/app/connectors'
import useIERC20 from '@/app/hooks/useIERC20'
import * as config from '@/app/utils/config'
import storage from '@/app/utils/storage'
import { formatDecimal, getShortenAddress, pow10 } from '@/app/utils/tool'

export default (): React.ReactElement => {
    const { library, account, activate } = useWeb3React()
    const history = useHistory()
    const [t, i18n] = useTranslation()
    const changLng = (l: string): void => {
        i18n.changeLanguage(l)
        history.replace(`?lng=${l}`)
    }

    const [visiblePopover, setVisiblePopover] = useState(false)
    const [balance, setBalance] = useState<string>()
    const LogoutDialogRef = useRef<ILogoutDialog>()
    const erc20 = useIERC20(config.nbp)

    useEffect(() => {
        if (erc20) {
            const fetch = async (): Promise<void> => {
                const balance = await erc20.balanceOf(account)
                setBalance(pow10(balance.toString(), 18))
            }
            if (account) fetch()
        }
        return () => {}
    }, [erc20, account])

    const onConnectClick = async (): Promise<void> => {
        await activate(injected)
        storage.set('isLogout', '')
    }

    const langDownDom = (
        <div className="langDownDomMain">
            <div
                className="item"
                onClick={() => {
                    changLng('en_US')
                    setVisiblePopover(false)
                }}
            >
                <img src={EN} alt="" />
            </div>
            <div
                className="item"
                onClick={() => {
                    changLng('zh_CN')
                    setVisiblePopover(false)
                }}
            >
                <img src={ZH} alt="" />
            </div>
        </div>
    )
    return (
        <>
            <div className="component-header">
                <div className="headerMain">
                    <a
                        onClick={() => {
                            history.push('/invitationRewards')
                        }}
                        className="logo"
                    />
                    <div className="right">
                        {account ? (
                            <div className="div-account">
                                <div className="balance">
                                    <img src={require('@/app/components/Header/img/bnb.png')} />
                                    {formatDecimal(balance, 2)} NBP
                                </div>
                                <a onClick={() => LogoutDialogRef.current?.show()}>{getShortenAddress(account)}</a>
                            </div>
                        ) : (
                            <div className="div-header-btn" onClick={onConnectClick}>
                                <span>Connect</span>
                            </div>
                        )}

                        <Popover
                            visible={visiblePopover}
                            onVisibleChange={v => setVisiblePopover(v)}
                            content={langDownDom}
                            placement="top"
                            overlayClassName="langDown"
                            trigger="click"
                        >
                            <div className="langWrap">
                                {i18n.language == 'en_US' ? (
                                    <div className="lang">
                                        <img src={EN} alt="" />
                                    </div>
                                ) : (
                                    <div className="lang">
                                        <img src={ZH} alt="" />
                                    </div>
                                )}
                            </div>
                        </Popover>
                    </div>
                </div>
            </div>
            <LogoutDialog ref={LogoutDialogRef} />
        </>
    )
}
