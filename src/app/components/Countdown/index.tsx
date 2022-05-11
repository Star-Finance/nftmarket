import React, { useEffect, useState } from 'react'

interface IProps {
    pTime: string | number
    endCallback?: Function
}

export default (props: IProps): React.ReactElement => {
    const { pTime, endCallback } = props
    const [times = { day: 0, hr: 0, min: 0, sec: 0 }, setTimes] = useState<any>()
    useEffect(() => {
        const timer = setTimeout(() => {
            countdown()
        }, 1000)

        return () => {
            clearTimeout(timer)
        }
    }, [times])

    const countdown = (): void => {
        const end = new Date(pTime).getTime()
        const now = new Date().getTime()
        const msec = end - now
        if (msec < 0) {
            endCallback && endCallback()
            return
        }
        const day = Math.round(msec / 1000 / 60 / 60 / 24)
        const hr = Math.round((msec / 1000 / 60 / 60) % 24)
        const min = Math.round((msec / 1000 / 60) % 60)
        let sec: any = Math.round((msec / 1000) % 60)
        // let ms =(msec+"").substr(-3,1);

        sec = sec > 9 ? sec : '0' + sec
        setTimes({
            day,
            hr,
            min,
            sec
        })
    }

    const formatNum = (num: string | number): string | number => {
        return (num + '').length < 2 ? '0' + num : num
    }
    return (
        <div className="Countdown">
            {times?.day && <span>{times?.day} days </span>}
            <span>{times && formatNum(times.hr)}:</span>
            <span>{times && formatNum(times.min)}:</span>
            <span>{times && formatNum(times.sec)}</span>
        </div>
    )
}
