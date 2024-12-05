const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const isValidDateFormat = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(dateString);
};

const parseDate = (dateString, isEndDate = false) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isEndDate) {
    // Set to end of day (23:59:59.999)
    date.setHours(23, 59, 59, 999);
  } else {
    // Set to start of day (00:00:00.000)
    date.setHours(0, 0, 0, 0);
  }
  return date;
};

const getDateRange = (startDate, endDate, period = 'daily') => {
  const start = parseDate(startDate);
  const end = parseDate(endDate, true);

  if (!start || !end) {
    const today = new Date();
    if (period === 'weekly') {
      // Get last 7 days
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      return {
        startDate: weekAgo,
        endDate: today
      };
    } else if (period === 'monthly') {
      // Get last 30 days
      const monthAgo = new Date(today);
      monthAgo.setDate(today.getDate() - 30);
      return {
        startDate: monthAgo,
        endDate: today
      };
    } else {
      // Daily - just today
      return {
        startDate: today,
        endDate: today
      };
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