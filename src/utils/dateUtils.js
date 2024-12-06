const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const isValidDateFormat = (dateString) => {
  // Updated regex to allow for ISO datetime format with less precision
  const regex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?$/;
  return regex.test(dateString);
};

const parseDate = (dateString, isEndDate = false) => {
  if (!dateString) return null;
  
  // Create date object and handle timezone offset
  const date = new Date(dateString);
  if (isEndDate) {
    date.setUTCHours(23, 59, 59, 999);
  } else {
    date.setUTCHours(0, 0, 0, 0);
  }
  
  return date;
};

const getDateRange = (startDate, endDate, period = 'daily') => {
  const today = new Date();
  let start, end;

  if (startDate && endDate) {
    // Use the exact dates provided without modification
    start = new Date(startDate);
    end = new Date(endDate);
    
    // Set proper time for start and end
    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(23, 59, 59, 999);
  } else {
    end = new Date(today);
    end.setUTCHours(23, 59, 59, 999);

    switch (period) {
      case 'weekly':
        start = new Date(today);
        start.setDate(today.getDate() - 7);
        start.setUTCHours(0, 0, 0, 0);
        break;
      case 'monthly':
        start = new Date(today);
        start.setMonth(today.getMonth() - 1);
        start.setUTCHours(0, 0, 0, 0);
        break;
      default: // daily
        start = new Date(today);
        start.setUTCHours(0, 0, 0, 0);
    }
  }

  return { startDate: start, endDate: end };
};

module.exports = {
  formatDate,
  isValidDateFormat,
  parseDate,
  getDateRange
};