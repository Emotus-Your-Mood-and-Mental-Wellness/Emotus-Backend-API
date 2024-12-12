// Define mood constants
const MOODS = {
    HAPPY: 'Happy',
    SADNESS: 'Sadness',
    ANGER: 'Anger',
    FEAR: 'Fear',
    LOVE: 'Love'
  };
  
  // Get array of valid moods
  const VALID_MOODS = Object.values(MOODS);
  
  module.exports = {
    MOODS,
    VALID_MOODS
  };