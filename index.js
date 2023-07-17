import 'dotenv/config'
import { CURRENCY_INFO, CURRENCY_DECIMAL, CHAIN, DEX_NAME } from '@root/helpers/constants'
import { createServer } from 'http'
import express from 'express'
import {
  verifySwapTransactionOnUniswap,
  verifyAddLiquidityTransactionOnUniswap,
} from '@root/services/uniswap-verifier.service'

const app = express()
const port = 5000
const host = 'localhost'
const server = createServer(app)
server.listen(port, () => {
  console.log(`Listening dapp: http://${host}:${port}`)
})

app.get('/api/chain/:chain/dex/:dex/swap', async (req, res) => {
  const { chain, dex } = req.params
  const { wallet, from, to, amount } = req.query
  switch (String(dex).toUpperCase()) {
    case DEX_NAME.UNI_SWAP:
      const verified = await verifySwapTransactionOnUniswap(
        String(chain).toUpperCase(),
        wallet,
        String(from).toLowerCase(),
        String(to).toLowerCase,
        String(amount)
      )
      return res.status(200).send({ verified })
    default:
      return res.status(400).send({ message: 'Invalid dex' })
  }
})

/*
const main = async () => {
  const isSwap = await verifySwapTransactionOnUniswap(
    CHAIN.ETHEREUM,
    '0x385d21fad84bdebc516f9e0367b55d09b2117fe1',
    CURRENCY_INFO.ETHEREUM.EROWAN.address,
    CURRENCY_INFO.ETHEREUM.USDT.address,
    '500'
  )
  console.log('Is swap transaction: ', isSwap)
  const isAddLiq = await verifyAddLiquidityTransactionOnUniswap(
    CHAIN.POLYGON,
    '0x064b1b2668b181a0f8837c8676e1337348c306d9',
    CURRENCY_INFO.POLYGON.WBTC.address,
    CURRENCY_INFO.POLYGON.WETH.address,
    '0.00066215'
  )
  console.log('Is add liquidity transaction: ', isAddLiq)
}

main()
*/
