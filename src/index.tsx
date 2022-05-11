import './assets/stylus/index.styl'
import './app/utils/i18n'

import { ApolloProvider } from '@apollo/client/react'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router'

import { client } from './app/apollo/client'
import AppRouter from './app/router'
import store, { history } from './app/store'

render(
    <ApolloProvider client={client}>
        <Provider store={store}>
            <Router history={history}>
                <AppRouter />
            </Router>
        </Provider>
    </ApolloProvider>,
    document.getElementById('root')
)

if (module.hot) {
    module.hot.accept(['./app/router'], () => {
        render(
            <ApolloProvider client={client}>
                <Provider store={store}>
                    <Router history={history}>
                        <AppRouter />
                    </Router>
                </Provider>
            </ApolloProvider>,
            document.getElementById('root')
        )
    })
}
