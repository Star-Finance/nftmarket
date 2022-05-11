import './ShortAddress.stylus'

import { useWeb3React } from '@web3-react/core'
import React from 'react'

import { NETWORK_PREFIX } from '@/app/connectors'

// import { getShortenAddress } from '../../utils/tool'

interface IProps {
    address?: string
    name?: string
}

const validateEtherAddress = function (address?: string): boolean {
    if (!address) {
        return false
    }
    if (address.substring(0, 2) != '0x') {
        return false
    } else if (/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        return true
    }
    return false
}

function getShortenAddress(address): string {
    if (!address) return ''
    const firstCharacters = address.substring(0, 4)
    const lastCharacters = address.substring(address.length - 4, address.length)
    return `${firstCharacters}...${lastCharacters}`
}
export default (props: IProps): React.ReactElement | null => {
    const { address, name = '' } = props
    const { chainId } = useWeb3React()
    const type = validateEtherAddress(address) ? 'address' : 'tx'
    const url = `https://${!chainId || chainId === 56 ? '' : `${NETWORK_PREFIX[chainId]}.`}bscscan.com/${type}/${address}`
    return address ? (
        <a href={url} target="_blank" rel="noreferrer" className="ShortAddress">
            {name || getShortenAddress(address)}
        </a>
    ) : null
}
