const getRandomElement = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };
  
  const removeDuplicates = (array) => {
    return [...new Set(array)];
  };
  
  const getRandomSet = (array) => {
    return getRandomElement(array);
  };
  
  const getMoodMessages = (messages, stressLevel = 'medium') => {
    const sympathyMessage = getRandomElement(messages.sympathyMessages);
    let thoughtfulSuggestions = getRandomSet(messages.thoughtfulSuggestions);
    let thingsToDo = getRandomSet(messages.thingsToDo);
  
    // Add stress-specific suggestions
    if (stressLevel === 'high') {
      const calmingActivity = "Ambil waktu sejenak untuk bernapas dalam";
      const relaxationTechnique = "Lakukan teknik relaksasi progressive muscle relaxation";
  
      // Only add if not already present
      if (!thoughtfulSuggestions.includes(calmingActivity)) {
        thoughtfulSuggestions = [calmingActivity, ...thoughtfulSuggestions];
      }
      if (!thingsToDo.includes(relaxationTechnique)) {
        thingsToDo = [relaxationTechnique, ...thingsToDo];
      }
    }
  
    // Remove any duplicates that might have been added
    return {
      sympathyMessage,
      thoughtfulSuggestions: removeDuplicates(thoughtfulSuggestions),
      thingsToDo: removeDuplicates(thingsToDo)
    };
  };
  
  module.exports = {
    getMoodMessages,
    getRandomElement,
    getRandomSet
  };