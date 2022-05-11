import { lazy } from 'react'

const BlingBox = lazy(() => import(/*webpackChunkName: 'BlingBox'*/ /* webpackPrefetch: true */ '../containers/Activity/BlingBox'))
const Dodo = lazy(() => import(/*webpackChunkName: 'Dodo'*/ /* webpackPrefetch: true */ '../containers/Activity/Dodo'))
const MessiBlindBox = lazy(() => import(/*webpackChunkName: 'MessiBlindBox'*/ /* webpackPrefetch: true */ '../containers/Activity/messiBlindBox'))
const BlingHome = lazy(() => import(/*webpackChunkName: 'BlingHome'*/ /* webpackPrefetch: true */ '../containers/Activity/BlingHome'))
const MessiSuccess = lazy(() => import(/*webpackChunkName: 'MessiSuccess'*/ /* webpackPrefetch: true */ '../containers/Activity/MessiSuccess'))
const MyNft = lazy(() => import(/*webpackChunkName: 'MyNft'*/ /* webpackPrefetch: true */ '../containers/Activity/MyNft'))
const MyNftDetail = lazy(() => import(/*webpackChunkName: 'MyNftDetail'*/ /* webpackPrefetch: true */ '../containers/Activity/MyNft/detail'))
const Reveser = lazy(() => import(/*webpackChunkName: 'Reveser'*/ /* webpackPrefetch: true */ '../containers/Activity/Reveser'))
const Success = lazy(() => import(/*webpackChunkName: 'Success'*/ /* webpackPrefetch: true */ '../containers/Activity/Success'))

const MarketList = lazy(() => import(/*webpackChunkName: 'MarketList'*/ /* webpackPrefetch: true */ '../containers/Market/List'))
const MarketDetail = lazy(() => import(/*webpackChunkName: 'MarketDetail'*/ /* webpackPrefetch: true */ '../containers/Market/Detail'))
const MyNFTList = lazy(() => import(/*webpackChunkName: 'MyNFTList'*/ /* webpackPrefetch: true */ '../containers/MyNFT/List'))
const MyNFTShell = lazy(() => import(/*webpackChunkName: 'MyNFTDetail'*/ /* webpackPrefetch: true */ '../containers/MyNFT/Sell'))

const UserSwapToken = lazy(() => import(/*webpackChunkName: 'UserSwapToken'*/ /* webpackPrefetch: true */ '../containers/UserSwapToken'))

const BoomList = lazy(() => import(/*webpackChunkName: 'BoomList'*/ /* webpackPrefetch: true */ '../containers/Boom/List'))
const BoomDetail = lazy(() => import(/*webpackChunkName: 'BoomDetail'*/ /* webpackPrefetch: true */ '../containers/Boom/Detail'))
const AvatarPlan = lazy(() => import(/*webpackChunkName: 'AvatarPlan'*/ /* webpackPrefetch: true */ '../containers/Activity/AvatarPlan'))
const Stake = lazy(() => import(/*webpackChunkName: 'Stake'*/ /* webpackPrefetch: true */ '../containers/Stake'))
const Profile = lazy(() => import(/*webpackChunkName: 'Profile'*/ /* webpackPrefetch: true */ '../containers/MyNFT/Profile'))

const PortalGetKey = lazy(() => import(/*webpackChunkName: 'Profile'*/ /* webpackPrefetch: true */ '../containers/Portal/GetKey'))
const PortalExcahnge = lazy(() => import(/*webpackChunkName: 'Profile'*/ /* webpackPrefetch: true */ '../containers/Portal/Exchange'))

const menuData = [
    // 活动
    {
        name: 'BlingBox',
        key: 'BlingBox',
        router: '/blingbox/:index?',
        component: BlingBox,
        exact: true
    },
    {
        name: 'Dodo',
        key: 'Dodo',
        router: '/UnusualKi',
        component: Dodo,
        exact: true
    },
    {
        name: 'MessiBlindBox',
        key: 'MessiBlindBox',
        router: '/MessiBlindBox/:index?',
        component: MessiBlindBox,
        exact: true
    },
    {
        name: 'blingHome',
        key: 'blingHome',
        router: '/blingHome',
        component: BlingHome,
        exact: true
    },
    {
        name: 'MessiSuccess',
        key: 'MessiSuccess',
        router: '/messisuccess',
        component: MessiSuccess,
        exact: true
    },
    {
        name: 'ActivityMyNft',
        key: 'ActivityMyNft',
        router: '/activity/mynft',
        component: MyNft,
        exact: true
    },
    {
        name: 'MyNftDetail',
        key: 'MyNftDetail',
        router: '/activity/mynft/detail/:id',
        component: MyNftDetail,
        exact: true
    },
    {
        name: 'Reveser',
        key: 'Reveser',
        router: '/reveser/:successId?',
        component: Reveser,
        exact: true
    },
    {
        name: 'Success',
        key: 'Success',
        router: '/success',
        component: Success,
        exact: true
    },
    // 页面
    {
        name: 'MarketList',
        key: 'MarketList',
        router: '/Market',
        component: MarketList,
        exact: true
    },
    {
        name: 'MarketDetail',
        key: 'MarketDetail',
        router: '/MarketDetail/:from/:assetId/:orderId',
        component: MarketDetail,
        exact: true
    },
    {
        name: 'MyNFTList',
        key: 'MyNFTList',
        router: '/MyNFTList',
        component: MyNFTList,
        exact: true
    },
    {
        name: 'MyNFTShell',
        key: 'MyNFTShell',
        router: '/MyNFTShell/:address/:id/:type', // :资产合约地址/:tokenID
        component: MyNFTShell,
        exact: true
    },
    {
        name: 'UserSwapToken',
        key: 'UserSwapToken',
        router: '/UserSwapToken',
        component: UserSwapToken,
        exact: true
    },
    // {
    //     name: 'BoomList',
    //     key: 'BoomList',
    //     router: '/BoomList',
    //     component: BoomList,
    //     exact: true
    // },
    {
        name: 'BoomDetail',
        key: 'BoomDetail',
        router: '/BoomDetail',
        component: BoomDetail,
        exact: true
    },
    {
        name: 'invitationRewards',
        key: 'invitationRewards',
        router: '/invitationRewards',
        component: AvatarPlan,
        exact: true
    },
    {
        name: 'stake',
        key: 'stake',
        router: '/stake',
        component: Stake,
        exact: true
    },
    {
        name: 'profile',
        key: 'profile',
        router: '/profile',
        component: Profile,
        exact: true
    },
    {
        name: 'PortalGetKey',
        key: 'PortalGetKey',
        router: '/PortalGetKey',
        component: PortalGetKey,
        exact: true
    },
    {
        name: 'PortalExcahnge',
        key: 'PortalExcahnge',
        router: '/PortalExcahnge',
        component: PortalExcahnge,
        exact: true
    }
]

export default menuData
