export const truncateBankAccountNumber = (accountNumber: string) => {
  return `****${accountNumber.slice(-4)}`;
};

export default truncateBankAccountNumber;
