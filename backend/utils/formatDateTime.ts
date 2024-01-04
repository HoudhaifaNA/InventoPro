function isValidDate(date: Date): boolean {
  return date && Object.prototype.toString.call(date) === '[object Date]' && !isNaN(Number(date));
}

const formatDateTime = (inputDate: string | Date) => {
  const isInputDateString = typeof inputDate === 'string';
  const dateObject = isInputDateString ? new Date(inputDate) : inputDate;

  if (!isValidDate(dateObject)) {
    throw Error('Invalid date');
  }

  const padLeft = (value: number, length = 2, fillChar = '0') => `${value}`.padStart(length, fillChar);

  const formattedDate = `${dateObject.getFullYear()}-${padLeft(dateObject.getMonth() + 1)}-${padLeft(
    dateObject.getDate()
  )}`;
  const formattedTime = `${padLeft(dateObject.getHours())}:${padLeft(dateObject.getMinutes())}:${padLeft(
    dateObject.getSeconds()
  )}`;

  return `${formattedDate} ${formattedTime}`;
};

export default formatDateTime;
