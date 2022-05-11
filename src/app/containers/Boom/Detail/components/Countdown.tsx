import React, { useEffect, useState } from 'react'

interface IProps {
    pTime: string | number
    endCallback: Function
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
            endCallback()
            return
        }
        const day = parseInt(msec / 1000 / 60 / 60 / 24)
        const hr = parseInt((msec / 1000 / 60 / 60) % 24)
        const min = parseInt((msec / 1000 / 60) % 60)
        let sec: any = parseInt((msec / 1000) % 60)
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
            <div className="item">
                <div className="value">{times && formatNum(times.day)}</div>
                <div className="name">Days</div>
            </div>
            <div className="item">
                <div className="value">{times && formatNum(times.hr)}</div>
                <div className="name">Hours</div>
            </div>
            <div className="item">
                <div className="value">{times && formatNum(times.min)}</div>
                <div className="name">Minutes</div>
            </div>
            <div className="item">
                <div className="value">{times && formatNum(times.sec)}</div>
                <div className="name">Seconds</div>
            </div>
        </div>
    )
}
