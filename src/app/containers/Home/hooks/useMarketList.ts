import { useEffect, useState } from 'react'

import { homeMarketList2, IHomeMarketListParams, IHomeMarketListResponse2 } from '@/app/service/nftServer'

type IForm = IHomeMarketListParams

export type { IHomeMarketListResponse2 }

export default (): [boolean, (form: IForm) => Promise<void | IHomeMarketListResponse2>] => {
    const [loading, setLoading] = useState(false)

    const fetch = async (form: IForm): Promise<void | IHomeMarketListResponse2> => {
        if (!form) return
        setLoading(true)
        const res = await homeMarketList2(form)
        setLoading(false)
        if (res.data.code === 0) {
            return res.data.data
        }
    }

    return [loading, fetch]
}
