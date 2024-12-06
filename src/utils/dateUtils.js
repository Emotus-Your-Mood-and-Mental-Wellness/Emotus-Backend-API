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
  const regex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?$/;
  return regex.test(dateString);
};

const parseDate = (dateString, isEndDate = false) => {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  if (isEndDate) {
    date.setUTCHours(23, 59, 59, 999);
  } else {
    date.setUTCHours(0, 0, 0, 0);
  }
  
  return date;
};

const getDateRange = (startDate, endDate, period = 'daily') => {
  let start, end;

  if (startDate && endDate) {
    // If explicit dates are provided, use them with proper UTC time
    start = new Date(startDate);
    end = new Date(endDate);
    
    // Ensure proper UTC time ranges
    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(23, 59, 59, 999);
  } else {
    // If no dates provided, calculate based on period using UTC
    const now = new Date();
    
    switch (period) {
      case 'weekly':
        end = new Date(now);
        end.setUTCHours(23, 59, 59, 999);
        
        start = new Date(now);
        start.setUTCDate(start.getUTCDate() - 6); // Last 7 days including today
        start.setUTCHours(0, 0, 0, 0);
        break;
        
      case 'monthly':
        end = new Date(now);
        end.setUTCHours(23, 59, 59, 999);
        
        start = new Date(now);
        start.setUTCDate(1); // Start from the first day of current month
        start.setUTCHours(0, 0, 0, 0);
        break;
        
      default: // daily
        // For daily, use the same date for both start and end
        start = new Date(now);
        start.setUTCHours(0, 0, 0, 0);
        
        end = new Date(now);
        end.setUTCHours(23, 59, 59, 999);
        break;
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