import './trxTypeNav.stylus'

import { message } from 'antd'
import classnames from 'classnames'
import * as React from 'react'

import Icon from '@/assets/icons'

interface IProps {
    activeIndex?: number
    emitComingSoon: () => void
}

export default (props: IProps): React.ReactElement => {
    const { activeIndex, emitComingSoon } = props
    const navs = [
        { name: 'Auction' },
        { name: 'Boom' },
        { name: 'Origin' },
        // { name: 'Ino' },
        { name: 'Market' }
    ]
    return (
        <div className="trxTypeNav">
            {navs.map((item, index) => {
                return (
                    <div
                        className={classnames('item', { activeItem: index == activeIndex })}
                        onClick={() => {
                            if (index != activeIndex) emitComingSoon && emitComingSoon()
                        }}
                        key={item.name}
                    >
                        <span>{item.name}</span>
                        <Icon name={item.name.toLocaleLowerCase()} />
                    </div>
                )
            })}
        </div>
    )
}
