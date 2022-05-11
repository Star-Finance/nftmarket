import './logoutDialog.stylus'

import { useWeb3React } from '@web3-react/core'
import { Modal } from 'antd'
import React, { forwardRef, useImperativeHandle, useState } from 'react'

import { NETWORK_PREFIX } from '@/app/connectors'

import copy from '../../utils/copy'
import storage from '../../utils/storage'
import { getShortenAddress } from '../../utils/tool'

export interface ILogoutDialog {
    show(): void
    hide(): void
}

const LongDialog = forwardRef((props, ref) => {
    const [LogoutDialogOpen, setLogoutDialogOpen] = useState(false)
    const { account, deactivate, chainId } = useWeb3React()

    useImperativeHandle(ref, () => ({
        show: () => {
            setLogoutDialogOpen(true)
        },
        hide: () => {
            setLogoutDialogOpen(false)
        }
    }))

    return account ? (
        <>
            <Modal
                visible={LogoutDialogOpen}
                onCancel={() => setLogoutDialogOpen(false)}
                footer={null}
                wrapClassName="logoutDialog"
                centered
                destroyOnClose={true}
                closable={false}
            >
                <div className="modalTitle">
                    <div className="title">Account</div>
                    <em onClick={() => setLogoutDialogOpen(false)}>x</em>
                </div>
                <div className="modalMain">
                    <div className="content">
                        <div className="account">
                            <div className="address">{getShortenAddress(account)}</div>
                            <div className="link">
                                <i onClick={() => copy(account)}>Copy Address</i>
                                <a
                                    target="_blank"
                                    href={`https://${!chainId || chainId === 56 ? '' : `${NETWORK_PREFIX[chainId]}.`}bscscan.com/address/${account}`}
                                    rel="noreferrer"
                                >
                                    View on Bscscan
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ModalBtn">
                    <div
                        className="btn"
                        onClick={() => {
                            deactivate()
                            storage.set('isLogout', true)
                            setLogoutDialogOpen(false)
                        }}
                    >
                        Disconnect
                    </div>
                </div>
            </Modal>
        </>
    ) : null
})

export default LongDialog
