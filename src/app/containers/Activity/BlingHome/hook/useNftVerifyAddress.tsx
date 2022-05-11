import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'

import { nftVerifyAddress } from '@/app/service/nftServer'

export default (): [any, (account: string) => any] => {
    const [loading, setLoading] = useState(false)
    const { account } = useWeb3React()
    const [data, setData] = useState<any>()

    const fetch = async (account: string): Promise<any> => {
        setLoading(true)
        const res = await nftVerifyAddress({ account })
        if (res.data) {
            setData(res.data.data)
        }
        setLoading(false)
        return res.data.data
    }

    useEffect(() => {
        if (!account) return

        fetch(account)
        return () => {
            setData(undefined)
        }
    }, [account])

    return [data, fetch]
}
