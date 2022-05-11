import { InjectedConnector } from '@web3-react/injected-connector'

export enum SupportedChainId {
    MAINNET = 1,
    ROPSTEN = 3,
    RINKEBY = 4,
    GOERLI = 5,
    KOVAN = 42,
    BNB = 56,
    BNBTEST = 97
}

export const NETWORK_PREFIX: { [chainId in SupportedChainId | number]: string } = {
    [SupportedChainId.MAINNET]: 'mainnet',
    [SupportedChainId.RINKEBY]: 'rinkeby',
    [SupportedChainId.ROPSTEN]: 'ropsten',
    [SupportedChainId.GOERLI]: 'gorli',
    [SupportedChainId.KOVAN]: 'kovan',
    [SupportedChainId.BNB]: '',
    [SupportedChainId.BNBTEST]: 'testnet'
}

export const NETWORK_LABELS: { [chainId in SupportedChainId | number]: string } = {
    [SupportedChainId.MAINNET]: 'Mainnet',
    [SupportedChainId.RINKEBY]: 'Rinkeby',
    [SupportedChainId.ROPSTEN]: 'Ropsten',
    [SupportedChainId.GOERLI]: 'Görli',
    [SupportedChainId.KOVAN]: 'Kovan',
    [SupportedChainId.BNB]: 'bnb',
    [SupportedChainId.BNBTEST]: 'bnbTest'
}

const SUPPORTED_CHAIN_IDS: SupportedChainId[] = [
    SupportedChainId.MAINNET,
    SupportedChainId.KOVAN,
    SupportedChainId.GOERLI,
    SupportedChainId.RINKEBY,
    SupportedChainId.ROPSTEN,
    SupportedChainId.BNB,
    SupportedChainId.BNBTEST
]

export const injected = new InjectedConnector({
    supportedChainIds: SUPPORTED_CHAIN_IDS
})
