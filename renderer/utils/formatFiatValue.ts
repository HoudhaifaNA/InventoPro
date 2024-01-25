const formatFiatValue = (amount: number = 0) => {
  let fiatValue = amount;

  const formattedValue = fiatValue.toFixed(2);

  const fiatText = `${formattedValue} DA`;

  return fiatText;
};

export default formatFiatValue;
