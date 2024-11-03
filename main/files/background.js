chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "setLoadTime") {
    const loadTime = request.loadTime;
    
    // Ensure loadTime is a valid number
    if (typeof loadTime === 'number' && !isNaN(loadTime)) {
      const formattedTime = (loadTime / 1000).toFixed(2); // Convert to seconds and format to 2 decimal places
      
      // Set the badge text with the formatted time
      chrome.action.setBadgeText({ text: formattedTime });
      
      // Optional: Log the action for debugging
      console.log(`Action: ${request.action}, Load Time: ${formattedTime} seconds`);
    } else {
      console.error('Invalid load time received:', loadTime);
    }
    
    // Optionally send a response
    sendResponse({ success: true, loadTime: formattedTime });
  }
});
