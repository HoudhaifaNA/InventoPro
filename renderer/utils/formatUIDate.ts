function isValidDate(date: Date): boolean {
  return date && Object.prototype.toString.call(date) === '[object Date]' && !isNaN(Number(date));
}

function formatUIDate(inputDate?: string | Date | null) {
  if (!inputDate) return 'N/A';
  const isInputDateString = typeof inputDate === 'string';
  const dateObject = isInputDateString ? new Date(inputDate) : inputDate;

  if (!isValidDate(dateObject)) {
    throw Error('Invalid date');
  }

  const day = String(dateObject.getDate()).padStart(2, '0');
  const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = dateObject.getFullYear();

  const formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
}

export default formatUIDate;
