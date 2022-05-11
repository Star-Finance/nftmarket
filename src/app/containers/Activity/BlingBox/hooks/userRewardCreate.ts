import { useEffect, useState } from 'react'

import { IRewardCreateParams, RewardCreate } from '@/app/service/nftServer'

type IForm = IRewardCreateParams

export default (): [boolean, (form: IForm) => void] => {
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState<IForm | undefined>()

    const handleSetForm = (form: IForm): void => {
        setForm(form)
    }

    useEffect(() => {
        if (!form) return
        const fetch = async (): Promise<void> => {
            setLoading(true)
            const res = await RewardCreate(form)
            setLoading(false)
            return
        }
        fetch()
        return () => {}
    }, [form])

    return [loading, handleSetForm]
}
