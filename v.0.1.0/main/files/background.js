// Displaying the page load time on the extension's icon badge
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "setLoadTime") {
    const formattedTime = (request.loadTime / 1000).toFixed(2);
    chrome.action.setBadgeText({ text: formattedTime });
  }
});
