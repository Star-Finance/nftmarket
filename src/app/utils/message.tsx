import { ExclamationCircleOutlined } from '@ant-design/icons'
import { message } from 'antd'
import React from 'react'

import Icon from '@/assets/icons'

const key = 'updatable'

export const toast = (text?: string, type?: string): void => {
    message.info({
        content: (
            <div>
                {type == 'info' ? <ExclamationCircleOutlined className="icon" /> : <Icon name={type || 'success'} />}
                <div className="text">{text || 'successfully'}</div>
            </div>
        ),
        className: 'toastMessage',
        style: {
            marginTop: '20vh'
        },
        duration: 3,
        maxCount: 1,
        key
    })
}
