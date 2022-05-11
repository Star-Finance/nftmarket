import produce from 'immer'

import { errorHandle } from '../../utils'

export enum BASE {
    SET_VIEW_WIDTH = 'SET_VIEW_WIDTH',
    SET_MARKET_MODAL_REVIEW_VISBLE = 'SET_MARKET_MODAL_REVIEW_VISBLE',
    SET_MARKET_MODAL_CHECKOUT_VISBLE = 'SET_MARKET_MODAL_CHECKOUT_VISBLE',
    SET_COMING_SOON_VISIBLE = 'SET_COMING_SOON_VISIBLE'
}

export interface IBaseState {
    viewWidth: number
    marketModalReviewVisble: boolean
    marketModalCheckoutVisble: boolean
    comingSoonVisible: boolean
}

export const baseState: IBaseState = {
    viewWidth: document.body.clientWidth,
    marketModalReviewVisble: false,
    marketModalCheckoutVisble: false,
    comingSoonVisible: false
}

export default {
    [BASE.SET_VIEW_WIDTH]: {
        next: produce((draft: IBaseState, action: { payload: number }) => {
            draft.viewWidth = action.payload
        }),
        throw: (state, action) => errorHandle(state, action)
    },
    [BASE.SET_MARKET_MODAL_REVIEW_VISBLE]: {
        next: produce((draft: IBaseState, action: { payload: boolean }) => {
            draft.marketModalReviewVisble = action.payload
        }),
        throw: (state, action) => errorHandle(state, action)
    },
    [BASE.SET_MARKET_MODAL_CHECKOUT_VISBLE]: {
        next: produce((draft: IBaseState, action: { payload: boolean }) => {
            draft.marketModalCheckoutVisble = action.payload
        }),
        throw: (state, action) => errorHandle(state, action)
    },
    [BASE.SET_COMING_SOON_VISIBLE]: {
        next: produce((draft: IBaseState, action: { payload: boolean }) => {
            draft.comingSoonVisible = action.payload
        }),
        throw: (state, action) => errorHandle(state, action)
    }
}
