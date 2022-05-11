import * as ethers from 'ethers'

import abi from '@/abi/KibombNft721Role_abi.json'
import Contract from '@/app/connectors/contract'

export default async (address: string, account?: string | null | undefined): Promise<ethers.ethers.Contract> => {
    // return await Contract(address, abi)
    return account ? await Contract(address, abi, account) : await Contract(address, abi)
}
