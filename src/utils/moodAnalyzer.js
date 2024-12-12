function analyzeMoodEntries(entries) {
    const moodCounts = entries.reduce((acc, entry) => {
      const mood = entry.mood || entry.predictedMood || 'Unknown';
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {});
  
    const dominantMood = Object.entries(moodCounts)
      .sort(([, a], [, b]) => b - a)[0][0];
  
    const stressLevels = entries.map(entry => entry.stressLevel || 0);
    const averageStress = stressLevels.reduce((a, b) => a + b, 0) / stressLevels.length;
    
    let dominantStressLevel = 'Low';
    if (averageStress > 7) {
      dominantStressLevel = 'High';
    } else if (averageStress > 4) {
      dominantStressLevel = 'Medium';
    }
  
    return {
      dominantMood,
      dominantStressLevel,
      averageStressLevel: averageStress
    };
  }
  
  module.exports = {
    analyzeMoodEntries  
  };