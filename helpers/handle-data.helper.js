import { CURRENCY_INFO } from '@root/helpers/constants'
import { defaultAbiCoder } from 'ethers/lib/utils'

export const decodeEventLogData = (currencyAddress, data) => {
  switch (currencyAddress) {
    case CURRENCY_INFO.POLYGON.MATIC.address:
      const [amount] = defaultAbiCoder.decode(['uint256', 'uint256', 'uint256', 'uint256', 'uint256'], data)
      return amount
    default:
      return defaultAbiCoder.decode(['uint256'], data)[0]
  }
}
