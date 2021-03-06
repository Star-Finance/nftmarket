import { ApolloClient, ApolloQueryResult, InMemoryCache } from '@apollo/client'

export type IApolloQueryResult<T> = ApolloQueryResult<T>

export const client = new ApolloClient({
    // uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
    uri: 'https://api.thegraph.com/subgraphs/name/pengandkun/experiment-uniswap',
    cache: new InMemoryCache(),
    queryDeduplication: true,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache'
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all'
        }
    }
})

export const healthClient = new ApolloClient({
    uri: 'https://api.thegraph.com/index-node/graphql',
    cache: new InMemoryCache()
})

export const blockClient = new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
    cache: new InMemoryCache(),
    queryDeduplication: true,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'network-only'
        },
        query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all'
        }
    }
})
