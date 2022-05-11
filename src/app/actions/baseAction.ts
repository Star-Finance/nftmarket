import { Action, createAction } from 'redux-actions'

import { BASE } from '../reducers/baseReducer/baseReducer'
import { IPromise } from '../utils/request'

export const setViewWidth = (data: number): Action<number> => createAction(BASE.SET_VIEW_WIDTH, () => data)()

export const setMarketModalReviewVisble = (data: boolean): Action<boolean> => createAction(BASE.SET_MARKET_MODAL_REVIEW_VISBLE, () => data)()

export const setMarketModalCheckoutVisble = (data: boolean): Action<boolean> => createAction(BASE.SET_MARKET_MODAL_CHECKOUT_VISBLE, () => data)()

export const setComingSoonVisible = (data: boolean): Action<boolean> => createAction(BASE.SET_COMING_SOON_VISIBLE, () => data)()
