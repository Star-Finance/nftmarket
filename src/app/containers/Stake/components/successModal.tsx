import './successModal.stylus'
import { useTranslation } from 'react-i18next'
import { Modal } from 'antd'
import React, { forwardRef, useImperativeHandle, useState } from 'react'

interface IProps {
    img: string
}

export interface IDialog {
    show(): void
    hide(): void
}

const LongDialog = forwardRef((props, ref) => {
    const [params, setParams] = useState<IProps>()
    const [show, setShow] = useState(false)
    const [t, i18n] = useTranslation()
    const hide = (): void => {
        setShow(false)
        setParams(undefined)
    }

    useImperativeHandle(ref, () => ({
        show: () => {
            setShow(true)
        },
        hide
    }))

    return (
        <Modal
            width="5.3rem"
            visible={show}
            onCancel={() => hide()}
            footer={null}
            wrapClassName="successModal"
            centered
            destroyOnClose={true}
            closable={false}
        >
            <div className="modalTitle">
                <div className="title">{t('combiningPlan.OKTitle')}</div>
                <em onClick={() => hide()}>x</em>
            </div>
            <div className="modalMain">
                <div className="content">
                    <img src={require('../img/g_plan.png')} className="img" />
                    {/* <Image height={240} width={240} src={re} className="img" /> */}
                    <div className="btn" onClick={() => hide()}>
                        {t('Confirm')}
                    </div>
                </div>
            </div>
        </Modal>
    )
})

export default LongDialog
