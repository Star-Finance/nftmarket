import axios from 'axios'

import { IPromise, request } from '../utils/request'

export interface IUserCollectListParams {
    account: string
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function GetNFTInfos(data: object): IPromise<unknown> {
    return request(`/v1/nft/infos`, {
        method: 'GET',
        params: {
            ...data
        }
    })
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function GetRecommend(data: object): IPromise<unknown> {
    return request(`/v1/boom/recommend`, {
        method: 'POST',
        data
    })
}

// 传token_ids获取boom组合
// eslint-disable-next-line @typescript-eslint/ban-types
export function GetBoomsByCreate(data: object): IPromise<unknown> {
    return request(`/v1/boom/create`, {
        method: 'POST',
        data
    })
}

// 根据推荐nft池和将要碰撞的nft池来获取boom
// eslint-disable-next-line @typescript-eslint/ban-types
export function GetBoomsListStatus(data: object): IPromise<unknown> {
    return request(`/v1/boom/list-status`, {
        method: 'GET',
        params: {
            ...data
        }
    })
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function GetWinnerList(data: object): IPromise<unknown> {
    return request(`/v1/boom/prize/list`, {
        method: 'GET',
        params: {
            ...data
        }
    })
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function GetUserBoomHistory(data: object): IPromise<unknown> {
    return request(`/v1/boom/list`, {
        method: 'GET',
        params: {
            ...data
        }
    })
}
