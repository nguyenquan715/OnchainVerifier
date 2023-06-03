import { id } from 'ethers/lib/utils'

export const CHAIN = Object.freeze({
  POLYGON: 'POLYGON',
  ETHEREUM: 'ETHEREUM',
})

export const DEX_NAME = Object.freeze({
  UNI_SWAP: 'UNI_SWAP',
  SUSHI_SWAP: 'SUSHI_SWAP',
  PANCAKE_SWAP: 'PANCAKE_SWAP',
})

export const INFURA_METHOD = Object.freeze({
  GET_LOGS: 'eth_getLogs',
  GET_TX_RECEIPT: 'eth_getTransactionReceipt',
  GET_BALANCE: 'eth_getBalance',
  GET_BLOCK_NUMBER: 'eth_blockNumber',
})

export const RPC_URL = Object.freeze({
  [CHAIN.POLYGON]: process.env.POLYGON_RPC_URL,
  [CHAIN.ETHEREUM]: process.env.ETHEREUM_RPC_URL,
})

export const CONFIRMATION_BLOCK = Object.freeze({
  [CHAIN.POLYGON]: 500,
  [CHAIN.ETHEREUM]: 15,
})

export const EVENT_TOPIC = Object.freeze({
  TRANSFER_ERC20: id('Transfer(address,address,uint256)'),
  TRANSFER_MATIC: '0xe6497e3ee548a3372136af2fcb0696db31fc6cf20260707645068bd3fe97f3c4',
  [DEX_NAME.UNI_SWAP]: {
    SWAP_V2: id('Swap(address,uint256,uint256,uint256,uint256,address)'),
    SWAP_V3: id('Swap(address,address,int256,int256,uint160,uint128,int24)'),
    INCREASE_LIQUIDITY_V3: id('IncreaseLiquidity(uint256,uint128,uint256,uint256)'),
  },
})

export const CURRENCY_INFO = Object.freeze({
  [CHAIN.POLYGON]: {
    MATIC: {
      address: '0x0000000000000000000000000000000000001010',
      decimal: 18,
    },
    USDT: {
      address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      decimal: 6,
    },
    USDC: {
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      decimal: 6,
    },
    WMATIC: {
      address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
      decimal: 18,
    },
    UNI: {
      address: '0xb33eaad8d922b1083446dc23f610c2567fb5180f',
      decimal: 18,
    },
    SUIBG: {
      address: '0xF53343233359E700e83Ba797f3b9D0d7dfd27138',
      decimal: 18,
    },
    SAND: {
      address: '0xBbba073C31bF03b8ACf7c28EF0738DeCF3695683',
      decimal: 18,
    },
    WETH: {
      address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      decimal: 18,
    },
    WBTC: {
      address: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
      decimal: 8,
    },
    MDXN: {
      address: '0x47DD60FA40A050c0677dE19921Eb4cc512947729',
      decimal: 18,
    },
  },
  [CHAIN.ETHEREUM]: {
    ETH: {
      address: '0x0000000000000000000000000000000000000000',
      decimal: 18,
    },
    USDC: {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      decimal: 6,
    },
    WETH: {
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      decimal: 18,
    },
    USDT: {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      decimal: 6,
    },
    EROWAN: {
      address: '0x07baC35846e5eD502aA91AdF6A9e7aA210F2DcbE',
      decimal: 18,
    },
  },
})

export const CURRENCY_DECIMAL = Object.freeze({
  [CHAIN.POLYGON]: Object.values(CURRENCY_INFO.POLYGON).reduce((obj, { address, decimal }) => {
    obj[address] = decimal
    return obj
  }, {}),
  [CHAIN.ETHEREUM]: Object.values(CURRENCY_INFO.ETHEREUM).reduce((obj, { address, decimal }) => {
    obj[address] = decimal
    return obj
  }, {}),
})

export const DEX_ADDRESS = Object.freeze({
  [CHAIN.POLYGON]: {
    UNISWAP_UNIVERSAL_ROUTER: '0x4c60051384bd2d3c01bfc845cf5f4b44bcbe9de5'.toLowerCase(),
    UNISWAP_V3_NFT_POSITION_MANAGER: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88'.toLowerCase(),
  },
  [CHAIN.ETHEREUM]: {
    UNISWAP_UNIVERSAL_ROUTER: '0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b'.toLowerCase(),
    UNISWAP_V3_NFT_POSITION_MANAGER: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88'.toLowerCase(),
  },
})
