import './go2Top.stylus'

import classnames from 'classnames'
import React, { useEffect, useState } from 'react'

interface IProps {
    className?: string
}

export default (props: IProps): React.ReactElement | null => {
    const [showGotoTop, switchShowGotoTop] = useState(false)

    const getScrollTop = (): number => {
        let scrollTop = 0
        if (document.documentElement && document.documentElement.scrollTop) {
            scrollTop = document.documentElement.scrollTop
        } else if (document.body) {
            scrollTop = document.body.scrollTop
        }
        return scrollTop
    }

    const smoothScroll = (): void => {
        const currentScroll = document.documentElement.scrollTop || document.body.scrollTop
        if (currentScroll > 0) {
            window.requestAnimationFrame(smoothScroll)
            window.scrollTo(0, currentScroll - currentScroll / 5)
        }
    }

    useEffect(() => {
        const onScroll = (): void => {
            if (getScrollTop() > 0) {
                if (!showGotoTop) {
                    switchShowGotoTop(true)
                }
            } else {
                switchShowGotoTop(false)
            }
        }
        if (getScrollTop() > 0 && !showGotoTop) {
            switchShowGotoTop(true)
        }
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return showGotoTop ? (
        <div className={classnames('go2Top', props.className)}>
            <span className="go2TopBtn" onClick={() => smoothScroll()} />
        </div>
    ) : null
}
