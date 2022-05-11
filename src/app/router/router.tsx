import { Web3ReactProvider } from '@web3-react/core'
import { Spin } from 'antd'
import React, { Suspense, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import Web3 from 'web3'

import { ThemeProvider } from '@/theme'

import { setViewWidth } from '../actions/baseAction'
import ScrollToTop from '../components/ScrollToTop'
import App from '../containers/Home'
import NotFound from '../containers/NotFound'
import systemRouter from './systemRouter'

const Loading = (): JSX.Element => {
    return (
        <div className="lt-spin">
            <Spin size="large" tip="加载中..." />
        </div>
    )
}

export default (props): JSX.Element => {
    const dispatch = useDispatch()

    dispatch(setViewWidth(document.body.clientWidth))
    window.onresize = () => {
        dispatch(setViewWidth(document.body.clientWidth))
    }

    return (
        <ThemeProvider>
            <Web3ReactProvider getLibrary={provider => new Web3(provider)}>
                <ScrollToTop>
                    <Suspense fallback={<Loading />}>
                        <Switch>
                            {systemRouter.map((r, key) => {
                                return (
                                    <Route
                                        exact={!!r.exact}
                                        render={() => <r.component key={r.router + key} />}
                                        key={r.router + key}
                                        path={r.router}
                                    />
                                )
                            })}
                            <Route exact={true} path="/" component={App} />
                            <Route path="*" component={NotFound} />
                        </Switch>
                    </Suspense>
                </ScrollToTop>
            </Web3ReactProvider>
        </ThemeProvider>
    )
}
