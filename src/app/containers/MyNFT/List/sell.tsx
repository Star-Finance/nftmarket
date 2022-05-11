import { useWeb3React } from '@web3-react/core'
import { Pagination, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import Card from '@/app/components/Card'
import useMarketList, { IHomeMarketListResponse } from '@/app/hooks/useMarketList'
import { formatMoney } from '@/app/utils/tool'

export default (): React.ReactElement => {
    const { library, account } = useWeb3React()
    const history = useHistory()
    const [getMarketListLoading, getMarketList] = useMarketList()
    const [sellList, setSellList] = useState<IHomeMarketListResponse['list']>([])
    const [pageTotal, setPageTotal] = useState(0)
    const [pageIndex, setPageIndex] = useState(1)

    const fetchMarketList = async (index): Promise<void> => {
        const res = await getMarketList({ offset: (index - 1) * 20, limit: 20, address: account })
        if (res) {
            setPageTotal(res.count)
            setSellList(res.list)
        }
    }

    useEffect(() => {
        if (account) {
            fetchMarketList(pageIndex)
        } else {
            setPageIndex(1)
            setSellList([])
        }
        return () => {}
    }, [pageIndex, account])

    return (
        <>
            <div className="main">
                {getMarketListLoading ? (
                    <div className="mainLoading">
                        <Spin tip="loading" />
                    </div>
                ) : sellList.length ? (
                    sellList.map(item => (
                        <div className="item" key={item.id} onClick={() => history.push(`/MarketDetail/buy/${item.asset_id}/${item.order_id}`)}>
                            <Card
                                src={item.attachment}
                                username={item.name}
                                userAddress={item.from_address}
                                userAvatar={require('./img/user.png')}
                                isLike={false}
                                likeNumber={item.like_num}
                                type={'money'}
                                typeList={[1, 3, 4]}
                                price={`${formatMoney(library?.utils.fromWei(item.price))}${item.unit}`}
                            />
                        </div>
                    ))
                ) : (
                    <div className="mainLoading">No Data</div>
                )}
            </div>
            <div className="page">
                <Pagination current={pageIndex} total={pageTotal} onChange={i => setPageIndex(i)} pageSize={20} showSizeChanger={false} />
            </div>
        </>
    )
}
