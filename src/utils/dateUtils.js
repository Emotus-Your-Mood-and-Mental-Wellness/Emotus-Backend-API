const formatDate = (date) => {
  return date.toISOString();
};

const isValidDateFormat = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
  return regex.test(dateString);
};

const parseDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

module.exports = {
  formatDate,
  isValidDateFormat,
  parseDate
};