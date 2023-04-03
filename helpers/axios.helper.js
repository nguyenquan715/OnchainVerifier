import axios from 'axios'
import { RPC_URL } from '@root/helpers/constants'

export const callInfuraApi = async (chain, method, filter) => {
  const params = {
    jsonrpc: '2.0',
    method,
    id: 1,
    params: [filter],
  }
  const endpoint = RPC_URL[chain]
  const response = await axios.post(endpoint, params)
  if (!response?.data?.result) {
    throw new Error(`Request to Infura RPC failed: ${JSON.stringify(response?.data?.error)}`)
  }
  console.log(response.data)
  return response.data.result
}
