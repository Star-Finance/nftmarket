import { useEffect, useState } from 'react'

import { verify, verify2 } from '@/app/service/dodoServer'

type IForm = {
    account: string
}

export const useVerify = (): [boolean, (form: IForm) => void] => {
    const [loading, setLoading] = useState(false)

    const fetch = async (form: IForm): Promise<void> => {
        setLoading(true)
        const res = await verify(form)
        setLoading(false)
        return
    }

    return [loading, fetch]
}

export const useVerify2 = (): [boolean, (form: IForm) => void] => {
    const [loading, setLoading] = useState(false)

    const fetch = async (form: IForm): Promise<void> => {
        setLoading(true)
        const res = await verify2(form)
        setLoading(false)
        return
    }

    return [loading, fetch]
}
