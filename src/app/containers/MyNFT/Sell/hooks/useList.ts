import { useEffect, useState } from 'react'

import { IUserCollectListParams, IUserCollectListResponse, UserCollectList } from '@/app/service/nftServer'

type IForm = IUserCollectListParams

export default (): [boolean, IUserCollectListResponse | undefined, (form: IForm) => void] => {
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState<IUserCollectListResponse>()
    const [form, setForm] = useState<IForm | undefined>()

    const getList = (form: IForm): void => {
        setForm(form)
    }

    useEffect(() => {
        if (!form) return
        const fetch = async (): Promise<void> => {
            setLoading(true)
            const res = await UserCollectList(form)
            if (!res.data) return
            setResponse(res.data)
            setLoading(false)
        }
        fetch()
        return () => {
            setResponse(undefined)
        }
    }, [form])

    return [loading, response, getList]
}
