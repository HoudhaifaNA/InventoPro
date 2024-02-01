const formatFiatValue = (amount: number = 0) => {
  let fiatValue = amount;

  const fiatText = `${fiatValue.toLocaleString()} DA`;

  return fiatText;
};

export default formatFiatValue;
