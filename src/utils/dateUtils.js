const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString();
};

const isValidDateFormat = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?$/;
  return regex.test(dateString);
};

const parseDate = (dateString, isEndDate = false) => {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  if (isEndDate) {
    date.setHours(23, 59, 59, 999);
  } else {
    date.setHours(0, 0, 0, 0);
  }
  
  return date;
};

const getDateRange = (startDate, endDate, period = 'daily') => {
  let start, end;

  if (startDate && endDate) {
    start = new Date(startDate);
    end = new Date(endDate);
  } else {
    end = new Date();
    start = new Date(end);

    switch (period) {
      case 'weekly':
        start.setDate(end.getDate() - 6);
        break;
        
      case 'monthly':
        start.setMonth(end.getMonth() - 1);
        break;
        
      case 'daily':
      default:
        start.setHours(0, 0, 0, 0);
        break;
    }
  }

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return { 
    startDate: start,
    endDate: end
  };
};

module.exports = {
  formatDate,
  isValidDateFormat,
  parseDate,
  getDateRange
};