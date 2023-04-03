import { callInfuraApi } from '@root/helpers/axios.helper'
import { decodeEventLogData } from '@root/helpers/handle-data.helper'
import { isTransactionOnDex, isSpecifyTransaction } from '@root/helpers/common.helper'
import { EVENT_TOPIC, CURRENCY_DECIMAL, INFURA_METHOD, CURRENCY_INFO } from '@root/helpers/constants'
import { ethers } from 'ethers'

const isSatisfiedTransactionOnDex = async (chain, txHash, dexAddresses, topics) => {
  const txReceipt = await callInfuraApi(chain, INFURA_METHOD.GET_TX_RECEIPT, txHash)
  if (!isTransactionOnDex(txReceipt, dexAddresses)) {
    console.log('Transaction is not on dex')
    return false
  }
  if (!isSpecifyTransaction(txReceipt, topics)) {
    console.log('Transaction is not satisfied')
    return false
  }
  return true
}

const getFromTopicSetsBaseOnCurrencyAddr = (fromCurrencyAddress, walletAddress) => {
  switch (fromCurrencyAddress) {
    case CURRENCY_INFO.POLYGON.MATIC.address:
      return [
        EVENT_TOPIC.TRANSFER_MATIC,
        ethers.utils.hexZeroPad(fromCurrencyAddress, 32),
        ethers.utils.hexZeroPad(walletAddress, 32),
      ]
    default:
      return [EVENT_TOPIC.TRANSFER_ERC20, ethers.utils.hexZeroPad(walletAddress, 32)]
  }
}

const getToTopicSetsBaseOnCurrencyAddr = (toCurrencyAddress, walletAddress) => {
  switch (toCurrencyAddress) {
    case CURRENCY_INFO.POLYGON.MATIC.address:
      return [
        EVENT_TOPIC.TRANSFER_MATIC,
        ethers.utils.hexZeroPad(toCurrencyAddress, 32),
        null,
        ethers.utils.hexZeroPad(walletAddress, 32),
      ]
    default:
      return [EVENT_TOPIC.TRANSFER_ERC20, null, ethers.utils.hexZeroPad(walletAddress, 32)]
  }
}

const getTransactionFromUserByCondition = async (
  chain,
  walletAddress,
  fromCurrencyAddress,
  amount,
  startBlock = 'earliest',
  endBlock = 'latest'
) => {
  let topicSets = getFromTopicSetsBaseOnCurrencyAddr(fromCurrencyAddress, walletAddress)
  const filter = {
    address: fromCurrencyAddress,
    topics: topicSets,
    fromBlock: startBlock,
    toBlock: endBlock,
  }
  const logs = await callInfuraApi(chain, INFURA_METHOD.GET_LOGS, filter)
  if (!amount) return logs
  return logs.filter((log) =>
    ethers.utils
      .parseUnits(String(amount), CURRENCY_DECIMAL[chain][fromCurrencyAddress])
      .eq(decodeEventLogData(fromCurrencyAddress, log.data))
  )
}

const getTransactionToUserByCondition = async (
  chain,
  walletAddress,
  toCurrencyAddress,
  startBlock = 'earliest',
  endBlock = 'latest'
) => {
  let topicSets = getToTopicSetsBaseOnCurrencyAddr(toCurrencyAddress, walletAddress)
  const filter = {
    address: toCurrencyAddress,
    topics: topicSets,
    fromBlock: startBlock,
    toBlock: endBlock,
  }
  return callInfuraApi(chain, INFURA_METHOD.GET_LOGS, filter)
}

export const verifySwapTransactionOnDex = async (
  chain,
  walletAddress,
  fromCurrencyAddr,
  toCurrencyAddr,
  amount,
  dexAddresses,
  swapTopics
) => {
  const time = Date.now()
  // Get event transfer from user
  const eventTransferFromUser = await getTransactionFromUserByCondition(chain, walletAddress, fromCurrencyAddr, amount)
  if (eventTransferFromUser?.length === 0) {
    return false
  }
  console.log('Event transfer from user: ', eventTransferFromUser)

  // Get event transfer to user
  const startBlock = eventTransferFromUser[0].blockNumber
  const endBlock = eventTransferFromUser[eventTransferFromUser.length - 1].blockNumber
  const eventTransferToUser = await getTransactionToUserByCondition(
    chain,
    walletAddress,
    toCurrencyAddr,
    startBlock,
    endBlock
  )
  if (eventTransferToUser?.length === 0) {
    return false
  }
  console.log('Event transfer to user: ', eventTransferToUser)

  // Get transaction hashes
  const fromTransactionHashes = eventTransferFromUser.map((log) => log.transactionHash)
  const toTransactionHashes = eventTransferToUser.map((log) => log.transactionHash)
  console.log(fromTransactionHashes)
  console.log(toTransactionHashes)
  const matchTxHashes = toTransactionHashes.filter((hash) => fromTransactionHashes.includes(hash))
  console.log(matchTxHashes)

  // Verify swap transaction
  // eslint-disable-next-line no-restricted-syntax
  for (const txHash of matchTxHashes) {
    // eslint-disable-next-line no-await-in-loop
    const verified = await isSatisfiedTransactionOnDex(chain, txHash, dexAddresses, swapTopics)
    if (verified) {
      console.log('All time: ', Date.now() - time)
      return true
    }
  }
  console.log('All time: ', Date.now() - time)
  return false
}

export const verifyAddLiquidityTransactionOnDex = async (
  chain,
  walletAddress,
  firstCurrency,
  secondCurrency,
  amount,
  dexAddresses,
  addLiquidityTopics
) => {
  const time = Date.now()
  // Get event transfer first currency from user
  const eventTransferFirstCurrency = await getTransactionFromUserByCondition(
    chain,
    walletAddress,
    firstCurrency,
    amount
  )
  if (eventTransferFirstCurrency?.length === 0) {
    return false
  }
  console.log('Event transfer first currency: ', eventTransferFirstCurrency)

  // Get event transfer second currency from user
  const startBlock = eventTransferFirstCurrency[0].blockNumber
  const endBlock = eventTransferFirstCurrency[eventTransferFirstCurrency.length - 1].blockNumber
  const eventTransferSecondCurrency = await getTransactionFromUserByCondition(
    chain,
    walletAddress,
    secondCurrency,
    null,
    startBlock,
    endBlock
  )
  if (eventTransferSecondCurrency?.length === 0) {
    return false
  }
  console.log('Event transfer second currency: ', eventTransferSecondCurrency)

  // Get transaction hashes
  const firstCurrencyTxHashes = eventTransferFirstCurrency.map((log) => log.transactionHash)
  const secondCurrencyTxHashes = eventTransferSecondCurrency.map((log) => log.transactionHash)
  console.log(firstCurrencyTxHashes)
  console.log(secondCurrencyTxHashes)
  const matchTxHashes = secondCurrencyTxHashes.filter((hash) => firstCurrencyTxHashes.includes(hash))
  console.log(matchTxHashes)

  // Verify swap transaction
  // eslint-disable-next-line no-restricted-syntax
  for (const txHash of matchTxHashes) {
    // eslint-disable-next-line no-await-in-loop
    const verified = await isSatisfiedTransactionOnDex(chain, txHash, dexAddresses, addLiquidityTopics)
    if (verified) {
      console.log('All time: ', Date.now() - time)
      return true
    }
  }
  console.log('All time: ', Date.now() - time)
  return false
}
