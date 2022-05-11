import axios, { AxiosResponse } from 'axios'
import qs from 'qs'

import { invitationActivityService } from './config'

// axios.defaults.baseURL = 'http://activity.api.nftbomb.org'
// axios.defaults.withCredentials = false

export const request = axios.create({
    timeout: 1000 * 60,
    withCredentials: false,
    baseURL: invitationActivityService //'http://activity.api.nftbomb.org' //'http://101.200.179.105' //
})

request.interceptors.response.use(
    config => {
        config.headers['Content-Type'] = 'multipart/form-data'
        return config.data
    },
    error => {
        return Promise.reject(error.response)
    }
)

request.interceptors.request.use(
    config => {
        config.transformRequest = [
            function (data) {
                // 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs（这个模块在安装axios的时候就已经安装了，不需要另外安装）
                if (/application\/json/.test(config.headers['Content-Type'])) {
                    data = JSON.stringify(data)
                    // eslint-disable-next-line eqeqeq
                } else if (data != undefined) {
                    data = qs.stringify(data)
                }
                return data
            }
        ]
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// function checkStatus(response: AxiosResponse): AxiosResponse {
//     if (response.status >= 200 && response.status < 300) {
//         return response
//     }
//     const error = new Error(response.statusText)
//     throw error
// }

// export async function request(reqUrl: string, options: AxiosRequestConfig = { method: 'GET' }): Promise<AxiosResponse> {
//     const response = await axios(reqUrl, options)
//         .then(checkStatus)
//         .catch(err => {
//             throw err
//         })
//     return response
// }

// const http = {
//     get: function (url, data) {
//         return request.get(url, data)
//     }
// }

// export { http }

export type IPromise<T> = Promise<AxiosResponse<T>>
