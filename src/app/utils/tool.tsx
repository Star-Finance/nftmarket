import BigNumber from 'bignumber.js'
import * as React from 'react'

export function pow10(num: number | string | undefined, decimals = 18): string {
    if (!num) return '0'
    return new BigNumber(num).dividedBy(new BigNumber(10).pow(decimals)).toFixed()
}

export function original(num: number | string | undefined, decimals = 18): string {
    if (!num) return '0'
    return new BigNumber(num).multipliedBy(new BigNumber(10).pow(decimals)).toFixed()
}

export const formatDecimal = (number: number, decimal = 2): string => {
    if (number === undefined) return ''
    let num = number.toString()
    const index = num.indexOf('.')
    if (index !== -1) {
        num = num.substring(0, decimal + index + 1)
    } else {
        num = num.substring(0)
    }
    return parseFloat(num).toFixed(decimal)
}

export const formatMoney = (value: string | number, n = 2): number | string => {
    if (isNaN(Number(value))) return Number(0).toFixed(n > 0 ? n : 0)
    const isNegative = value < 0
    const v = formatDecimal(Math.abs(Number(value)), n > 0 ? n : 0)
    const l = v.split('.')[0].split('').reverse()
    const r = v.split('.')[1]
    let t = ''
    for (let i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 === 0 && i + 1 !== l.length ? ',' : '')
    }
    const res = t.split('').reverse().join('') + `${r && r !== '00' ? '.' + r : ''}`
    return `${isNegative ? '-' : ''}${res}`
}

export function getShortenAddress(address): string {
    if (!address) return ''
    const firstCharacters = address.substring(0, 6)
    const lastCharacters = address.substring(address.length - 4, address.length)
    return `${firstCharacters}...${lastCharacters}`
}

export function getShortenAddress2(address): string {
    const firstCharacters = address.substring(0, 10)
    const lastCharacters = address.substring(address.length - 10, address.length)
    return `${firstCharacters}****${lastCharacters}`
}

export function formatColor(value: string): JSX.Element {
    if (/\-/.test(value)) {
        return <span style={{ color: '#E26048' }}>{value}</span>
    }
    return <span style={{ color: '#44C27F' }}>{value}</span>
}

export function getUnit(pair: string | undefined, direction: string | undefined): string {
    if (!pair) return ''
    const arr = pair.split('_')
    return direction === 'inverse' ? arr[0] : arr[1]
}

interface IAbi {
    contract_name: string
    address: string
    abi: any
}

// export function getABI(data: IAbi[], address: string): string {
//     const item = data.filter(item => item.address === address)
//     return item[0] ? item[0].abi : ''
// }

export function getABI(data: IAbi[], name: string): any {
    const item = data.filter(item => item.contract_name === name)
    return item[0] ? item[0].abi : ''
}

export function getContractAddress(data: IAbi[], name: string): string {
    const item = data.filter(item => item.contract_name === name)
    return item[0] ? item[0].address : ''
}

export function formatInput(value: string): string {
    let obj = ''
    obj = value.replace(/[^\d.]/g, '')
    obj = obj.replace(/^\./g, '')
    obj = obj.replace(/\.{2,}/g, '.')
    obj = obj.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
    return obj
}

export function filterInput(val: string): string {
    return val
        .replace('-', '')
        .replace(/^\.+|[^\d.]/g, '')
        .replace(/^0\d+\./g, '0.')
        .replace(/\.{2,}/, '')
        .replace(/^0(\d)/, '$1')
        .replace(/^(\-)*(\d+)\.(\d{0,2}).*$/, '$1$2.$3')
}

export function getRandomNumber(): number {
    return Math.floor(Math.random() * (12 - 1 + 1)) + 1
}
