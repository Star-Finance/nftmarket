// import './trxHistory.stylus'

import { useWeb3React } from '@web3-react/core'
import { Table } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'

import ShortAddress from '@/app/components/ShortAddress'
import { _getTimeTo } from '@/app/utils/time'

interface IProps {
    data: Array<any>
    onChange: Function
    pageSize: number
    isPC: boolean
    total: number
}

export default (props: IProps): React.ReactElement => {
    const { onChange, buyClick, pageSize, isPC, bnbPrice, total } = props
    const { data } = props
    const { account, library } = useWeb3React()
    const [t] = useTranslation()

    const columns = [
        {
            title: t('Serial number'),
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            width: 110,
            render: (text, record, index) => index + 1
        },
        {
            title: t('Wallet address'),
            dataIndex: 'address',
            key: 'address',
            align: 'center',
            render: text => (
                <div className="owner">
                    <ShortAddress address={text} />
                </div>
            )
        },

        {
            width: 150,
            dataIndex: 'add_time',
            title: t('Time'),
            key: 'action',
            align: 'center',
            render: text => _getTimeTo(text, t)
        }
    ]

    const _data = [
        {
            id: '1',
            time: '2021-10-27 07:13:56',
            address: '0xe1....d574'
        }
    ]
    // data = _data
    return (
        <div className="div-table">
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                scroll={{ y: data.length > 8 ? 344 : undefined }}
                onChange={onChange}
                pagination={false}
            />
        </div>
    )
}
