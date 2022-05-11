import './list.stylus'

import { useWeb3React } from '@web3-react/core'
import { getQueryStringByName } from 'mobile-browser'
import React, { useEffect, useState } from 'react'

import MyCard from '@/app/components/MyCard'
import useMessi721Contract from '@/app/hooks/useMessi721Contract'
import useNft721RoleContract from '@/app/hooks/useNft721RoleContract'
import { useDodoContract, useGateContract } from '@/app/hooks/useNft721RoleDodoContract'
import useNft1155Contract from '@/app/hooks/useNft1155Contract'
import { GetNFTInfo, GetNFTInfos } from '@/app/service/marketServer'
import * as config from '@/app/utils/config'

interface IList {
    tokenID: number
    ownerCount: number
    count?: number
    info: {
        asset_id: number
        name: string
        content: string
        attachment: string
        contract: string
        owner: string
        category_id: string
        current_price: string
        unit: string
        create_time: string
        author_address: string
        supply_num: number
    }
}

export default (): React.ReactElement => {
    const { account } = useWeb3React()
    const address = getQueryStringByName('address') || null

    const nft1155Contract = useNft1155Contract()
    const [list1155, setList1155] = useState<IList[]>([])
    const [list721, setList721] = useState<IList[]>([])
    const nft721RoleContract = useNft721RoleContract()

    const [dodoAsset, setDodoAsset] = useState<IList[]>([])
    const dodoContract = useDodoContract()

    const [gateAsset, setGateAsset] = useState<IList[]>([])
    const gateContract = useGateContract()

    const [messi721, setMessi721] = useState<IList[]>([])
    const messi721Contract = useMessi721Contract()

    useEffect(() => {
        const fetch = async (): Promise<void> => {
            if (!nft1155Contract || !account) return
            const arr: IList[] = []
            const tokenID: number[] = []
            const ownerCount: number[] = []
            for (let i = 1; i < 8; i++) {
                const res: number = await nft1155Contract.balanceOf(address || account, i)

                if (res > 0) {
                    // const nftInfo: any = await GetNFTInfo({ token_id: i, contract: config.nft1155 })
                    // arr.push({
                    //     tokenID: i,
                    //     info: nftInfo.data.data.assetInfo,
                    //     ownerCount: +res
                    // })
                    tokenID.push(i)
                    ownerCount.push(+res)
                }
            }

            if (tokenID.length) {
                const infos = await GetNFTInfos({ token_ids: tokenID.join(','), contract: config.nft1155 })
                for (let i = 0; i < infos?.data?.data?.assetInfos.length; i++) {
                    const item = infos?.data?.data?.assetInfos[i]
                    arr.push({
                        tokenID: tokenID[i],
                        info: item,
                        ownerCount: ownerCount[i]
                    })
                }
            }

            setList1155(arr)
        }
        fetch()
    }, [nft1155Contract, account, address])

    useEffect(() => {
        const fetch = async (): Promise<void> => {
            if (!nft721RoleContract || !account) return

            const arr: IList[] = []
            const balance: number = await nft721RoleContract.balanceOf(address || account)
            const tokenID: number[] = []

            for (let i = 0; i < balance; i++) {
                const res = await nft721RoleContract.tokenOfOwnerByIndex(address || account, i)
                if (res > 1) {
                    // const nftInfo: any = await GetNFTInfo({ token_id: +res, contract: config.KibombNft721Role })
                    // arr.push({
                    //     tokenID: +res,
                    //     info: nftInfo.data.data.assetInfo,
                    //     ownerCount: 1,
                    //     count: 1
                    // })
                    tokenID.push(+res)
                }
            }

            if (tokenID.length) {
                const infos = await GetNFTInfos({ token_ids: tokenID.join(','), contract: config.KibombNft721Role })
                for (let i = 0; i < infos?.data?.data?.assetInfos.length; i++) {
                    const item = infos?.data?.data?.assetInfos[i]
                    arr.push({
                        tokenID: tokenID[i],
                        info: item,
                        ownerCount: 1,
                        count: 1
                    })
                }
            }

            setList721(arr)
        }
        fetch()
    }, [nft721RoleContract, account, address])

    useEffect(() => {
        const fetch = async (): Promise<void> => {
            if (!dodoContract || !account) return

            const arr: IList[] = []
            const balance = await dodoContract.balanceOf(address || account)
            const tokenID: number[] = []

            for (let i = 0; i < balance; i++) {
                const tokenId = await dodoContract.tokenOfOwnerByIndex(address || account, i)
                // const nftInfo: any = await GetNFTInfo({ token_id: +tokenId, contract: config.dodoAsset })
                // arr.push({
                //     tokenID: +tokenId,
                //     info: nftInfo.data.data.assetInfo,
                //     ownerCount: 1,
                //     count: 1
                // })
                tokenID.push(+tokenId)
            }

            if (tokenID.length) {
                const infos = await GetNFTInfos({ token_ids: tokenID.join(','), contract: config.dodoAsset })
                for (let i = 0; i < infos?.data?.data?.assetInfos.length; i++) {
                    const item = infos?.data?.data?.assetInfos[i]
                    arr.push({
                        tokenID: tokenID[i],
                        info: item,
                        ownerCount: 1,
                        count: 1
                    })
                }
            }

            setDodoAsset(arr)
        }
        fetch()
    }, [dodoContract, account, address])

    useEffect(() => {
        const fetch = async (): Promise<void> => {
            if (!gateContract || !account) return

            const arr: IList[] = []
            const balance = await gateContract.balanceOf(address || account)
            const tokenID: number[] = []

            for (let i = 0; i < balance; i++) {
                const tokenId = await gateContract.tokenOfOwnerByIndex(address || account, i)
                // const nftInfo: any = await GetNFTInfo({ token_id: +tokenId, contract: config.gateAsset })
                // arr.push({
                //     tokenID: +tokenId,
                //     info: nftInfo.data.data.assetInfo,
                //     ownerCount: 1,
                //     count: 1
                // })
                tokenID.push(+tokenId)
            }

            if (tokenID.length) {
                const infos = await GetNFTInfos({ token_ids: tokenID.join(','), contract: config.gateAsset })
                for (let i = 0; i < infos?.data?.data?.assetInfos.length; i++) {
                    const item = infos?.data?.data?.assetInfos[i]
                    arr.push({
                        tokenID: tokenID[i],
                        info: item,
                        ownerCount: 1,
                        count: 1
                    })
                }
            }

            setGateAsset(arr)
        }
        fetch()
    }, [gateContract, account, address])

    useEffect(() => {
        const fetch = async (): Promise<void> => {
            if (!messi721Contract || !account) return

            const arr: IList[] = []
            const balance: number = await messi721Contract.balanceOf(address || account)
            const tokenID: number[] = []

            for (let i = 0; i < balance; i++) {
                const res = await messi721Contract.tokenOfOwnerByIndex(address || account, i)
                if (res > 1) {
                    tokenID.push(+res)
                }
            }

            if (tokenID.length) {
                const infos = await GetNFTInfos({ token_ids: tokenID.join(','), contract: config.nft721BallGameStar })
                for (let i = 0; i < infos?.data?.data?.assetInfos.length; i++) {
                    const item = infos?.data?.data?.assetInfos[i]
                    arr.push({
                        tokenID: tokenID[i],
                        info: item,
                        ownerCount: 1,
                        count: 1
                    })
                }
            }

            setMessi721(arr)
        }
        fetch()
    }, [messi721Contract, account, address])

    return (
        <div className="main">
            {messi721.map((item, index) => {
                if (!item.info) return null
                return (
                    <div className="item" key={index}>
                        <MyCard
                            assetAddress={config.nft721BallGameStar}
                            tokenId={item.tokenID}
                            src={item.info.attachment}
                            // type={'change'}
                            owned={item.info.owner}
                            name={item.info.name}
                            total={item.info.supply_num}
                            number={item.ownerCount}
                            jump={`/MarketDetail/sell/${item.info.asset_id}/0`}
                            assetType={'721'}
                        />
                    </div>
                )
            })}
            {dodoAsset.map((item, index) => {
                if (!item.info) return null
                return (
                    <div className="item" key={index}>
                        <MyCard
                            assetAddress={config.dodoAsset}
                            tokenId={item.tokenID}
                            src={item.info.attachment}
                            // type={'change'}
                            owned={item.info.owner}
                            name={item.info.name}
                            total={item.info.supply_num}
                            number={item.ownerCount}
                            jump={`/MarketDetail/sell/${item.info.asset_id}/0`}
                            assetType={'721'}
                        />
                    </div>
                )
            })}
            {gateAsset.map((item, index) => {
                if (!item.info) return null
                return (
                    <div className="item" key={index}>
                        <MyCard
                            assetAddress={config.gateAsset}
                            tokenId={item.tokenID}
                            src={item.info.attachment}
                            // type={'change'}
                            owned={item.info.owner}
                            name={item.info.name}
                            total={item.info.supply_num}
                            number={item.ownerCount}
                            jump={`/MarketDetail/sell/${item.info.asset_id}/0`}
                            assetType={'721'}
                        />
                    </div>
                )
            })}
            {list1155.map((item, index) => {
                if (!item.info) return null
                return (
                    <div className="item" key={index}>
                        <MyCard
                            assetAddress={config.nft1155}
                            tokenId={item.tokenID}
                            src={item.info.attachment}
                            // type={'change'}
                            owned={item.info.owner}
                            name={item.info.name}
                            total={item.info.supply_num}
                            number={item.ownerCount}
                            jump={`/MarketDetail/sell/${item.info.asset_id}/0`}
                            assetType={'1155'}
                        />
                    </div>
                )
            })}
            {list721.map((item, index) => {
                if (!item.info) return null
                return (
                    <div className="item" key={index}>
                        <MyCard
                            assetAddress={config.KibombNft721Role}
                            tokenId={item.tokenID}
                            src={item.info.attachment}
                            // type={'change'}
                            owned={item.info.owner}
                            name={item.info.name}
                            total={item.count || 1}
                            number={item.ownerCount}
                            jump={`/MarketDetail/sell/${item.info.asset_id}/0`}
                            assetType={'721'}
                        />
                    </div>
                )
            })}
        </div>
    )
}
