import { useEffect, useState } from 'react'

import { homeCollectionList, IHomeBoomListParams, IHomeCollectionListResponse } from '@/app/service/nftServer'

type IForm = IHomeBoomListParams

export type { IHomeCollectionListResponse }

export default (): [boolean, (form: IForm) => Promise<void | IHomeCollectionListResponse[]>] => {
    const [loading, setLoading] = useState(false)

    const fetch = async (form: IForm): Promise<void | IHomeCollectionListResponse[]> => {
        if (!form) return
        setLoading(true)
        const res = await homeCollectionList(form)
        setLoading(false)
        if (res.data.code === 0) {
            return res.data.data
        }
    }

    return [loading, fetch]
}
