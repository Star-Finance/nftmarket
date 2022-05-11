import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { postContractAddress, postTradeEthPrice, postTradeLatestBlock } from '../../../actions/baseAction'
import { IRootState } from '../../../reducers/RootState'

export default (): [number, number, boolean] => {
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const { contractAddress } = useSelector((store: IRootState) => store.base)
    const { ethPrice, ethBlock } = useSelector((store: IRootState) => store.base)

    useEffect(() => {
        const fetch = async (): Promise<void> => {
            setLoading(true)
            if (!contractAddress.length) {
                await dispatch(postContractAddress())
            }
            await dispatch(postTradeEthPrice())
            await dispatch(postTradeLatestBlock())
            setLoading(false)
        }
        fetch()
        return () => {}
    }, [])

    return [ethPrice, ethBlock, loading]
}
