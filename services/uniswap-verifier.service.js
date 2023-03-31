import { DEX_ADDRESS, EVENT_TOPIC, DEX_NAME } from '@root/helpers/constants'
import {
  verifySwapTransactionOnDex,
  verifyAddLiquidityTransactionOnDex,
} from '@root/services/common-verifier.service'

export const verifySwapTransactionOnUniswap = async (
  chain,
  walletAddress,
  fromCurrencyCode,
  toCurrencyCode,
  amount,
) => {
  const uniswapDexAddresses = [DEX_ADDRESS[chain].UNISWAP_UNIVERSAL_ROUTER]
  const swapTopics = [
    EVENT_TOPIC.UNI_SWAP.SWAP_V2,
    EVENT_TOPIC.UNI_SWAP.SWAP_V3,
  ]
  return verifySwapTransactionOnDex(
    chain,
    walletAddress,
    fromCurrencyCode,
    toCurrencyCode,
    amount,
    uniswapDexAddresses,
    swapTopics,
  )
}

export const verifyAddLiquidityTransactionOnUniswap = async (
  chain,
  walletAddress,
  firstCurrencyCode,
  secondCurrencyCode,
  amount,
) => {
  const uniswapDexAddresses = [
    DEX_ADDRESS[chain].UNISWAP_V3_NFT_POSITION_MANAGER,
  ]
  const addLiquidityTopics = [EVENT_TOPIC.UNI_SWAP.INCREASE_LIQUIDITY_V3]
  return verifyAddLiquidityTransactionOnDex(
    chain,
    walletAddress,
    firstCurrencyCode,
    secondCurrencyCode,
    amount,
    uniswapDexAddresses,
    addLiquidityTopics,
  )
}
