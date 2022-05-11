import { useWeb3React } from '@web3-react/core'
import * as ethers from 'ethers'
import { useEffect, useMemo, useState } from 'react'

import abi from '@/abi/IERC20.json'
import Contract from '@/app/connectors/contract'
import { pow10 } from '@/app/utils/tool'

interface erc20Res {
    erc20: ethers.ethers.Contract | undefined
    isApproveToken: boolean
    balance: number
}
export default (tokenAddress: string, contractAddress: string): erc20Res => {
    const [res, setRes] = useState<erc20Res>({ erc20: undefined, isApproveToken: false, balance: 0 })
    const { account } = useWeb3React()

    useEffect(() => {
        if (!account) return
        const fetch = async (): Promise<void> => {
            try {
                const erc20 = await Contract(tokenAddress, abi, account)
                console.log('erc20', erc20)
                let is_allowance = await erc20.allowance(account, contractAddress)

                is_allowance = Number(is_allowance.toString())
                const balance = await erc20.balanceOf(account)
                setRes({ erc20, isApproveToken: is_allowance, balance: Number(pow10(balance.toString(), 18)) })
            } catch (error) {
                console.log('error111111', error)
            }
        }
        fetch()
        return () => {
            setRes({ erc20: undefined, isApproveToken: false, balance: 0 })
        }
    }, [account])

    return res
}
