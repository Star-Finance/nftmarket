import * as ethers from 'ethers'
import { useEffect, useMemo, useState } from 'react'

import abi from '@/abi/KibombNft721Role_abi.json'
import Contract from '@/app/connectors/contract'
import * as config from '@/app/utils/config'

export const useDodoContract = (account?: string | null | undefined): ethers.ethers.Contract | undefined => {
    const [res, setRes] = useState<ethers.ethers.Contract>()

    useEffect(() => {
        const fetch = async (): Promise<void> => {
            try {
                const c = account ? await Contract(config.dodoAsset, abi, account) : await Contract(config.dodoAsset, abi)
                setRes(c)
            } catch (error) {}
        }
        fetch()
        return () => {
            setRes(undefined)
        }
    }, [account])

    return res
}

export const useGateContract = (account?: string | null | undefined): ethers.ethers.Contract | undefined => {
    const [res, setRes] = useState<ethers.ethers.Contract>()

    useEffect(() => {
        const fetch = async (): Promise<void> => {
            try {
                const c = account ? await Contract(config.gateAsset, abi, account) : await Contract(config.gateAsset, abi)
                setRes(c)
            } catch (error) {}
        }
        fetch()
        return () => {
            setRes(undefined)
        }
    }, [account])

    return res
}