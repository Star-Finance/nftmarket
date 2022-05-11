import './layout.stylus'

import { Modal } from 'antd'
import classnames from 'classnames'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { setComingSoonVisible } from '@/app/actions/baseAction'
import useTimeout from '@/app/hooks/useTimeout'
import { IRootState } from '@/app/reducers/RootState'
import { useThemeContext } from '@/theme'

import Footer from '../Footer'
import Header from '../Header'

interface IProps {
    className?: string
    children: React.ReactNode
    isHide?: boolean
    isShowFooter?: boolean
    balance?: string | number
}

export default (props: IProps): React.ReactElement => {
    const { className, balance } = props
    const { currentThemeName } = useThemeContext()
    const history = useHistory()
    const dispatch = useDispatch()
    const { comingSoonVisible } = useSelector((state: IRootState) => state.base)

    useEffect(() => {
        document.body.scrollTop = 0
        window.scrollTo(0, 0)
    }, [history])

    useEffect(() => {
        if (comingSoonVisible) {
            const timer = setTimeout(() => dispatch(setComingSoonVisible(false)), 2000)
            return () => clearTimeout(timer)
        }
        return undefined
    }, [comingSoonVisible])

    return (
        <div className={classnames('lt-layout', currentThemeName, className)}>
            <div className="lt-content">
                <Header isHide={props.isHide} nbp_balance={balance} />
                {props.children}
                {props.isShowFooter ? <Footer /> : null}
            </div>
            <Modal
                visible={comingSoonVisible}
                footer={null}
                wrapClassName="customFooterModal"
                centered
                destroyOnClose={true}
                closable={false}
                width={450}
            >
                <div className="modalMain">
                    <img src={require('./img.gif')} alt="" />
                    <div className="text">
                        <span>Coming soon</span>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
