import 'dotenv/config'
import { CURRENCY_INFO, CURRENCY_DECIMAL, CHAIN } from '@root/helpers/constants'
import { createServer } from 'http'
import express from 'express'
import {
  verifySwapTransactionOnUniswap,
  verifyAddLiquidityTransactionOnUniswap,
} from '@root/services/uniswap-verifier.service'
import { ethers } from 'ethers'

const app = express()
const port = 5000
const host = 'localhost'
const server = createServer(app)
server.listen(port, () => {
  console.log(`Listening dapp: http://${host}:${port}`)
})

const main = async () => {
  const isSwap = await verifySwapTransactionOnUniswap(
    CHAIN.ETHEREUM,
    '0x385d21fad84bdebc516f9e0367b55d09b2117fe1',
    CURRENCY_INFO.ETHEREUM.EROWAN.address,
    CURRENCY_INFO.ETHEREUM.USDT.address,
    '500'
  )
  console.log('Is swap transaction: ', isSwap)
  // const isAddLiq = await verifyAddLiquidityTransactionOnUniswap(
  //   CHAIN.POLYGON,
  //   "0x064b1b2668b181a0f8837c8676e1337348c306d9",
  //   CURRENCY_INFO.POLYGON.WBTC.address,
  //   CURRENCY_INFO.POLYGON.WETH.address,
  //   "0.00066215"
  // );
  // console.log("Is add liquidity transaction: ", isAddLiq);
}

// main()

// const provider = new ethers.providers.JsonRpcProvider(
//   process.env.ETHEREUM_RPC_URL,
// )
// provider
//   .getTransaction(
//     '0xe95c1be02d8f733d1ac09a57c6cccfcf514a778d980dc64267788837b04e1f6e',
//   )
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err))

// provider
//   .getBalance(
//     '0x9595eeAF82907cE461842E533427336d27484A0A',
//     '0x23adc20af86187428a4088318d00487001a4e31c5efa0e40896d6ccfde4970e6',
//   )
//   .then((res) => console.log(res))
