// import './trxHistory.stylus'

import { useWeb3React } from '@web3-react/core'
import { Button, Table } from 'antd'
import React from 'react'
import { useHistory } from 'react-router-dom'

import ShortAddress from '@/app/components/ShortAddress'
import { countUsdt } from '@/app/utils/tokens'

interface IProps {
    data: Array<any>
    onChange: Function
    buyClick: Function
    pageSize: number
    isPC: boolean
    bnbPrice: number
    nbpPrice: number
    total: number
}

export default (props: IProps): React.ReactElement => {
    const { data, onChange, buyClick, pageSize, isPC, bnbPrice, nbpPrice, total } = props
    const { account, library } = useWeb3React()
    const history = useHistory()

    const columns = [
        {
            title: 'Owner',
            dataIndex: 'from_address',
            key: 'from_address',
            width: 130,
            render: (text, record) => (
                <div className="owner">
                    <img
                        src={record.user_info && record.user_info.avatar ? record.user_info.avatar : require('../img/avatar.png')}
                        onClick={() => history.push(`/MyNFTList?address=${record.user_info.address}`)}
                    />
                    <ShortAddress address={text} />
                </div>
            )
        },
        {
            title: 'Price',
            dataIndex: 'address',
            key: 'address',
            // ellipsis: true,
            // align: 'center',
            render: (text, record) => {
                const orderTokenPrice = record.unit == 'BNB' ? bnbPrice : nbpPrice

                return (
                    <div className="Price">
                        <a title={library?.utils.fromWei(record.price) + ' ' + record.unit}>
                            {library?.utils.fromWei(record.price)} {record.unit}
                        </a>
                        <span>${countUsdt(library?.utils.fromWei(record.price), orderTokenPrice, record.unit)}</span>
                    </div>
                )
            }
        },
        // {
        //     title: 'Token ID',
        //     dataIndex: 'token_id',
        //     width: 96,
        //     key: 'token_id',
        //     align: 'center',
        //     render: text => <span>#{text}</span>
        // },
        {
            title: 'Expiration',
            dataIndex: 'token_id',
            key: 'token_id',
            align: 'center',
            width: 90,
            render: text => <span>in a day</span>
        },
        {
            title: '',
            width: isPC ? 104 : 70,
            key: 'action',
            align: 'center',
            render: (text, record, index) =>
                record.from_address != account && (
                    <Button
                        ghost
                        onClick={() => {
                            buyClick(index)
                            // checkoutClick(record.order_id)
                        }}
                    >
                        buy
                    </Button>
                )
        }
    ]

    const _data = [
        {
            id: '1',
            trading_time: '2021-10-27 07:13:56',
            from_address: '0xe1....d574',
            event_name: 'Sales',
            price: '$12.34'
        },
        {
            id: '2',
            trading_time: '2021-10-27 07:13:56',
            from_address: '0xe1....d574',
            event_name: 'Sales',
            price: '$12.34'
        },
        {
            id: '3',
            trading_time: '2021-10-27 07:13:56',
            from_address: '0xe1....d574',

            event_name: 'Sales',
            price: '$12.34'
        },
        {
            id: '4',
            trading_time: '2021-10-27 07:13:56',
            from_address: '0xe1....d574',

            event_name: 'Sales',
            price: '$12.34'
        },
        {
            id: '5',
            trading_time: '2021-10-27 07:13:56',
            from_address: '0xe1....d574',

            event_name: 'Sales',
            price: '$12.34'
        },
        // {
        //     id: '6',
        //     trading_time: '2021-10-27 07:13:56',
        //     from_address: '0xe1....d574',

        //     event_name: 'Sales',
        //     price: '$12.34'
        // },
        // {
        //     id: '7',
        //     trading_time: '2021-10-27 07:13:56',
        //     from_address: '0xe1....d574',

        //     event_name: 'Sales',
        //     price: '$12.34'
        // },
        // {
        //     id: '8',
        //     trading_time: '2021-10-27 07:13:56',
        //     from_address: '0xe1....d574',

        //     event_name: 'Sales',
        //     price: '$12.34'
        // },
        {
            id: '9',
            trading_time: '2021-10-27 07:13:56',
            from_address: '0xe1....d574',

            event_name: 'Sales',
            price: '$12.34'
        },
        {
            id: '10',
            trading_time: '2021-10-27 07:13:56',
            from_address: '0xe1....d574',

            event_name: 'Sales',
            price: '$12.34'
        },
        {
            id: '11',
            trading_time: '2021-10-27 07:13:56',
            from_address: '0xe1....d574',

            event_name: 'Sales',
            price: '$12.34'
        }
    ]
    // data = _data
    return (
        <div className="div-table">
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                scroll={{ y: data.length > 8 ? (total > pageSize ? 400 : 440) : undefined }}
                onChange={onChange}
                pagination={total > pageSize ? { position: ['bottomRight'], showSizeChanger: false, pageSize, total } : false}
            />
        </div>
    )
}
