import { CURRENCY_CODE } from '@root/helpers/constants'
import { defaultAbiCoder } from 'ethers/lib/utils'

export const decodeEventLogData = (currencyCode, data) => {
  if (currencyCode === CURRENCY_CODE.MATIC) {
    const [amount] = defaultAbiCoder.decode(
      ['uint256', 'uint256', 'uint256', 'uint256', 'uint256'],
      data,
    )
    return amount
  }
  return defaultAbiCoder.decode(['uint256'], data)[0]
}
