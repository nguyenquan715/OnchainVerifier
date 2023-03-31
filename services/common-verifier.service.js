import { callInfuraApi } from '@root/helpers/axios.helper'
import { decodeEventLogData } from '@root/helpers/handle-data.helper'
import {
  isTransactionOnDex,
  isSpecifyTransaction,
} from '@root/helpers/common.helper'
import {
  EVENT_TOPIC,
  CURRENCY_ADDRESS,
  CURRENCY_DECIMAL,
  CURRENCY_CODE,
} from '@root/helpers/constants'
import { ethers } from 'ethers'

export const isSatisfiedTransactionOnDex = async (
  chain,
  txHash,
  dexAddresses,
  topics,
) => {
  const txReceipt = await callInfuraApi(
    chain,
    'eth_getTransactionReceipt',
    txHash,
  )
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

export const getTransactionFromUserByCondition = async (
  chain,
  walletAddress,
  fromCurrencyCode,
  amount,
  startBlock = 'earliest',
  endBlock = 'latest',
) => {
  let topicSets = [
    EVENT_TOPIC.TRANSFER_ERC20,
    ethers.utils.hexZeroPad(walletAddress, 32),
  ]
  const filter = {
    address: CURRENCY_ADDRESS[chain][fromCurrencyCode],
    topics: topicSets,
    fromBlock: startBlock,
    toBlock: endBlock,
  }
  const logs = await callInfuraApi(chain, 'eth_getLogs', filter)
  if (!amount) return logs
  return logs.filter((log) =>
    ethers.utils
      .parseUnits(String(amount), CURRENCY_DECIMAL[fromCurrencyCode])
      .eq(decodeEventLogData(fromCurrencyCode, log.data)),
  )
}

export const getTransactionToUserByCondition = async (
  chain,
  walletAddress,
  toCurrencyCode,
  startBlock,
  endBlock,
) => {
  let topicSets = [
    EVENT_TOPIC.TRANSFER_ERC20,
    null,
    ethers.utils.hexZeroPad(walletAddress, 32),
  ]

  const filter = {
    address: CURRENCY_ADDRESS[chain][toCurrencyCode],
    topics: topicSets,
    fromBlock: startBlock,
    toBlock: endBlock,
  }
  return callInfuraApi(chain, 'eth_getLogs', filter)
}

export const verifySwapTransactionOnDex = async (
  chain,
  walletAddress,
  fromCurrencyCode,
  toCurrencyCode,
  amount,
  dexAddresses,
  swapTopics,
) => {
  const time = Date.now()
  // Get event transfer from user
  const eventTransferFromUser = await getTransactionFromUserByCondition(
    chain,
    walletAddress,
    fromCurrencyCode,
    amount,
  )
  if (!eventTransferFromUser || eventTransferFromUser.length === 0) {
    return false
  }
  console.log('Event transfer from user: ', eventTransferFromUser)

  // Get event transfer to user
  const startBlock = eventTransferFromUser[0].blockNumber
  const endBlock =
    eventTransferFromUser[eventTransferFromUser.length - 1].blockNumber
  const eventTransferToUser = await getTransactionToUserByCondition(
    chain,
    walletAddress,
    toCurrencyCode,
    startBlock,
    endBlock,
  )
  if (!eventTransferToUser || eventTransferToUser.length === 0) {
    return false
  }
  console.log('Event transfer to user: ', eventTransferToUser)

  // Get transaction hashes
  const fromTransactionHashes = eventTransferFromUser.map(
    (log) => log.transactionHash,
  )
  const toTransactionHashes = eventTransferToUser.map(
    (log) => log.transactionHash,
  )
  console.log(fromTransactionHashes)
  console.log(toTransactionHashes)
  const txHashes = toTransactionHashes.filter((hash) =>
    fromTransactionHashes.includes(hash),
  )
  console.log(txHashes)

  // Verify swap transaction
  // eslint-disable-next-line no-restricted-syntax
  for (const txHash of txHashes) {
    // eslint-disable-next-line no-await-in-loop
    const verified = await isSatisfiedTransactionOnDex(
      chain,
      txHash,
      dexAddresses,
      swapTopics,
    )
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
  addLiquidityTopics,
) => {
  const time = Date.now()
  // Get event transfer first currency from user
  const eventTransferFirstCurrencyFromUser = await getTransactionFromUserByCondition(
    chain,
    walletAddress,
    firstCurrency,
    amount,
  )
  if (
    !eventTransferFirstCurrencyFromUser ||
    eventTransferFirstCurrencyFromUser.length === 0
  ) {
    return false
  }
  console.log(
    'Event transfer first currency from user: ',
    eventTransferFirstCurrencyFromUser,
  )

  // Get event transfer second currency from user
  const startBlock = eventTransferFirstCurrencyFromUser[0].blockNumber
  const endBlock =
    eventTransferFirstCurrencyFromUser[
      eventTransferFirstCurrencyFromUser.length - 1
    ].blockNumber
  const eventTransferSecondCurrencyFromUser = await getTransactionFromUserByCondition(
    chain,
    walletAddress,
    secondCurrency,
    null,
    startBlock,
    endBlock,
  )
  if (
    !eventTransferSecondCurrencyFromUser ||
    eventTransferSecondCurrencyFromUser.length === 0
  ) {
    return false
  }
  console.log(
    'Event transfer second currency from user: ',
    eventTransferSecondCurrencyFromUser,
  )

  // Get transaction hashes
  const firstCurrencyTransactionHashes = eventTransferFirstCurrencyFromUser.map(
    (log) => log.transactionHash,
  )
  const secondCurrencyTransactionHashes = eventTransferSecondCurrencyFromUser.map(
    (log) => log.transactionHash,
  )
  console.log(firstCurrencyTransactionHashes)
  console.log(secondCurrencyTransactionHashes)
  const txHashes = secondCurrencyTransactionHashes.filter((hash) =>
    firstCurrencyTransactionHashes.includes(hash),
  )
  console.log(txHashes)

  // Verify swap transaction
  // eslint-disable-next-line no-restricted-syntax
  for (const txHash of txHashes) {
    // eslint-disable-next-line no-await-in-loop
    const verified = await isSatisfiedTransactionOnDex(
      chain,
      txHash,
      dexAddresses,
      addLiquidityTopics,
    )
    if (verified) {
      console.log('All time: ', Date.now() - time)
      return true
    }
  }
  console.log('All time: ', Date.now() - time)
  return false
}
