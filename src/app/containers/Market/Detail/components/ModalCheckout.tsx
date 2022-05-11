import './ModalCheckout.stylus'

import { useWeb3React } from '@web3-react/core'
import { Button, Checkbox, Modal } from 'antd'
import React, { forwardRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setMarketModalCheckoutVisble } from '@/app/actions/baseAction'
import BNB from '@/app/containers/MyNFT/Sell/img/BNB.png'
import NBP from '@/app/containers/UserSwapToken/img/nbp.png'
import { IRootState } from '@/app/reducers/RootState'
import { countUsdt } from '@/app/utils/tokens'

const PaymentToken = {
    BNB: <img src={BNB} />,
    NBP: <img src={NBP} />
}
interface IProps {
    loading: boolean
    checkout: Function
    nftInfo: any
    current_price: number
    orderUnit: string
    contractName: string
    isPC: boolean
    orderTokenPrice: number
}

const ModalCheckout = forwardRef((props: IProps, ref) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const { account, deactivate, chainId } = useWeb3React()
    const [checkoutEnable, setCheckoutEnable] = useState(false)
    const { marketModalCheckoutVisble } = useSelector((state: IRootState) => state.base)
    const { loading, checkout, nftInfo, current_price, orderUnit, isPC, contractName, orderTokenPrice } = props
    // const unitIcon = orderUnit == 'BNB' ? <img src={BNB} /> : <img src={NBP} />
    useEffect(() => {
        setCheckoutEnable(false)
    }, [dialogOpen])
    useEffect(() => {
        if (loading === false) setCheckoutEnable(false)
    }, [loading])

    const checkChange = e => {
        setCheckoutEnable(e.target.checked)
    }

    useEffect(() => {
        setDialogOpen(marketModalCheckoutVisble)
    }, [marketModalCheckoutVisble])

    const dispatch = useDispatch()
    return account ? (
        <Modal
            transitionName=""
            visible={dialogOpen}
            onCancel={() => dispatch(setMarketModalCheckoutVisble(false))}
            footer={null}
            wrapClassName="ModalCheckout"
            centered
            destroyOnClose={true}
            closable={false}
            width={900}
        >
            <div className="left">
                {isPC && <div className="nft-img" style={{ backgroundImage: `url(${nftInfo?.attachment})` }} />}
                {/* <img src={require('../img/nft.png')} /> */}
            </div>
            <div className="right">
                <div className="modalTitle">
                    <div className="title">Complete checkout</div>
                    {!isPC && <em onClick={() => setDialogOpen(false)}>x</em>}
                </div>
                <div className="modalMain">
                    {!isPC && <div className="nft-img" style={{ backgroundImage: `url(${nftInfo?.attachment})` }} />}

                    <div className="body">
                        <div className="item">
                            <div className="name">Item</div>
                            <div className="value">Subtotal</div>
                        </div>
                        <div className="item">
                            <div className="name">
                                <div className="top">{contractName}</div>
                                <div className="bottom">{nftInfo?.name}</div>
                            </div>
                            <div className="value">
                                <div className="top">
                                    {PaymentToken[orderUnit]}
                                    {current_price}
                                    {/* {nftInfo?.unit} */}
                                </div>
                                <div className="bottom">${countUsdt(current_price, orderTokenPrice, orderUnit)}</div>
                            </div>
                        </div>
                        <div className="item">
                            <div className="name">Total</div>
                            <div className="value">
                                {PaymentToken[orderUnit]}
                                {/* <img src={require('../img/eth.png')} />1 */}
                                {current_price}
                                {/* {nftInfo?.unit} */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ModalBtn">
                    <div className="btn">
                        <Button type="primary" size="large" disabled={!checkoutEnable || loading} onClick={checkout} loading={loading}>
                            Checkout
                        </Button>
                    </div>
                    {!loading && (
                        <div className="div-check">
                            <Checkbox onChange={checkChange}>By checking this box, I agree to NFTBOMB</Checkbox>
                            <a>Terms of Service</a>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    ) : null
})

export default ModalCheckout
