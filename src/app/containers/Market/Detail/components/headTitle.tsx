import './headTitle.stylus'

import { DownOutlined, UpOutlined } from '@ant-design/icons'
import React, { useState } from 'react'

import Icon from '@/assets/icons'

interface IProps {
    icon: string
    text: string
    rightIcon?: string
    showFold?: boolean
    foldChange?: (isFold: boolean) => void
}

export default (props: IProps): React.ReactElement => {
    const { icon = 'medal', text, rightIcon = '', showFold = false, foldChange } = props
    const [fold, setFold] = useState(false)

    return (
        <div className="headTitle">
            <div className="h-left">
                <Icon name={icon} className="icon" />
                <span>{text}</span>
            </div>
            {rightIcon && <Icon name={rightIcon} />}
            {showFold && (
                <div
                    className="fold"
                    onClick={() => {
                        const isFold = !fold
                        setFold(isFold)
                        foldChange && foldChange(isFold)
                    }}
                >
                    {fold ? <DownOutlined /> : <UpOutlined />}
                </div>
            )}
        </div>
    )
}
