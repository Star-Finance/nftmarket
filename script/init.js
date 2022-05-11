/* eslint-disable @typescript-eslint/no-var-requires */
const env = require('dotenv')
const fs = require('fs')
const path = require('path')
const res = env.config({ path: path.join(__dirname, `../.env.${process.env.NODE_ENV}`) })
const str = `export const nft1155 = '${res.parsed.nft1155}'
export const nft721 = '${res.parsed.nft721}'
export const MerkelDropWhiteListV2 = '${res.parsed.MerkelDropWhiteListV2}'
export const blindBoxContract = '${res.parsed.blindBoxContract}'
export const meixiContract = '${res.parsed.meixiContract}'
export const nft721Contract = '${res.parsed.nft721Contract}'
export const nft721number1155 = '${res.parsed.nft721number1155}'
export const nbp = '${res.parsed.nbp}'
export const nftb = '${res.parsed.nftb}'
export const token_swaper_address = '${res.parsed.token_swaper_address}'
export const KibombMarketV3Upgradeable = '${res.parsed.KibombMarketV3Upgradeable}'
export const KibombNft721Role = '${res.parsed.KibombNft721Role}'
export const openBlingBoxTime = '${res.parsed.openBlingBoxTime}'
export const baseService = '${res.parsed.BASIC_SERVICE}'
export const dodo = '${res.parsed.dodo}'
export const dodo721 = '${res.parsed.dodo721}'
export const dodo1155 = '${res.parsed.dodo1155}'
export const dodoAsset = '${res.parsed.dodoAsset}'
export const gateAsset = '${res.parsed.gateAsset}'
export const baseService2 = '${res.parsed.BASIC_SERVICE2}'
export const Messi1155 = '${res.parsed.Messi1155}'
export const RareKiSocialContract = '${res.parsed.RareKiSocialContract}'
export const nft721BallGameStar = '${res.parsed.nft721BallGameStar}'
export const invitationActivityService = '${res.parsed.invitationActivityService}'
export const boomContract = '${res.parsed.boomContract}'
export const vault = '${res.parsed.vault}'
export const merge = '${res.parsed.merge}'
export const instrusionSwapperContract = '${res.parsed.instrusionSwapperContract}'
export const nft721TicketContract = '${res.parsed.nft721TicketContract}'
export const nft721PortalContract = '${res.parsed.nft721PortalContract}'
export const env = '${process.env.NODE_ENV}'
`
fs.writeFileSync(path.join(__dirname, '../src/app/utils/config.ts'), str)
