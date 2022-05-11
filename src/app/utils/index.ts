import BigNumber from 'bignumber.js'
export function errorHandle(state, action) {
    console.log(state, action)
    return state
}

export function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined
}

export function toSmall(num: number | string, decimals = 18): string {
    return new BigNumber(num).dividedBy(new BigNumber(10).pow(decimals)).toFixed()
}

export function removeEmpty(obj: any): any {
    Object.keys(obj).forEach(function (key) {
        ;(obj[key] && typeof obj[key] === 'object' && removeEmpty(obj[key])) || ((obj[key] === undefined || obj[key] === null) && delete obj[key])
    })
    return obj
}
