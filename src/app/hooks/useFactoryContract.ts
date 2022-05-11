import { useWeb3React } from '@web3-react/core'
import { useEffect, useMemo, useState } from 'react'

import { getABI, getContractAddress } from '../utils/tool'
import abi from './abi.json'
import useContractAddress from './useContractAddress'

export default (
    address: string | undefined
): [string | undefined, number | undefined, boolean, () => Promise<{ balance: string; decimals: number } | void>] => {
    const [loading, setLoading] = useState<boolean>(false)
    const [i, setI] = useState<number>(0)
    const [r, setR] = useState<number>(0)
    const [contractAddress] = useContractAddress()
    const [contract, setContract] = useState(null)
    const { account, library } = useWeb3React()

    const fetch = async (): Promise<{ balance: string; decimals: number } | void> => {
        if (account && contractAddress) {
            setLoading(true)
            try {
                const instance = new library.eth.Contract(abi, getContractAddress(contractAddress, 'PoolFactory'))
                const imbalanceThreshold = await instance.methods.imbalanceThreshold().call({ from: account })
                const rebaseCoefficient = await instance.methods.rebaseCoefficient().call({ from: account })
                setI(imbalanceThreshold)
                setR(rebaseCoefficient)
            } catch (error) {
                console.log(error)
            }
            setLoading(false)
        }
    }

    useEffect(() => {
        fetch()
        return () => {
            setContract(null)
        }
    }, [contractAddress, account])

    return [i, r]
}
