import { useEffect, useState } from 'react'

import { activityBoxInfo, IActivityBoxInfo } from '@/app/service/nftServer'

export default (): [boolean, IActivityBoxInfo | undefined, () => void] => {
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState<IActivityBoxInfo>()

    const fetch = async (): Promise<void> => {
        setLoading(true)
        const res = await activityBoxInfo()
        if (!res.data) return
        setResponse(res.data.data)
        setLoading(false)
    }

    useEffect(() => {
        fetch()
        return () => {
            setResponse(undefined)
        }
    }, [])

    return [loading, response, fetch]
}
