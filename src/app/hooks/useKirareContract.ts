import { useWeb3React } from '@web3-react/core'
import * as ethers from 'ethers'
import { useEffect, useMemo, useState } from 'react'

import abi from '@/abi/kirare1_abi.json'
import Contract from '@/app/connectors/contract'
import * as config from '@/app/utils/config'

export default (): ethers.ethers.Contract | undefined => {
    const [res, setRes] = useState<ethers.ethers.Contract>()
    const { account } = useWeb3React()

    useEffect(() => {
        if (!account) return
        const fetch = async (): Promise<void> => {
            try {
                const c = await Contract(config.MerkelDropWhiteListV2, abi, account)
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
