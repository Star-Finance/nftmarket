import { useEffect, useState } from 'react'

import { homeBoomList, IHomeBoomListParams, IHomeBoomListResponse } from '@/app/service/nftServer'

type IForm = IHomeBoomListParams

export type { IHomeBoomListResponse }

export default (): [boolean, (form: IForm) => Promise<void | IHomeBoomListResponse[]>] => {
    const [loading, setLoading] = useState(false)

    const fetch = async (form: IForm): Promise<void | IHomeBoomListResponse[]> => {
        if (!form) return
        setLoading(true)
        const res = await homeBoomList(form)
        setLoading(false)
        if (res.data.code === 0) {
            return res.data.data
        }
    }

    return [loading, fetch]
}
