import './Modal.stylus'

import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { CSSTransition } from 'react-transition-group'

const Modal = props => {
    const { children, visible, closeModal, getContainer, width, height = 'auto', maskClosable = true,noScroll=false } = props

    // 在第一次渲染时取 body 原始的 overflow 值
    const bodyOverflow = useRef(window.getComputedStyle(document.body).overflow);
    //// 根据 visible 来动态修改 body 的 overflow 值
    useEffect(() => {
        if (visible) {
            if(noScroll)
             document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = bodyOverflow.current;
        }
    }, [visible]);

    function handleClick(event) {
        // 点击蒙层本身时关闭模态框，点击模态框的内容时不关闭
        if (event.target === event.currentTarget && maskClosable) {
            closeModal()
        }
    }

    useEffect(() => {
        // 组件销毁时恢复 body 的 overflow 值
        return () => {
            document.body.style.overflow = bodyOverflow.current
        }
    }, [])
    const modal = createPortal(
        <CSSTransition in={visible} timeout={300} classNames="fade-scale" unmountOnExit>
            <div className="modal-box" onClick={handleClick}>
                <div className="modal" style={{ width, height }}>
                    {children}
                </div>
            </div>
        </CSSTransition>,
        getContainer || document.body
    )

    return modal
}

export default React.memo(Modal)
