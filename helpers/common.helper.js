import { CONFIRMATION_BLOCK } from "@root/helpers/constants"

export const isTransactionOnDex = (txReceipt, dexAddresses) => {
  if (Number(txReceipt.status) !== 1 || !dexAddresses.includes(String(txReceipt.to).toLowerCase())) {
    return false
  }
  return true
}

export const isSpecifyTransaction = (txReceipt, topics) => {
  const specifyLogs = txReceipt.logs.filter((log) => topics.includes(log.topics[0]))
  if (!specifyLogs?.length) {
    return false
  }
  return true
}

export const isConfirmedTransaction = (chain, txReceipt, latestBlockNumber) => {
  const txBlockNumber = parseInt(txReceipt.blockNumber, 16)
  return latestBlockNumber - txBlockNumber >= CONFIRMATION_BLOCK[chain]
}
