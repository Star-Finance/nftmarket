import { baseService2 } from '../utils/config'
import { IPromise, request } from '../utils/request'

export function verify(data: IHomeBoomListParams): IPromise<IResponse<IHomeBoomListResponse[]>> {
    return request(`${baseService2}/v1/nft/verify/address`, {
        method: 'POST',
        data
    })
}

export function verify2(data: IHomeBoomListParams): IPromise<IResponse<IHomeBoomListResponse[]>> {
    return request(`${baseService2}/v1/nft/verify/address-new`, {
        method: 'POST',
        data
    })
}
