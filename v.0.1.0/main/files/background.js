// Function to save load time data locally
function saveLoadTimeLocally(url, loadTime) {
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
    const formattedTime = request.loadTime.toString(); // Convert to string
    chrome.action.setBadgeText({ text: formattedTime }, () => {
        if (chrome.runtime.lastError) {
            console.error("Failed to set badge text:", chrome.runtime.lastError.message);
        }
    });

    // Optionally set the badge color
    chrome.action.setBadgeBackgroundColor({ color: "#4688F1" });
}
});
