import './footer.stylus'

import React from 'react'
import { useDispatch } from 'react-redux'

import { setComingSoonVisible } from '@/app/actions/baseAction'
import * as config from '@/app/utils/config'
import Icon from '@/assets/icons'

export default (): React.ReactElement => {
    const dispatch = useDispatch()

    const addToken = async (): Promise<void> => {
        const { ethereum } = window
        const tokenAddress = config.nbp
        const tokenSymbol = 'NBP'
        const tokenDecimals = 18
        const tokenImage = 'https://nftbomb.org/metadata/rare/128x128.png'

        try {
            const wasAdded = await ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: tokenAddress,
                        symbol: tokenSymbol,
                        decimals: tokenDecimals,
                        image: tokenImage
                    }
                }
            })

            if (wasAdded) {
                console.log('Thanks for your interest!')
            } else {
                console.log('Your loss!')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="page-footer">
            <div className="links">
                <dl>
                    <dt>Asset</dt>
                    <dd>
                        <span onClick={() => dispatch(setComingSoonVisible(true))}>IP Asset</span>
                    </dd>
                    <dd>
                        <span onClick={() => dispatch(setComingSoonVisible(true))}>Native Artworks</span>
                    </dd>
                    <dd>
                        <span onClick={() => dispatch(setComingSoonVisible(true))}>Financial Asset</span>
                    </dd>
                    <dd>
                        <span onClick={() => dispatch(setComingSoonVisible(true))}>Metaverse Asset</span>
                    </dd>
                    <dd>
                        <span onClick={() => addToken()}>Add BSC Network</span>
                    </dd>
                </dl>
                <dl>
                    <dt>Learn</dt>
                    <dd>
                        <a href="https://www.nftbomb.org/" target="_blank" rel="noreferrer">
                            NFTBomb
                        </a>
                    </dd>
                    <dd>
                        <a href="https://nftbomb-1.gitbook.io/nftbomb/" target="_blank" rel="noreferrer">
                            Docs
                        </a>
                    </dd>
                    <dd>
                        <a href="https://nftbomb-1.gitbook.io/nftbomb-whitepaper/" target="_blank" rel="noreferrer">
                            WhitePaper
                        </a>
                    </dd>
                    <dd>
                        <a href="https://t.me/NFTBombGlobal_Ann" target="_blank" rel="noreferrer">
                            Announcement
                        </a>
                    </dd>
                </dl>
                <dl>
                    <dt>Community</dt>
                    <dd className="icons-link">
                        <a href="https://www.facebook.com/NFTBomb-104941558455108/" target="_blank" rel="noreferrer">
                            <Icon name="facebook" />
                        </a>
                        <a href="https://twitter.com/NFTBomb/" target="_blank" rel="noreferrer">
                            <Icon name="twitter" />
                        </a>
                        <a href="https://t.me/NFTBombEn/" target="_blank" rel="noreferrer">
                            <Icon name="telegram" />
                        </a>
                        <a href="https://discord.com/invite/edFMum6TBu" target="_blank" rel="noreferrer">
                            <Icon name="discord" />
                        </a>
                        <a href="https://nftbomb-97786.medium.com/" target="_blank" rel="noreferrer">
                            <Icon name="medium" />
                        </a>
                    </dd>
                    <dd>
                        <a href="mailto:nftbomb@nftbomb.org">Email：nftbomb@nftbomb.org</a>
                    </dd>
                </dl>
            </div>
        </div>
    )
}
