// Function to save load time data locally
function saveLoadTimeLocally(url, loadTime) {
    // Check if the URL is undefined or loadTime is 0
    if (!url || loadTime === 0) {
      console.log("Invalid data - URL or load time is not valid:", { url, loadTime });
      return;  // Do not save the data if invalid
    }
  
    chrome.storage.local.get("data", function (result) {
        const data = result.data || [];
        data.push({ url, loadTime });
  
        chrome.storage.local.set({ data }, function () {
            console.log("Load time saved locally:", { url, loadTime });
        });
    });
  }
  
  // Listen for messages to store load time data
  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "setLoadTime") {
      saveLoadTimeLocally(request.url, request.loadTime);
    }
  });
  
  // Displaying the page load time on the extension's icon badge
  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "setLoadTime") {
        const formattedTime = (request.loadTime / 1000).toFixed(2); // Convert to string
      chrome.action.setBadgeText({ text: formattedTime }, () => {
          if (chrome.runtime.lastError) {
              console.error("Failed to set badge text:", chrome.runtime.lastError.message);
          }
      });
  
      // Optionally set the badge color
      chrome.action.setBadgeBackgroundColor({ color: "#4688F1" });
    }
  });
  