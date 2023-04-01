import { CURRENCY_INFO } from "@root/helpers/constants";
import { defaultAbiCoder } from "ethers/lib/utils";

export const decodeEventLogData = (currencyAddress, data) => {
  if (currencyAddress === CURRENCY_INFO.POLYGON.MATIC.address) {
    const [amount] = defaultAbiCoder.decode(
      ["uint256", "uint256", "uint256", "uint256", "uint256"],
      data
    );
    return amount;
  }
  return defaultAbiCoder.decode(["uint256"], data)[0];
};
