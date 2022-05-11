import * as ethers from 'ethers'
import { useEffect, useMemo, useState } from 'react'

import abi from '@/abi/KibombRare_abi.json'
import Contract from '@/app/connectors/contract'

export default async (address: string, account?: string | null | undefined): Promise<ethers.ethers.Contract> => {
    return account ? await Contract(address, abi, account) : await Contract(address, abi)
}
