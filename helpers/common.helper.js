export const isTransactionOnDex = (txReceipt, dexAddresses) => {
  if (
    Number(txReceipt.status) !== 1 ||
    !dexAddresses.includes(String(txReceipt.to).toLowerCase())
  ) {
    return false
  }
  return true
}

export const isSpecifyTransaction = (txReceipt, topics) => {
  const specifyLogs = txReceipt.logs.filter((log) =>
    topics.includes(log.topics[0]),
  )
  if (!specifyLogs || specifyLogs.length === 0) {
    return false
  }
  return true
}
