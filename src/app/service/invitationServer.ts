import { IPromise, request } from '../utils/http'

export interface IUserCollectListParams {
    account: string
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function RecordList(data: object): IPromise<unknown> {
    return request(`/code/list`, {
        method: 'POST',
        data
    })
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function GetCode(data: object): IPromise<unknown> {
    return request(`/code`, {
        method: 'POST',
        data
    })
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function GetInvitationNum(data: object): IPromise<unknown> {
    return request(`/code/num`, {
        method: 'POST',
        data
    })
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function codeUse(data: object): IPromise<unknown> {
    return request(`/code/check`, {
        method: 'POST',
        data
    })
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function uploadBase64(data: object): IPromise<unknown> {
    return request(`/code/upload`, {
        method: 'POST',
        data
    })
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function getPic(data: object): IPromise<unknown> {
    return request(`/code/pic`, {
        method: 'POST',
        data
    })
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function buyProgress(data: object): IPromise<unknown> {
    return request(`/code/buy`, {
        method: 'POST',
        data
    })
}
