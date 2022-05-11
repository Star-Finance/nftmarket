import axios, { AxiosResponse } from 'axios'

import { IPromise, request } from '../utils/request'

export interface IUserCollectListParams {
    account: string
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function OrderList(data: object): IPromise<unknown> {
    return request(`/v1/order/listing/list`, {
        method: 'GET',
        params: {
            ...data
        }
    })
}

export function getTrxHistory(data: object): IPromise<unknown> {
    return request(`/v1/order/list`, {
        method: 'GET',
        params: {
            ...data
        }
    })
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function GetNFTInfo(data: object): IPromise<unknown> {
    return request(`/v1/nft/info`, {
        method: 'GET',
        params: {
            ...data
        }
    })
}

export interface IGetNFTInfosParams {
    asset_ids?: string
    token_ids?: string //'1,2,3'
    contract?: string
}
export function GetNFTInfos(data: IGetNFTInfosParams): IPromise<any> {
    return request(`/v1/nft/infos`, {
        method: 'GET',
        params: {
            ...data
        }
    })
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function GetContractInfo(data: object): IPromise<unknown> {
    return request(`/v1/contract/info`, {
        method: 'GET',
        params: {
            ...data
        }
    })
}

function checkStatus(response: AxiosResponse): AxiosResponse {
    if (response.status >= 200 && response.status < 300) {
        return response
    }
    const error = new Error(response.statusText)
    throw error
}
// eslint-disable-next-line @typescript-eslint/ban-types
export function GetTokenPrice(token: string): IPromise<unknown> {
    const response = axios(`https://coinograph.io/ticker/?symbol=binance:${token}usdt`, { method: 'GET' })
        .then(checkStatus)
        .catch(err => {
            throw err
        })
    return response
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function GetPriceByGate(token: string): IPromise<unknown> {
    const response = axios(`/v1/currency/price?name=${token}_USDT`, { method: 'GET' })
        .then(checkStatus)
        .catch(err => {
            throw err
        })
    return response
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function GetDoDoTokenPrice(token: string): IPromise<unknown> {
    const response = axios(
        `https://priceapi.dodoex.io/api/v1/klines?symbol=NBP/USDT&interval=15m&limit=96&addresses=0x74c22834744e8d5e36c79420ff7b057964aba8a7/0x55d398326f99059ff775485246999027b3197955&network=bsc-mainnet`,
        { method: 'GET' }
    )
        .then(checkStatus)
        .catch(err => {
            throw err
        })
    return response
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function OrderBuy(data: object): IPromise<unknown> {
    return request(`/v1/order/buy`, {
        method: 'POST',
        params: {
            ...data
        }
    })
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function OrderClose(data: object): IPromise<unknown> {
    return request(`/v1/order/close`, {
        method: 'POST',
        params: {
            ...data
        }
    })
}
