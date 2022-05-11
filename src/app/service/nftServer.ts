import { IPromise, request } from '../utils/request'

export interface INftVerifyAddressParams {
    account: string
}

export interface ITokensAddressResponseItem {
    token_symbol: string
    token_id: string
}
export interface INftVerifyAddressResponse {
    pg_status: string
    pg_error: string
    data: ITokensAddressResponseItem[]
}

export function nftVerifyAddress(data: INftVerifyAddressParams): IPromise<INftVerifyAddressResponse> {
    return request(`https://airdrop.nftbomb.org/api/v1/nft/verify/address`, {
        method: 'POST',
        data
    })
}

// MyNFT
export interface IUserCollectListParams {
    account: string
}

export interface IUserCollectListResponseItem {
    token_symbol: string
    token_id: string
}
export interface IUserCollectListResponse {
    pg_status: string
    pg_error: string
    data: IUserCollectListResponseItem[]
}

export function UserCollectList(data: IUserCollectListParams): IPromise<IUserCollectListResponse> {
    return request(`/v1/user/collect/list`, {
        method: 'GET',
        params: {
            ...data
        }
    })
}

// createOder
export interface ICreateOrderParams {
    order_id: string
    token_id: string
    asset_id: string
    from_address: string
    price: string
    unit: string
    contract: string
    amount: number
}

export function CreateOrder(data: ICreateOrderParams): IPromise<IResponse<null>> {
    return request(`/v1/order/create`, {
        method: 'POST',
        data
    })
}

// RewardCreate
export interface IRewardCreateParams {
    address: string
    token_id: number
}

export function RewardCreate(data: IRewardCreateParams): IPromise<IResponse<null>> {
    return request(`/v1/reward/create`, {
        method: 'POST',
        data
    })
}

/* home market  */
export interface IHomeMarketListParams {
    offset: number
    limit: number
    address?: string | null | undefined
    contract?: string | null | undefined
}

export interface IHomeMarketListResponse {
    list: IHomeMarketListResponseList[]
    count: number
}

export interface IHomeMarketListResponseList {
    id: number
    asset_id: number
    from_address: string
    to_address: string
    trading_time: string
    unit: string
    price: string
    amount: number
    token_id: string
    event_name: string
    order_id: string
    like_num: number
    attachment: string
    name: string
}

export function homeMarketList(data: IHomeMarketListParams): IPromise<IResponse<IHomeMarketListResponse>> {
    return request(`/v1/order/listing/list`, {
        method: 'GET',
        params: {
            ...data
        }
    })
}

export interface IHomeMarketListResponse2 {
    list: IHomeMarketListResponseList2[]
    count: number
}

export interface IHomeMarketListResponseList2 {
    asset_id: number
    name: string
    content: string
    attachment: string
    contract: string
    owner: string
    category_id: string
    current_price: string
    unit: string
    like_num: number
    token_id: string
    order_id: string
    user_info: IUserInfoResponseUser
}

export function homeMarketList2(data: IHomeMarketListParams): IPromise<IResponse<IHomeMarketListResponse2>> {
    return request(`/v1/nft/list`, {
        method: 'GET',
        params: {
            ...data
        }
    })
}

// TOP Collection
export interface IHomeCollectionListParams {
    offset: number
    limit: number
}

export interface IHomeCollectionListResponse {
    url: string
    url1: string
    url2: string
    url3: string
    avatar: string
    address: string
    nick: string
}

export function homeCollectionList(data: IHomeCollectionListParams): IPromise<IResponse<IHomeCollectionListResponse[]>> {
    return request(`/v1/collect/list`, {
        method: 'GET',
        params: {
            ...data
        }
    })
}

// BOOM
export interface IHomeBoomListParams {
    offset: number
    limit: number
}

export interface IHomeBoomListResponse {
    id: number
    name: string
    reward: string
    description: string
    end_time: string
    start_time: string
    url: string
    status: number
}

export function homeBoomList(data: IHomeBoomListParams): IPromise<IResponse<IHomeBoomListResponse[]>> {
    return request(`/v1/activity/list`, {
        method: 'GET',
        params: {
            ...data
        }
    })
}

export interface IActivityBoxInfo {
    end_time: string
    cost: string
    cost_unit: string
}

export function activityBoxInfo(): IPromise<IResponse<IActivityBoxInfo>> {
    return request(`/v1/activity/box/info`, {
        method: 'GET'
    })
}

export function userCreate(data): IPromise<IResponse<any>> {
    return request(`/v1/user/create`, {
        method: 'POST',
        data
    })
}

export function userUpdate(data, token): IPromise<IResponse<any>> {
    return request(
        `/v1/user/update`,
        {
            method: 'POST',
            data
        },
        token
    )
}

export interface IUserInfoResponseUser {
    address: string
    email: string
    avatar: string
    nick_name: string
    banner: string
    create_time: string
    description: string
    twitter: string
    blog: string
}
export interface IUserInfoResponse {
    userInfo: IUserInfoResponseUser
}

export function userInfo(data): IPromise<IResponse<IUserInfoResponse>> {
    return request(`/v1/user/info`, {
        method: 'get',
        params: {
            ...data
        }
    })
}

export function verifyToken(data, token): IPromise<IResponse<IUserInfoResponse>> {
    return request(
        `/v1/token`,
        {
            method: 'POST',
            data
        },
        token
    )
}
