import './list.stylus'

// import './remList.stylus'
// import '@/app/components/Header/remHeader.stylus'
import { useWeb3React } from '@web3-react/core'
import { Input, Pagination, Popover, Select, Spin } from 'antd'
import classnames from 'classnames'
import { getQueryStringByName } from 'mobile-browser'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

import Card from '@/app/components/Card'
import Go2Top from '@/app/components/Go2Top'
import Layout from '@/app/components/Layout'
import useMarketList, { IHomeMarketListResponse2 } from '@/app/containers/Home/hooks/useMarketList' // TODO: 移动到公共的hooks
import useWindowSize from '@/app/hooks/useWindowSize'
import { removeEmpty } from '@/app/utils'
import * as config from '@/app/utils/config'
import { formatMoney } from '@/app/utils/tool'
import Icon from '@/assets/icons'
import { useThemeContext } from '@/theme'

const { Option } = Select

const collections = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] // TODO: 相关的还需要修改

export default (): React.ReactElement => {
    const { library, account } = useWeb3React()
    const history = useHistory()
    const { currentThemeName } = useThemeContext()
    const [type, setType] = useState<string>('all')
    const [showFilter, setShowFilter] = useState(false)
    const [selectCollections, setSelectCollections] = useState<number[]>([])
    const [getMarketListLoading, getMarketList] = useMarketList()
    const [marketList, setMarketList] = useState<IHomeMarketListResponse2['list']>([])
    const [pageTotal, setPageTotal] = useState(0)
    const [pageIndex, setPageIndex] = useState(getQueryStringByName('page') || 1)
    const contract = getQueryStringByName('contract') || null
    const address = getQueryStringByName('address') || null
    useWindowSize()

    const onSelectCollections = (key): void => {
        const selected: number[] = ([] as number[]).concat(selectCollections)
        collections.forEach((item, index) => {
            if (item === key) {
                const findIndex = selectedCollectionsIndex(item)
                if (findIndex === -1) {
                    selected.push(item)
                } else {
                    selected.splice(findIndex, 1)
                }
            }
        })
        setSelectCollections(selected)
    }

    const selectedCollectionsIndex = (key): number => {
        let selectedIndex = -1

        selectCollections.forEach((item, index) => {
            if (key === item) {
                selectedIndex = index
            }
        })

        return selectedIndex
    }

    const CollectionsDom = (
        <div className="collectionsDownMain">
            <div className="collectionsDownContent">
                {collections.map(item => (
                    <div className="item" key={item} onClick={() => onSelectCollections(item)}>
                        <div className="itemContent">
                            <div className="avatar">
                                <img src="https://img0.baidu.com/it/u=3178077691,2666577610&fm=26&fmt=auto" alt="" />
                            </div>
                            <div className="name">SatoshiFaces</div>
                            {selectedCollectionsIndex(item) !== -1 ? (
                                <div className="collect">
                                    <Icon name="collect" />
                                </div>
                            ) : null}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    const fetchMarketList = async (index): Promise<void> => {
        const res = await getMarketList(removeEmpty({ offset: (index - 1) * 20, limit: 20, address, contract }))
        if (res) {
            setPageTotal(res.count)
            setMarketList(res.list)
        }
    }

    useEffect(() => {
        setMarketList([])
        fetchMarketList(pageIndex)
        return () => {}
    }, [pageIndex])

    useEffect(() => {
        if (contract && address) {
            history.replace('/market')
        }
    }, [contract, address])

    return (
        <Layout className={classnames('page-marketList', currentThemeName)}>
            <div className="content">
                <div className="box">
                    <div className="conditionBox">
                        {/* <div className="condition">
                            <div className="collections">
                                <Popover overlayClassName="collectionsDown" placement="bottomLeft" trigger="click" content={CollectionsDom}>
                                    <span>
                                        Collections
                                        <Icon name="down" />
                                    </span>
                                </Popover>
                            </div>
                            <div className="type">
                                <div className={classnames('item', { cur: type === 'all' })} onClick={() => setType('all')}>
                                    All
                                </div>
                                <div className={classnames('item', { cur: type === 'buy' })} onClick={() => setType('buy')}>
                                    Buy now
                                </div>
                                <div className={classnames('item', { cur: type === 'auction' })} onClick={() => setType('auction')}>
                                    Auction
                                </div>
                                <div className={classnames('item', { cur: type === 'boom' })} onClick={() => setType('boom')}>
                                    Boom
                                </div>
                                <div className={classnames('item', { cur: type === 'button' })} onClick={() => setType('button')}>
                                    Button
                                </div>
                            </div>
                            <div className="filters">
                                <span onClick={() => setShowFilter(!showFilter)}>
                                    <Icon name="filter" />
                                    Filters
                                </span>
                            </div>
                        </div> */}
                        {showFilter ? (
                            <div className="filtersForm">
                                <div className="item">
                                    <div className="itemTitle">Categories</div>
                                    <div className="itemForm">
                                        <Select
                                            mode="multiple"
                                            defaultValue={['jack', 'lucy']}
                                            dropdownClassName="filtersFormDown"
                                            menuItemSelectedIcon={<Icon name="selected" />}
                                        >
                                            <Option value="jack">Jack</Option>
                                            <Option value="lucy">Lucy</Option>
                                        </Select>
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="itemTitle">Chains</div>
                                    <div className="itemForm">
                                        <Select defaultValue={'jack'} suffixIcon={<Icon name="down" />} dropdownClassName="filtersFormDown">
                                            <Option value="jack">Jack</Option>
                                            <Option value="lucy">Lucy</Option>
                                        </Select>
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="itemTitle">Price</div>
                                    <div className="itemForm">
                                        <Select defaultValue={'jack'} suffixIcon={<Icon name="down" />} dropdownClassName="filtersFormDown">
                                            <Option value="jack">Jack</Option>
                                            <Option value="lucy">Lucy</Option>
                                        </Select>
                                        <Input placeholder="Min" />
                                        <div className="to">To</div>
                                        <Input placeholder="Max" />
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <div className="main">
                        {getMarketListLoading ? (
                            <div className="mainLoading">
                                <Spin tip="loading" />
                            </div>
                        ) : (
                            marketList?.map((item, index) => (
                                <div
                                    className={classnames('item', { item1155: item.contract === config.nft1155 })}
                                    key={item.asset_id}
                                    onClick={() => history.push(`/MarketDetail/buy/${item.asset_id}/${item.order_id || ''}`)}
                                >
                                    <Card
                                        src={item.attachment}
                                        username={item.name}
                                        userAddress={item.owner}
                                        userAvatar={item.user_info && item.user_info.avatar ? item.user_info.avatar : require('./img/user.png')}
                                        isLike={false}
                                        likeNumber={item.like_num}
                                        type={'money'}
                                        typeList={[1, 3, 4]}
                                        price={`${formatMoney(library?.utils.fromWei(item.current_price))}${item.unit}`}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                    <div className="page">
                        <Pagination
                            current={Number(pageIndex)}
                            total={pageTotal}
                            onChange={i => {
                                history.replace(`/market?page=${i}`)
                                setPageIndex(i)
                            }}
                            pageSize={20}
                            showSizeChanger={false}
                        />
                    </div>
                </div>
            </div>
            <Go2Top />
        </Layout>
    )
}
