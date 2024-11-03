chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "setLoadTime") {
    const formattedTime = (request.loadTime / 1000);
    chrome.action.setBadgeText({ text: formattedTime });
  }
});
