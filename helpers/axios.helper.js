import axios from 'axios'
import { RPC_URL } from '@root/helpers/constants'

const nftApiEndpoint = 'https://nft.api.infura.io'
const Auth = Buffer.from(`${process.env.INFURA_API_KEY}:${process.env.INFURA_API_KEY_SECRET}`).toString('base64')

export const callInfuraApi = async (chain, method, filter) => {
  const params = {
    jsonrpc: '2.0',
    method,
    id: 1,
    params: filter ? [filter] : [],
  }
  const endpoint = RPC_URL[chain]
  const response = await axios.post(endpoint, params)
  if (!response?.data?.result) {
    return Promise.reject(`Request to Infura RPC failed: ${JSON.stringify(response?.data?.error)}`)
  }
  return response.data.result
}

export const getAllCollectionsOfUser = async (chainId, walletAddress) => {
  const endpoint = `${nftApiEndpoint}/networks/${chainId}/accounts/${walletAddress}/assets/nfts?cursor=eyJhbGciOiJIUzI1NiJ9.ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpkWE4wYjIxUVlYSmhiWE1pT25zaWQyRnNiR1YwUVdSa2NtVnpjeUk2SWpCNE56QmxNV0U0TnpNME16TmlOR1V5WmpCbVlUbGxaV1ZsT0RRNU9XVTVZek0zTldJd05UTTBZU0o5TENKclpYbHpJanBiSWpFMk5UUTNOVEU1TlRZdU5ERTNJbDBzSW5kb1pYSmxJanA3SW05M2JtVnlYMjltSWpvaU1IZzNNR1V4WVRnM016UXpNMkkwWlRKbU1HWmhPV1ZsWldVNE5EazVaVGxqTXpjMVlqQTFNelJoSW4wc0lteHBiV2wwSWpveE1EQXNJbTltWm5ObGRDSTZNQ3dpYjNKa1pYSWlPbHRkTENKa2FYTmhZbXhsWDNSdmRHRnNJanBtWVd4elpTd2lkRzkwWVd3aU9qRXdOeXdpY0dGblpTSTZNU3dpZEdGcGJFOW1abk5sZENJNk1Td2lhV0YwSWpveE5qZ3hNRGszTURNM2ZRLjBIU0p5aGRudkw2OU1tbV8tR0NoOVVuWTRJaWtvdWVSUWVXUENoX3Y2Y1U.MOjbL6lXVZa6DeRdzQhA_xTuMF6TUMrrkzMyYAwNkX0`
  const response = await axios.get(endpoint, {
    headers: { Authorization: `Basic ${Auth}` },
  })
  return response
}
