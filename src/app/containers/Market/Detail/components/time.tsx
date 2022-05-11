import './headTitle.stylus'

import React, { useEffect, useState } from 'react'

import { getTimeTo } from '@/app/utils/time'

interface IProps {
    time: string
}

export default (props: IProps): React.ReactElement => {
    const { time } = props
    const [fTime, setFtime] = useState('')
    useEffect(() => {
        if (time) setFtime(getTimeTo(new Date(time)))
    }, [time])

    useEffect(() => {
        const timer = setTimeout(() => {
            setFtime(getTimeTo(new Date(time)))
        }, 1000)

        return () => {
            clearTimeout(timer)
        }
    }, [fTime])
    // console.log('fTime', fTime)
    return <span>{fTime}</span>
}
