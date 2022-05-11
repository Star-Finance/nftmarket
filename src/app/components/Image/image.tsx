import { Spin } from 'antd'
import React, { useEffect, useState } from 'react'

interface IProps {
    className?: string
    src?: string
    height?: number | string
    width?: number | string
    alt?: string
    onClick?: () => void
    onLoad?: () => void
}

interface IImageSize {
    width?: number | string
    height?: number | string
}

export default (props: IProps): React.ReactElement | null => {
    const [size, setSize] = useState<IImageSize>()
    const handleSize = async (url: string): Promise<void> => {
        const img = new Image()
        img.setAttribute('crossOrigin', 'anonymous')
        img.src = url
        const size: IImageSize = await new Promise(resolve => {
            img.onload = async () => {
                let width: number | string = img.width
                let height: number | string = img.height
                if (img.width > img.height) {
                    width = '100%'
                    height = 'auto'
                } else {
                    width = 'auto'
                    height = '100%'
                }
                resolve({
                    width,
                    height
                })
                props.onLoad && props.onLoad()
            }
        })
        setSize(size)
    }
    useEffect(() => {
        if (props.src) {
            handleSize(props.src)
        }
        return () => {
            setSize(undefined)
        }
    }, [props.src])

    return (
        <div
            className={props.className}
            style={{
                height: props.height || 'auto',
                width: props.width || 'auto',
                textAlign: 'center',
                position: 'relative'
            }}
            onClick={() => props.onClick && props.onClick()}
        >
            {size ? (
                <img
                    src={props.src}
                    alt={props.alt || ''}
                    style={{
                        height: size.height || 'auto',
                        width: size.width || 'auto',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}
                />
            ) : (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <Spin />
                </div>
            )}
        </div>
    )
}
