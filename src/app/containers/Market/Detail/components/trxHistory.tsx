import './trxHistory.stylus'

import { FieldTimeOutlined } from '@ant-design/icons'
import { useWeb3React } from '@web3-react/core'
import { Table } from 'antd'
import classnames from 'classnames'
import React from 'react'

import ShortAddress from '@/app/components/ShortAddress'

import Time from './time'
interface IProps {
    trxHistorys: any
    onChange: Function
    pageSize: number
    isPC: boolean
    total: number
}

export default (props: IProps): React.ReactElement => {
    const { trxHistorys, onChange, pageSize, isPC, total } = props
    const { library } = useWeb3React()

    const columns = [
        {
            title: 'Date',
            dataIndex: 'trading_time',
            key: 'trading_time',
            // width: 140,
            render: (text, record) => (
                <div className="date">
                    <FieldTimeOutlined />
                    <span>
                        <Time time={text} />
                    </span>
                </div>
            )
        },
        {
            title: 'From',
            dataIndex: 'from_address',
            width: isPC ? 120 : 76,
            key: 'from_address',
            render: text => (
                <div className="owner">
                    <ShortAddress address={text} />
                </div>
            )
        },
        {
            title: 'Event',
            dataIndex: 'event_name',
            key: 'event_name',
            width: isPC ? 80 : 60,
            align: 'center',
            render: text => <a className={classnames('event', text)}>{text}</a>
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: isPC ? 100 : 80,
            render: (text, record) => (
                <div className="price">
                    {/* <Icon name="medal" className="icon" /> */}
                    <span title={library?.utils.fromWei(text) + ' ' + record.unit}>
                        {library?.utils.fromWei(text)} {record.unit}
                    </span>
                </div>
            )
        }
    ]
    const data = [
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
        {
            id: '6',
            trading_time: '2021-10-27 07:13:56',
            from_address: '0xe1....d574',

            event_name: 'Sales',
            price: '$12.34'
        },
        {
            id: '7',
            trading_time: '2021-10-27 07:13:56',
            from_address: '0xe1....d574',

            event_name: 'Sales',
            price: '$12.34'
        },
        {
            id: '8',
            trading_time: '2021-10-27 07:13:56',
            from_address: '0xe1....d574',

            event_name: 'Sales',
            price: '$12.34'
        },
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
    return (
        <div className="div-table">
            <Table
                columns={columns}
                dataSource={trxHistorys}
                rowKey="id"
                // scroll={{ y: 'calc(568px - 122px)' }}
                // scroll={{ y: total > pageSize ? 400 : 440 }}
                scroll={{ y: trxHistorys.length > 8 ? (total > pageSize ? 400 : 440) : undefined }}
                onChange={onChange}
                pagination={total > pageSize ? { position: ['bottomRight'], showSizeChanger: false, pageSize, total } : false}
            />
        </div>
    )
}
