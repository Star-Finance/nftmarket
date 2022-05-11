import { useEffect, useState } from 'react'

import { homeMarketList, IHomeMarketListParams, IHomeMarketListResponse } from '@/app/service/nftServer'

type IForm = IHomeMarketListParams

export type { IHomeMarketListResponse }

export default (): [boolean, (form: IForm) => Promise<void | IHomeMarketListResponse>] => {
    const [loading, setLoading] = useState(false)

    const fetch = async (form: IForm): Promise<void | IHomeMarketListResponse> => {
        if (!form) return
        setLoading(true)
        const res = await homeMarketList(form)
        setLoading(false)
        if (res.data.code === 0) {
            return res.data.data
        }
    }

    return [loading, fetch]
}
